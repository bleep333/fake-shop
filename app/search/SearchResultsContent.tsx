'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import FilterSidebar from '@/components/FilterSidebar'
import { getProducts, filterProductsBySize, FilterOptions, SortOption } from '@/lib/products'
import { Product } from '@/lib/mockProducts'
import { staggerContainer, staggerFadeUp } from '@/lib/motion.config'

function buildSearchUrl(q: string, newFilters: FilterOptions): string {
  const params = new URLSearchParams()
  if (q.trim()) params.set('q', q.trim())
  if (newFilters.category?.length) {
    newFilters.category.forEach(cat => params.append('category', cat))
  }
  if (newFilters.tags?.length) {
    newFilters.tags.forEach(tag => params.append('tag', tag))
  }
  if (newFilters.color?.length) {
    newFilters.color.forEach(color => params.append('color', color))
  }
  if (newFilters.size?.length) {
    newFilters.size.forEach(size => params.append('size', size))
  }
  if (newFilters.maxPrice !== undefined) {
    params.set('maxPrice', newFilters.maxPrice.toString())
  }
  const queryString = params.toString()
  return queryString ? `/search?${queryString}` : '/search'
}

export default function SearchResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const q = searchParams.get('q') ?? ''
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
    const category = searchParams.getAll('category')
    const tags = searchParams.getAll('tag')
    const colors = searchParams.getAll('color')
    const sizes = searchParams.getAll('size')
    const maxPrice = searchParams.get('maxPrice')
    const newFilters: FilterOptions = {}
    if (category.length > 0) newFilters.category = category
    if (tags.length > 0) newFilters.tags = tags
    if (colors.length > 0) newFilters.color = colors
    if (sizes.length > 0) newFilters.size = sizes
    if (maxPrice) newFilters.maxPrice = parseFloat(maxPrice)
    setFilters(Object.keys(newFilters).length > 0 ? newFilters : {})
  }, [searchParams])

  useEffect(() => {
    async function calculatePriceRangeAndColors() {
      try {
        const allProducts = await getProducts({ sortBy: 'price-low' })
        if (allProducts.length > 0) {
          const prices = allProducts.map(p => p.salePrice || p.basePrice)
          setPriceRange({
            min: Math.min(...prices),
            max: Math.max(...prices),
          })
          const colors = Array.from(
            new Set(allProducts.map(p => p.color).filter((c): c is string => !!c))
          ).sort()
          setAvailableColors(colors)
          const categories = Array.from(new Set(allProducts.map(p => p.category))).sort()
          setAvailableCategories(categories)
        }
      } catch (e) {
        console.error(e)
      }
    }
    calculatePriceRangeAndColors()
  }, [])

  useEffect(() => {
    async function loadProducts() {
      if (!q.trim()) {
        setProducts([])
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const fetched = await getProducts({
          q: q.trim(),
          category: filters.category,
          tags: filters.tags,
          maxPrice: filters.maxPrice,
          sortBy,
        })
        let filtered = filterProductsBySize(fetched, filters.size)
        if (filters.color?.length) {
          filtered = filtered.filter(p => p.color && filters.color!.includes(p.color))
        }
        setProducts(filtered)
        setCurrentPage(1)
      } catch (e) {
        console.error(e)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [q, filters, sortBy])

  const [displayProducts, setDisplayProducts] = useState<Product[]>([])
  useEffect(() => {
    if (!loading) setDisplayProducts(products)
  }, [loading, products])

  const totalPages = Math.ceil(displayProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = displayProducts.slice(startIndex, startIndex + productsPerPage)

  if (!q.trim()) {
    return (
      <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-3">Search</h1>
        <p className="text-stone-600">Enter a word above and click search to see results.</p>
      </div>
    )
  }

  return (
    <div className="w-full py-8">
      <div className="mb-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-3">
          Results for &quot;{q}&quot;
        </h1>
        <p className="text-stone-600 text-base">
          {loading ? 'Loading...' : `${displayProducts.length} product${displayProducts.length === 1 ? '' : 's'}`}
        </p>
      </div>

      <div className="flex gap-12 px-4 sm:px-6 lg:px-8">
        <aside className="hidden lg:block flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onFiltersChange={newFilters => {
              setFilters(newFilters)
              router.push(buildSearchUrl(q, newFilters), { scroll: false })
            }}
            priceRange={priceRange}
            availableColors={availableColors}
            availableCategories={availableCategories}
            currentGender={undefined}
          />
        </aside>

        <div className="flex-1">
          <div className="lg:hidden mb-4">
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-md hover:bg-stone-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>

          <div className="flex items-center justify-between mb-8">
            <p className="text-base font-semibold text-stone-900">
              {loading ? 'Loading...' : `${displayProducts.length} Product${displayProducts.length === 1 ? '' : 's'}`}
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-search" className="text-base font-semibold text-stone-900">Sort</label>
              <select
                id="sort-search"
                value={sortBy}
                onChange={e => {
                  setSortBy(e.target.value as SortOption)
                  setCurrentPage(1)
                }}
                className="px-4 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-base bg-white font-medium"
              >
                <option value="newest">Best Match</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price (lowest first)</option>
                <option value="price-high">Price (highest first)</option>
              </select>
            </div>
          </div>

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
                viewport={{ once: true, margin: '-50px' }}
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 relative ${loading ? 'opacity-60' : 'opacity-100'} transition-opacity duration-200`}
              >
                {loading && (
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                    <div className="bg-white px-4 py-2 rounded-md shadow-md flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="text-sm text-stone-700">Loading...</span>
                    </div>
                  </div>
                )}
                {paginatedProducts.map(product => (
                  <motion.div key={product.id} variants={staggerFadeUp}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
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
                    type="button"
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
              <p className="text-stone-600">No products found for &quot;{q}&quot;. Try different words or filters.</p>
            </div>
          )}

          {isFilterOpen && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setIsFilterOpen(false)}
                aria-hidden
              />
              <div className="fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-xl p-6 overflow-y-auto lg:hidden">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    type="button"
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
                  onFiltersChange={newFilters => {
                    setFilters(newFilters)
                    router.push(buildSearchUrl(q, newFilters), { scroll: false })
                  }}
                  priceRange={priceRange}
                  availableColors={availableColors}
                  availableCategories={availableCategories}
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
