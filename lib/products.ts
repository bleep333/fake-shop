import { Product, FilterOptions, SortOption } from './mockProducts'

export async function getProducts(filters?: {
  gender?: 'mens' | 'womens' | 'unisex'
  category?: string[]
  minPrice?: number
  maxPrice?: number
  sortBy?: SortOption
}): Promise<Product[]> {
  const params = new URLSearchParams()
  
  if (filters?.gender) params.append('gender', filters.gender)
  if (filters?.category && filters.category.length > 0) {
    filters.category.forEach(cat => params.append('category', cat))
  }
  if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString())
  if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString())
  if (filters?.sortBy) params.append('sortBy', filters.sortBy)

  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXTAUTH_URL || 'http://localhost:3000'

  const response = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  const data = await response.json()
  return data.products
}

// Client-side filtering for size (since it's complex with arrays)
// Filters products to only show those with at least one selected size available in stock
export function filterProductsBySize(products: Product[], sizes?: string[]): Product[] {
  if (!sizes || sizes.length === 0) return products
  
  return products.filter(p => {
    // Check if product has stockBySize data
    if (!p.stockBySize) return false
    
    // Check if at least one of the selected sizes has stock > 0
    return sizes.some(size => {
      const stock = p.stockBySize[size] || 0
      return stock > 0
    })
  })
}

// Keep the types exported for compatibility
export type { Product, FilterOptions, SortOption } from './mockProducts'

