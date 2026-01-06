'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import FilterSidebar from '@/components/FilterSidebar'
import { mockProducts, filterProducts, sortProducts, FilterOptions, SortOption } from '@/lib/mockProducts'

export default function WomensContent() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<FilterOptions>({})
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const productsPerPage = 12

  useEffect(() => {
    // Check for category in URL params
    const category = searchParams.get('category')
    if (category) {
      setFilters({ category: [category] })
    }
  }, [searchParams])

  const filteredProducts = sortProducts(
    filterProducts(mockProducts, filters, 'womens'),
    sortBy
  )

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Collection Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Womens Collection</h1>
        <p className="text-gray-600">
          Explore our curated womens fashion collection. Style that speaks to you.
        </p>
      </div>

      <div className="flex gap-8">
        {/* Filter Sidebar - Desktop */}
        <aside className="hidden lg:block flex-shrink-0">
          <FilterSidebar filters={filters} onFiltersChange={setFilters} />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
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

          {/* Sort and Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
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
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>

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
      </div>

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
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close filters"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterSidebar filters={filters} onFiltersChange={setFilters} />
          </div>
        </>
      )}
    </div>
  )
}

