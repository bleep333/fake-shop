import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/products/[productId] - Get a single product (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
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

    const product = await prisma.product.findUnique({
      where: { id: params.productId }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/products/[productId] - Update a product (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { productId: string } }
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

    // Build update data from body
    const updateData: any = {}
    if (body.sku !== undefined) updateData.sku = body.sku
    if (body.name !== undefined) updateData.name = body.name
    if (body.basePrice !== undefined) updateData.basePrice = parseFloat(body.basePrice)
    if (body.salePrice !== undefined) updateData.salePrice = body.salePrice ? parseFloat(body.salePrice) : null
    if (body.category !== undefined) updateData.category = body.category
    if (body.gender !== undefined) updateData.gender = body.gender
    if (body.color !== undefined) updateData.color = body.color || null
    if (body.image !== undefined) updateData.image = body.image
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.sizes !== undefined) updateData.sizes = body.sizes
    if (body.stockBySize !== undefined) updateData.stockBySize = body.stockBySize
    if (body.status !== undefined) updateData.status = body.status
    if (body.isVisible !== undefined) updateData.isVisible = body.isVisible
    if (body.lowStockThreshold !== undefined) updateData.lowStockThreshold = parseInt(body.lowStockThreshold)

    const product = await prisma.product.update({
      where: { id: params.productId },
      data: updateData
    })

    return NextResponse.json({ product })
  } catch (error: any) {
    console.error('Error updating product:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Product with this SKU already exists' },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/products/[productId] - Delete a product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
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

    await prisma.product.delete({
      where: { id: params.productId }
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
