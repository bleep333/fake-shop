import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/orders - Fetch orders for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user by email (since auth uses email-based fake users)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ orders: [] })
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: user.id
      },
      include: {
        items: true
      },
      orderBy: {
        orderDate: 'desc'
      },
      take: 3 // Limit to 3 most recent orders
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      orderNumber,
      customerDetails,
      paymentMethod,
      cartItems,
      subtotal,
      shipping,
      tax,
      total
    } = body

    // Find or create user by email (since auth uses email-based fake users)
    let user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      // Create user if doesn't exist
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || null
        }
      })
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderNumber,
        customerDetails: customerDetails as any,
        paymentMethod,
        subtotal,
        shipping,
        tax,
        total,
        items: {
          create: cartItems.map((item: any) => ({
            productData: item.product as any,
            quantity: item.quantity,
            size: item.size,
            price: item.product.price
          }))
        }
      },
      include: {
        items: true
      }
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
