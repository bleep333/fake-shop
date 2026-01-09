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

    // Use a transaction to ensure order creation and stock updates happen atomically
    const order = await prisma.$transaction(async (tx) => {
      // Group cart items by product ID to handle multiple sizes of the same product
      const itemsByProduct = new Map<string, Array<{ size: string; quantity: number }>>()
      
      for (const item of cartItems) {
        const productId = item.product.id
        if (!itemsByProduct.has(productId)) {
          itemsByProduct.set(productId, [])
        }
        itemsByProduct.get(productId)!.push({
          size: item.size,
          quantity: item.quantity
        })
      }

      // Verify stock and prepare updates for each product
      const stockUpdates: Array<{ productId: string; newStockBySize: Record<string, number> }> = []
      
      for (const [productId, items] of itemsByProduct.entries()) {
        const product = await tx.product.findUnique({
          where: { id: productId }
        })

        if (!product) {
          throw new Error(`Product ${productId} not found`)
        }

        const currentStockBySize = (product.stockBySize as Record<string, number>) || {}
        const newStockBySize = { ...currentStockBySize }

        // Update stock for all sizes of this product
        for (const item of items) {
          const currentStock = currentStockBySize[item.size] || 0

          if (currentStock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name} size ${item.size}. Available: ${currentStock}, Requested: ${item.quantity}`)
          }

          newStockBySize[item.size] = currentStock - item.quantity
        }

        stockUpdates.push({ productId, newStockBySize })
      }

      // Update stock for all products
      for (const update of stockUpdates) {
        await tx.product.update({
          where: { id: update.productId },
          data: { stockBySize: update.newStockBySize as any }
        })
      }

      // Create order with items
      const createdOrder = await tx.order.create({
        data: {
          userId: user.id,
          orderNumber,
          customerDetails: customerDetails as any,
          paymentMethod,
          status: 'paid',
          subtotal,
          shipping,
          tax,
          total,
          items: {
            create: cartItems.map((item: any) => ({
              productData: item.product as any,
              quantity: item.quantity,
              size: item.size,
              price: item.product.salePrice || item.product.basePrice
            }))
          }
        },
        include: {
          items: true
        }
      })

      return createdOrder
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
