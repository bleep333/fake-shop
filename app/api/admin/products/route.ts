import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/products - Get all products (admin only, includes all statuses)
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

    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/admin/products - Create a new product (admin only)
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
      sku,
      name,
      basePrice,
      salePrice,
      category,
      gender,
      image,
      tags,
      sizes,
      stockBySize,
      status,
      isVisible,
      lowStockThreshold
    } = body

    // Generate SKU if not provided
    let productSku = sku
    if (!productSku) {
      // Generate simple SKU based on gender and next available number
      const genderPrefix = (gender === 'mens' || gender === 'womens') ? gender.charAt(0).toUpperCase() : 'P'
      
      // Find the highest existing SKU with this prefix
      const existingProducts = await prisma.product.findMany({
        where: {
          sku: {
            startsWith: `${genderPrefix}-`
          }
        },
        orderBy: {
          sku: 'desc'
        },
        take: 1
      })
      
      let nextNumber = 1
      if (existingProducts.length > 0 && existingProducts[0].sku) {
        const lastSku = existingProducts[0].sku
        const match = lastSku.match(/\d+$/)
        if (match) {
          nextNumber = parseInt(match[0]) + 1
        }
      }
      
      productSku = `${genderPrefix}-${String(nextNumber).padStart(3, '0')}`
    }

    const product = await prisma.product.create({
      data: {
        sku: productSku,
        name,
        basePrice: parseFloat(basePrice),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        category,
        gender,
        image,
        tags: tags || [],
        sizes: sizes || [],
        stockBySize: stockBySize || null,
        status: status || 'active',
        isVisible: isVisible !== undefined ? isVisible : true,
        lowStockThreshold: lowStockThreshold || 10,
      }
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Product with this SKU already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/products - Bulk update products (admin only)
export async function PUT(request: NextRequest) {
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
    const { productIds, updates } = body

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'productIds array is required' },
        { status: 400 }
      )
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'updates object is required' },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {}
    if (updates.basePrice !== undefined) updateData.basePrice = parseFloat(updates.basePrice)
    if (updates.salePrice !== undefined) updateData.salePrice = updates.salePrice ? parseFloat(updates.salePrice) : null
    if (updates.status !== undefined) updateData.status = updates.status
    if (updates.isVisible !== undefined) updateData.isVisible = updates.isVisible

    const result = await prisma.product.updateMany({
      where: {
        id: { in: productIds }
      },
      data: updateData
    })

    return NextResponse.json({ 
      message: `Updated ${result.count} product(s)`,
      count: result.count
    })
  } catch (error) {
    console.error('Error bulk updating products:', error)
    return NextResponse.json(
      { error: 'Failed to bulk update products' },
      { status: 500 }
    )
  }
}
