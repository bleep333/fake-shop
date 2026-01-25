import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/products/[productId] - Get a single product (public)
// Supports both database products and mock products for compatibility
export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    // Try Prisma database first
    try {
      const product = await prisma.product.findUnique({
        where: { id: params.productId }
      })

      if (product) {
        // Only return active and visible products to public
        if (product.status === 'active' && product.isVisible) {
          return NextResponse.json({ product })
        }
      }
    } catch (dbError) {
      // Database might not be available, fall through to mock data
      console.log('Database query failed, trying mock data:', dbError)
    }

    // Fallback to mock products if database product not found
    const { mockProducts } = await import('@/lib/mockProducts')
    const mockProduct = mockProducts.find(p => p.id === params.productId)
    
    if (mockProduct) {
      return NextResponse.json({ product: mockProduct })
    }

    // Product not found in either source
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PATCH /api/products/[productId] - Update product stock (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and is admin
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = (session.user as any).isAdmin === true
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { stockBySize } = body

    if (!stockBySize || typeof stockBySize !== 'object') {
      return NextResponse.json(
        { error: 'Invalid stockBySize value. Must be an object mapping sizes to numbers.' },
        { status: 400 }
      )
    }

    // Validate that all values are non-negative numbers
    for (const [size, stock] of Object.entries(stockBySize)) {
      if (typeof stock !== 'number' || stock < 0) {
        return NextResponse.json(
          { error: `Invalid stock value for size ${size}. Must be a non-negative number.` },
          { status: 400 }
        )
      }
    }

    const product = await prisma.product.update({
      where: { id: params.productId },
      data: { stockBySize: stockBySize as any },
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error updating product stock:', error)
    return NextResponse.json(
      { error: 'Failed to update product stock' },
      { status: 500 }
    )
  }
}
