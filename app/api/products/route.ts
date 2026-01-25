import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const gender = searchParams.get('gender') as 'mens' | 'womens' | 'unisex' | null
    const categories = searchParams.getAll('category') // Handle multiple categories
    const tags = searchParams.getAll('tag') // Handle multiple tags
    const sortBy = searchParams.get('sortBy') || 'newest'
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    // Build where clause - use AND array to combine conditions properly
    const conditions: any[] = []
    
    if (gender) {
      conditions.push({
        OR: [
          { gender: gender },
          { gender: 'unisex' }
        ]
      })
    }
    
    if (categories.length > 0) {
      conditions.push({
        category: { in: categories }
      })
    }
    
    if (tags.length > 0) {
      // For multiple tags, we want products that have all of them
      if (tags.length === 1) {
        conditions.push({
          tags: { has: tags[0] }
        })
      } else {
        conditions.push({
          tags: { hasEvery: tags }
        })
      }
    }
    
    if (minPrice || maxPrice) {
      const priceCondition: any = {}
      if (minPrice) {
        priceCondition.gte = parseFloat(minPrice)
      }
      if (maxPrice) {
        priceCondition.lte = parseFloat(maxPrice)
      }
      conditions.push({ basePrice: priceCondition })
    }

    // Only show active and visible products to customers
    conditions.push({
      status: 'active'
    })
    conditions.push({
      isVisible: true
    })

    const whereClause = conditions.length > 0 ? { AND: conditions } : {}

    // Build orderBy clause
    let orderBy: any = {}
    switch (sortBy) {
      case 'price-low':
        orderBy = { basePrice: 'asc' }
        break
      case 'price-high':
        orderBy = { basePrice: 'desc' }
        break
      case 'newest':
      default:
        // For newest, sort by createdAt descending
        orderBy = { createdAt: 'desc' }
        break
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy,
    })

    return NextResponse.json({ products })
  } catch (error: any) {
    console.error('Error fetching products:', error)
    
    // Fallback to mock products if database fails
    try {
      const { mockProducts } = await import('@/lib/mockProducts')
      let filteredProducts = mockProducts
      
      // Apply basic filtering to mock products
      const gender = request.nextUrl.searchParams.get('gender') as 'mens' | 'womens' | 'unisex' | null
      if (gender) {
        filteredProducts = filteredProducts.filter(p => p.gender === gender || p.gender === 'unisex')
      }
      
      const categories = request.nextUrl.searchParams.getAll('category')
      if (categories.length > 0) {
        filteredProducts = filteredProducts.filter(p => categories.includes(p.category))
      }
      
      return NextResponse.json({ products: filteredProducts })
    } catch (mockError) {
      console.error('Error loading mock products:', mockError)
      return NextResponse.json(
        { error: 'Failed to fetch products', products: [] },
        { status: 500 }
      )
    }
  }
}

