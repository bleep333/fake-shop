import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/admin/products/bulk-stock - Bulk update stock for multiple products (admin only)
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
    const { updates } = body // Array of { productId, stockBySize }

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'updates array is required' },
        { status: 400 }
      )
    }

    // Use transaction to update all products
    const results = await prisma.$transaction(
      updates.map((update: { productId: string; stockBySize: Record<string, number> }) =>
        prisma.product.update({
          where: { id: update.productId },
          data: { stockBySize: update.stockBySize as any }
        })
      )
    )

    return NextResponse.json({ 
      message: `Updated stock for ${results.length} product(s)`,
      count: results.length
    })
  } catch (error: any) {
    console.error('Error bulk updating stock:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'One or more products not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to bulk update stock' },
      { status: 500 }
    )
  }
}
