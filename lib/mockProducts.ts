export type Product = {
  id: string
  name: string
  price: number
  originalPrice?: number
  category: 'shirts' | 'pants' | 'outerwear' | 'accessories'
  gender: 'mens' | 'womens' | 'unisex'
  image: string
  tags: string[]
  sizes?: string[]
}

export const mockProducts: Product[] = [
  // Mens products
  { id: '1', name: 'Classic White Tee', price: 29.99, category: 'shirts', gender: 'mens', image: '/api/placeholder/400/500', tags: ['New'], sizes: ['S', 'M', 'L', 'XL'] },
  { id: '2', name: 'Slim Fit Jeans', price: 79.99, originalPrice: 99.99, category: 'pants', gender: 'mens', image: '/api/placeholder/400/500', tags: ['Sale'], sizes: ['S', 'M', 'L', 'XL'] },
  { id: '3', name: 'Denim Jacket', price: 89.99, category: 'outerwear', gender: 'mens', image: '/api/placeholder/400/500', tags: ['New'], sizes: ['S', 'M', 'L', 'XL'] },
  { id: '4', name: 'Cargo Pants', price: 69.99, category: 'pants', gender: 'mens', image: '/api/placeholder/400/500', tags: [], sizes: ['S', 'M', 'L', 'XL'] },
  { id: '5', name: 'Polo Shirt', price: 49.99, category: 'shirts', gender: 'mens', image: '/api/placeholder/400/500', tags: ['New'], sizes: ['S', 'M', 'L', 'XL'] },
  { id: '6', name: 'Hooded Sweatshirt', price: 59.99, originalPrice: 79.99, category: 'outerwear', gender: 'mens', image: '/api/placeholder/400/500', tags: ['Sale'], sizes: ['S', 'M', 'L', 'XL'] },
  { id: '7', name: 'Chino Pants', price: 64.99, category: 'pants', gender: 'mens', image: '/api/placeholder/400/500', tags: [], sizes: ['S', 'M', 'L', 'XL'] },
  { id: '8', name: 'Button Down Shirt', price: 54.99, category: 'shirts', gender: 'mens', image: '/api/placeholder/400/500', tags: ['New'], sizes: ['S', 'M', 'L', 'XL'] },
  
  // Womens products
  { id: '9', name: 'Floral Summer Dress', price: 89.99, category: 'shirts', gender: 'womens', image: '/api/placeholder/400/500', tags: ['New'], sizes: ['S', 'M', 'L', 'XL'] },
  { id: '10', name: 'High-Waist Jeans', price: 79.99, originalPrice: 99.99, category: 'pants', gender: 'womens', image: '/api/placeholder/400/500', tags: ['Sale'], sizes: ['S', 'M', 'L', 'XL'] },
  { id: '11', name: 'Cropped Blazer', price: 119.99, category: 'outerwear', gender: 'womens', image: '/api/placeholder/400/500', tags: ['New'], sizes: ['S', 'M', 'L', 'XL'] },
  { id: '12', name: 'Wide Leg Pants', price: 69.99, category: 'pants', gender: 'womens', image: '/api/placeholder/400/500', tags: [], sizes: ['S', 'M', 'L', 'XL'] },
  { id: '13', name: 'Silk Blouse', price: 94.99, category: 'shirts', gender: 'womens', image: '/api/placeholder/400/500', tags: ['New'], sizes: ['S', 'M', 'L', 'XL'] },
  { id: '14', name: 'Trench Coat', price: 149.99, originalPrice: 199.99, category: 'outerwear', gender: 'womens', image: '/api/placeholder/400/500', tags: ['Sale'], sizes: ['S', 'M', 'L', 'XL'] },
  { id: '15', name: 'Midi Skirt', price: 59.99, category: 'pants', gender: 'womens', image: '/api/placeholder/400/500', tags: [], sizes: ['S', 'M', 'L', 'XL'] },
  { id: '16', name: 'Knit Sweater', price: 79.99, category: 'outerwear', gender: 'womens', image: '/api/placeholder/400/500', tags: ['New'], sizes: ['S', 'M', 'L', 'XL'] },
]

export type FilterOptions = {
  category?: string[]
  size?: string[]
  minPrice?: number
  maxPrice?: number
}

export type SortOption = 'newest' | 'price-low' | 'price-high'

export function filterProducts(
  products: Product[],
  filters: FilterOptions,
  gender?: 'mens' | 'womens'
): Product[] {
  let filtered = [...products]

  if (gender) {
    filtered = filtered.filter(p => p.gender === gender || p.gender === 'unisex')
  }

  if (filters.category && filters.category.length > 0) {
    filtered = filtered.filter(p => filters.category!.includes(p.category))
  }

  if (filters.size && filters.size.length > 0) {
    filtered = filtered.filter(p => 
      p.sizes && p.sizes.some(s => filters.size!.includes(s))
    )
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= filters.minPrice!)
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= filters.maxPrice!)
  }

  return filtered
}

export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sorted = [...products]

  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => {
        const aIsNew = a.tags.includes('New') ? 1 : 0
        const bIsNew = b.tags.includes('New') ? 1 : 0
        return bIsNew - aIsNew
      })
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price)
    default:
      return sorted
  }
}

