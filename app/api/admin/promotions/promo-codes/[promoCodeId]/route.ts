import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PATCH /api/admin/promotions/promo-codes/[promoCodeId] - Update a promo code
export async function PATCH(
  request: NextRequest,
  { params }: { params: { promoCodeId: string } }
) {
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

    const updateData: any = {}
    
    if (code !== undefined) updateData.code = code.toUpperCase().trim()
    if (discountType !== undefined) updateData.discountType = discountType
    if (discountValue !== undefined) {
      const value = parseFloat(discountValue)
      if (discountType === 'percentage' && (value < 0 || value > 100)) {
        return NextResponse.json(
          { error: 'Percentage discount must be between 0 and 100' },
          { status: 400 }
        )
      }
      if (discountType === 'fixed' && value < 0) {
        return NextResponse.json(
          { error: 'Fixed discount must be greater than or equal to 0' },
          { status: 400 }
        )
      }
      updateData.discountValue = value
    }
    if (minimumOrder !== undefined) updateData.minimumOrder = minimumOrder ? parseFloat(minimumOrder) : null
    if (isActive !== undefined) updateData.isActive = isActive
    if (expiryDate !== undefined) updateData.expiryDate = expiryDate ? new Date(expiryDate) : null

    const promoCode = await prisma.promoCode.update({
      where: { id: params.promoCodeId },
      data: updateData
    })

    return NextResponse.json({ promoCode })
  } catch (error: any) {
    console.error('Error updating promo code:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Promo code already exists' },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Promo code not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update promo code' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/promotions/promo-codes/[promoCodeId] - Delete a promo code
export async function DELETE(
  request: NextRequest,
  { params }: { params: { promoCodeId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = (session.user as any).isAdmin === true
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    await prisma.promoCode.delete({
      where: { id: params.promoCodeId }
    })

    return NextResponse.json({ message: 'Promo code deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting promo code:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Promo code not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete promo code' },
      { status: 500 }
    )
  }
}
