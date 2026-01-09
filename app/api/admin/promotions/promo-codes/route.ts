import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/promotions/promo-codes - Get all promo codes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = (session.user as any).isAdmin === true
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const promoCodes = await prisma.promoCode.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Check expiry dates and update active status if needed
    const now = new Date()
    for (const code of promoCodes) {
      if (code.isActive && code.expiryDate && code.expiryDate < now) {
        await prisma.promoCode.update({
          where: { id: code.id },
          data: { isActive: false }
        })
        code.isActive = false
      }
    }

    return NextResponse.json({ promoCodes })
  } catch (error) {
    console.error('Error fetching promo codes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promo codes' },
      { status: 500 }
    )
  }
}

// POST /api/admin/promotions/promo-codes - Create a new promo code
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = (session.user as any).isAdmin === true
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const {
      code,
      discountType,
      discountValue,
      minimumOrder,
      isActive,
      expiryDate
    } = body

    if (!code || !discountType || discountValue === undefined) {
      return NextResponse.json(
        { error: 'Code, discountType, and discountValue are required' },
        { status: 400 }
      )
    }

    // Validate discount value
    if (discountType === 'percentage' && (discountValue < 0 || discountValue > 100)) {
      return NextResponse.json(
        { error: 'Percentage discount must be between 0 and 100' },
        { status: 400 }
      )
    }

    if (discountType === 'fixed' && discountValue < 0) {
      return NextResponse.json(
        { error: 'Fixed discount must be greater than or equal to 0' },
        { status: 400 }
      )
    }

    const promoCode = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase().trim(),
        discountType,
        discountValue: parseFloat(discountValue),
        minimumOrder: minimumOrder ? parseFloat(minimumOrder) : null,
        isActive: isActive !== undefined ? isActive : true,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        usageCount: 0
      }
    })

    return NextResponse.json({ promoCode }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating promo code:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Promo code already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create promo code' },
      { status: 500 }
    )
  }
}
