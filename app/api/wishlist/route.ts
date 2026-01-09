import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/wishlist - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      include: {
        product: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Only return active and visible products
    const products = wishlistItems
      .map(item => item.product)
      .filter(product => product.status === 'active' && product.isVisible)

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

// POST /api/wishlist - Add product to wishlist
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Check if product exists and is active/visible
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product || product.status !== 'active' || !product.isVisible) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Add to wishlist (upsert to handle duplicates)
    await prisma.wishlistItem.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId
        }
      },
      create: {
        userId: user.id,
        productId: productId
      },
      update: {} // No update needed if it exists
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}

// DELETE /api/wishlist - Remove product from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    await prisma.wishlistItem.deleteMany({
      where: {
        userId: user.id,
        productId: productId
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
}

// PUT /api/wishlist - Update entire wishlist (sync)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { productIds } = body

    if (!Array.isArray(productIds)) {
      return NextResponse.json({ error: 'Product IDs must be an array' }, { status: 400 })
    }

    // Delete all existing wishlist items
    await prisma.wishlistItem.deleteMany({
      where: { userId: user.id }
    })

    // Add new items
    if (productIds.length > 0) {
      // Verify all products exist and are active/visible
      const products = await prisma.product.findMany({
        where: {
          id: { in: productIds },
          status: 'active',
          isVisible: true
        }
      })

      const validProductIds = products.map(p => p.id)

      if (validProductIds.length > 0) {
        await prisma.wishlistItem.createMany({
          data: validProductIds.map(productId => ({
            userId: user.id,
            productId
          })),
          skipDuplicates: true
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to update wishlist' },
      { status: 500 }
    )
  }
}
