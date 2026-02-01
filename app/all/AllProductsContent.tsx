'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import FilterSidebar from '@/components/FilterSidebar'
import { getProducts, filterProductsBySize, FilterOptions, SortOption } from '@/lib/products'
import { Product } from '@/lib/mockProducts'
import { staggerContainer, staggerFadeUp } from '@/lib/motion.config'

export default function AllProductsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [filters, setFilters] = useState<FilterOptions>({})
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | undefined>(undefined)
  const [availableColors, setAvailableColors] = useState<string[]>([])
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const productsPerPage = 12

  useEffect(() => {
    // Check for all filter params in URL
    const category = searchParams.getAll('category')
    const tags = searchParams.getAll('tag')
    const colors = searchParams.getAll('color')
    const sizes = searchParams.getAll('size')
    const maxPrice = searchParams.get('maxPrice')
    
    const newFilters: FilterOptions = {}
    
    if (category.length > 0) {
      newFilters.category = category
    }
    
    if (tags.length > 0) {
      newFilters.tags = tags
    }
    
    if (colors.length > 0) {
      newFilters.color = colors
    }
    
    if (sizes.length > 0) {
      newFilters.size = sizes
    }
    
    if (maxPrice) {
      newFilters.maxPrice = parseFloat(maxPrice)
    }
    
    // Only update if there are actual filters
    if (Object.keys(newFilters).length > 0) {
      setFilters(newFilters)
    } else {
      // Clear filters if no URL params
      setFilters({})
    }
  }, [searchParams])

  // Calculate price range and get available colors from all products
  useEffect(() => {
    async function calculatePriceRangeAndColors() {
      try {
        const allProducts = await getProducts({
          sortBy: 'price-low',
        })
        if (allProducts.length > 0) {
          const prices = allProducts.map(p => p.salePrice || p.basePrice)
          setPriceRange({
            min: Math.min(...prices),
            max: Math.max(...prices),
          })
          
          // Extract unique colors
          const colors = Array.from(new Set(
            allProducts
              .map(p => p.color)
              .filter((color): color is string => !!color)
          )).sort()
          setAvailableColors(colors)
          
          // Extract unique categories (all categories without duplicates)
          const categories = Array.from(new Set(
            allProducts.map(p => p.category)
          )).sort()
          setAvailableCategories(categories)
        }
      } catch (error) {
        console.error('Failed to calculate price range, colors, and categories:', error)
      }
    }
    calculatePriceRangeAndColors()
  }, [])

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      try {
        // Don't filter by gender - get all products
        const fetchedProducts = await getProducts({
          category: filters.category,
          tags: filters.tags,
          maxPrice: filters.maxPrice,
          sortBy,
        })
        // Apply size and color filters on client side
        let filtered = filterProductsBySize(fetchedProducts, filters.size)
        
        // Filter by color
        if (filters.color && filters.color.length > 0) {
          filtered = filtered.filter(p => p.color && filters.color!.includes(p.color))
        }
        
        setProducts(filtered)
        setCurrentPage(1) // Reset to first page when filters change
      } catch (error) {
        console.error('Failed to load products:', error)
        // Ensure loading state is cleared even on error to prevent blank screen
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [filters, sortBy])

  // Keep previous products during loading to prevent flash
  const [displayProducts, setDisplayProducts] = useState<Product[]>([])
  
  useEffect(() => {
    // Only update display products when loading completes
    if (!loading) {
      setDisplayProducts(products)
    }
  }, [loading, products])

  const totalPages = Math.ceil(displayProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = displayProducts.slice(startIndex, startIndex + productsPerPage)

  return (
    <div className="w-full py-8">
      {/* Collection Header */}
      <div className="mb-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-3">All Products</h1>
        <p className="text-stone-600 text-base">
          Discover our complete collection. From casual to formal, find your perfect style.
        </p>
      </div>

      {/* Main Content - Sidebar + Products */}
      <div className="flex gap-12 px-4 sm:px-6 lg:px-8">
        {/* Filter Sidebar - Always Visible on Desktop */}
        <aside className="hidden lg:block flex-shrink-0">
          <FilterSidebar 
            filters={filters} 
            onFiltersChange={(newFilters) => {
              setFilters(newFilters)
              // Update URL with new filters
              const params = new URLSearchParams()
              if (newFilters.category && newFilters.category.length > 0) {
                newFilters.category.forEach(cat => params.append('category', cat))
              }
              if (newFilters.tags && newFilters.tags.length > 0) {
                newFilters.tags.forEach(tag => params.append('tag', tag))
              }
              if (newFilters.color && newFilters.color.length > 0) {
                newFilters.color.forEach(color => params.append('color', color))
              }
              if (newFilters.size && newFilters.size.length > 0) {
                newFilters.size.forEach(size => params.append('size', size))
              }
              if (newFilters.maxPrice !== undefined) {
                params.append('maxPrice', newFilters.maxPrice.toString())
              }
              const queryString = params.toString()
              router.push(queryString ? `/all?${queryString}` : '/all', { scroll: false })
            }} 
            priceRange={priceRange}
            availableColors={availableColors}
            availableCategories={availableCategories}
            currentGender={undefined}
          />
        </aside>

        {/* Products Section */}
        <div className="flex-1">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-md hover:bg-stone-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>

          {/* Sort and Results Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-base font-semibold text-stone-900">
              {loading ? 'Loading...' : `${displayProducts.length} total`}
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-base font-semibold text-stone-900">Sort</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption)
                  setCurrentPage(1)
                }}
                className="px-4 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-base bg-white font-medium"
              >
                <option value="newest">Relevance</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price (lowest first)</option>
                <option value="price-high">Price (highest first)</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {displayProducts.length === 0 && loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-stone-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : paginatedProducts.length > 0 ? (
            <>
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 relative ${loading ? 'opacity-60' : 'opacity-100'} transition-opacity duration-200`}
              >
                {loading && (
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                    <div className="bg-white px-4 py-2 rounded-md shadow-md">
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm text-stone-700">Loading...</span>
                      </div>
                    </div>
                  </div>
                )}
                {paginatedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={staggerFadeUp}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-stone-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50 transition-colors focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-stone-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-stone-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50 transition-colors focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-stone-600">No products found. Try adjusting your filters.</p>
            </div>
          )}

          {/* Mobile Filter Drawer */}
          {isFilterOpen && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setIsFilterOpen(false)}
              />
              <div className="fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-xl p-6 overflow-y-auto lg:hidden">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 hover:bg-stone-100 rounded-full"
                    aria-label="Close filters"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <FilterSidebar 
                  filters={filters} 
                  onFiltersChange={(newFilters) => {
                    setFilters(newFilters)
                    // Update URL with new filters
                    const params = new URLSearchParams()
                    if (newFilters.category && newFilters.category.length > 0) {
                      newFilters.category.forEach(cat => params.append('category', cat))
                    }
                    if (newFilters.tags && newFilters.tags.length > 0) {
                      newFilters.tags.forEach(tag => params.append('tag', tag))
                    }
                    if (newFilters.color && newFilters.color.length > 0) {
                      newFilters.color.forEach(color => params.append('color', color))
                    }
                    if (newFilters.size && newFilters.size.length > 0) {
                      newFilters.size.forEach(size => params.append('size', size))
                    }
                    if (newFilters.maxPrice !== undefined) {
                      params.append('maxPrice', newFilters.maxPrice.toString())
                    }
                    const queryString = params.toString()
                    router.push(queryString ? `/all?${queryString}` : '/all', { scroll: false })
                  }} 
                  priceRange={priceRange}
                  availableColors={availableColors}
                  currentGender={undefined}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
