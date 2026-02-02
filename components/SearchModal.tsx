'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/mockProducts'
import { getProducts } from '@/lib/products'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Search products
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    const timeoutId = setTimeout(async () => {
      try {
        const allProducts = await getProducts()
        const filtered = allProducts.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setResults(filtered.slice(0, 8)) // Limit to 8 results
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300) // Debounce

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleResultClick = () => {
    setSearchQuery('')
    onClose()
  }

  // Submit search: go to full-page results (like General Pants Co.)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (trimmed) {
      onClose()
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[101] flex items-start justify-center pt-20 md:pt-32 px-4"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
          >
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden">
              {/* Search Input - submit goes to full-page results */}
              <form onSubmit={handleSubmit} className="p-6 border-b border-stone-200">
                <div className="flex items-center gap-4">
                  <svg className="w-6 h-6 text-stone-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 text-lg outline-none placeholder:text-stone-400 focus:ring-2 focus:ring-stone-900 rounded px-2"
                    aria-label="Search for products"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 hover:bg-stone-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-stone-900"
                    aria-label="Close search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="mt-2 text-xs text-stone-500">Press Enter or click Search to see all results</p>
              </form>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {isLoading ? (
                  <div className="p-12 text-center text-stone-500">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
                  </div>
                ) : searchQuery.trim() && results.length === 0 ? (
                  <div className="p-12 text-center text-stone-500">
                    <p>No products found</p>
                  </div>
                ) : results.length > 0 ? (
                  <div>
                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                      onClick={() => { onClose() }}
                      className="block p-4 bg-stone-50 border-b border-stone-200 font-medium text-stone-900 hover:bg-stone-100 transition-colors text-center"
                    >
                      View all results for &quot;{searchQuery.trim()}&quot; →
                    </Link>
                    <div className="divide-y divide-stone-200">
                      {results.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          onClick={handleResultClick}
                          className="block p-4 hover:bg-stone-50 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-inset"
                          aria-label={`View ${product.name} - $${(product.salePrice || product.basePrice).toFixed(2)}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 bg-stone-100 rounded overflow-hidden flex-shrink-0">
                              {product.image && (
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-stone-900 truncate">{product.name}</h3>
                              <p className="text-sm text-stone-500 mt-1">
                                {product.category} • ${(product.salePrice || product.basePrice).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center text-stone-500">
                    <p>Start typing to search...</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
