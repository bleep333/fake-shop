'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import FilterSidebar from '@/components/FilterSidebar'
import { getProducts, filterProductsBySize, FilterOptions, SortOption } from '@/lib/products'
import { Product } from '@/lib/mockProducts'
import { staggerContainer, staggerFadeUp } from '@/lib/motion.config'

export default function MensContent() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<FilterOptions>({})
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | undefined>(undefined)
  const productsPerPage = 12

  useEffect(() => {
    // Check for category in URL params
    const category = searchParams.get('category')
    if (category) {
      setFilters({ category: [category] })
    }
  }, [searchParams])

  // Calculate price range from all mens products
  useEffect(() => {
    async function calculatePriceRange() {
      try {
        const allProducts = await getProducts({
          gender: 'mens',
          sortBy: 'price-low',
        })
        if (allProducts.length > 0) {
          const prices = allProducts.map(p => p.salePrice || p.basePrice)
          setPriceRange({
            min: Math.min(...prices),
            max: Math.max(...prices),
          })
        }
      } catch (error) {
        console.error('Failed to calculate price range:', error)
      }
    }
    calculatePriceRange()
  }, [])

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      try {
        const fetchedProducts = await getProducts({
          gender: 'mens',
          category: filters.category,
          maxPrice: filters.maxPrice,
          sortBy,
        })
        // Apply size filter on client side
        const filtered = filterProductsBySize(fetchedProducts, filters.size)
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Collection Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Mens Collection</h1>
        <p className="text-gray-600">
          Discover our latest mens fashion collection. From casual to formal, find your perfect style.
        </p>
      </div>

      {/* Filter Button */}
      <div className="mb-4">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </button>
      </div>

      {/* Main Content */}
      <div>

          {/* Sort and Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">
              {loading ? 'Loading...' : `${displayProducts.length} ${displayProducts.length === 1 ? 'product' : 'products'}`}
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption)
                  setCurrentPage(1)
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {displayProducts.length === 0 && loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : paginatedProducts.length > 0 ? (
            <>
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className={`grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 relative ${loading ? 'opacity-60' : 'opacity-100'} transition-opacity duration-200`}
              >
                {loading && (
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                    <div className="bg-white px-4 py-2 rounded-md shadow-md">
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm text-gray-700">Loading...</span>
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
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found. Try adjusting your filters.</p>
            </div>
          )}
      </div>

      {/* Filter Drawer */}
      {isFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full w-80 lg:w-96 bg-white z-50 shadow-xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close filters"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterSidebar filters={filters} onFiltersChange={setFilters} priceRange={priceRange} />
          </div>
        </>
      )}
    </div>
  )
}

