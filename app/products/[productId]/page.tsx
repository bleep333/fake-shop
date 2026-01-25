// Server Component - Fetches product data server-side
// Passes data to ProductPageClient for animations and interactivity

import { notFound } from 'next/navigation'
import ProductPageClient from './ProductPageClient'
import { Product } from '@/lib/mockProducts'

interface ProductPageProps {
  params: {
    productId: string
  }
}

// Server-side product fetch with Prisma and mock data fallback
// This ensures compatibility whether products come from database or mock data
async function getProduct(productId: string): Promise<Product | null> {
  try {
    // Try Prisma database first (most efficient for server components)
    const { prisma } = await import('@/lib/prisma')
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (product && product.status === 'active' && product.isVisible) {
      // Convert Prisma product to Product type
      return {
        id: product.id,
        name: product.name,
        basePrice: product.basePrice,
        salePrice: product.salePrice || undefined,
        category: product.category as 'shirts' | 'pants' | 'outerwear' | 'accessories',
        gender: product.gender as 'mens' | 'womens' | 'unisex',
        image: product.image,
        description: product.description || undefined,
        tags: product.tags,
        sizes: product.sizes,
        stockBySize: product.stockBySize as Record<string, number> | undefined,
      } as Product
    }
  } catch (dbError) {
    // Database might not be available or product not found, try mock data
    console.log('Database query failed or product not found, trying mock data')
  }

  // Fallback to mock products if database product not found
  try {
    const { mockProducts } = await import('@/lib/mockProducts')
    const mockProduct = mockProducts.find(p => p.id === productId)
    
    if (mockProduct) {
      return mockProduct
    }
  } catch (mockError) {
    console.error('Error loading mock products:', mockError)
  }

  return null
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProduct(params.productId)

  if (!product) {
    notFound()
  }

  // Render client component with server-fetched product data
  return <ProductPageClient product={product} />
}
