'use client'

import { FilterOptions } from '@/lib/mockProducts'
import { useState, useEffect, useRef } from 'react'

interface FilterSidebarProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  priceRange?: { min: number; max: number }
}

export default function FilterSidebar({ filters, onFiltersChange, priceRange }: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters)
  const [sliderValue, setSliderValue] = useState<number>(
    filters.maxPrice !== undefined ? filters.maxPrice : (priceRange?.max ?? 0)
  )
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Sync local filters when props change
  useEffect(() => {
    setLocalFilters(filters)
    if (filters.maxPrice !== undefined) {
      setSliderValue(filters.maxPrice)
    } else if (priceRange) {
      setSliderValue(priceRange.max)
    }
  }, [filters, priceRange])

  const handleCategoryChange = (category: string) => {
    const currentCategories = localFilters.category || []
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category]
    
    const updated = { ...localFilters, category: newCategories }
    setLocalFilters(updated)
    onFiltersChange(updated)
  }

  const handleSizeChange = (size: string) => {
    const currentSizes = localFilters.size || []
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size]
    
    const updated = { ...localFilters, size: newSizes }
    setLocalFilters(updated)
    onFiltersChange(updated)
  }

  const handleMaxPriceChange = (value: number) => {
    // Update slider value immediately for visual feedback
    setSliderValue(value)
    
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    
    // Debounce the actual filter update
    debounceTimeoutRef.current = setTimeout(() => {
      const updated = { ...localFilters }
      // Remove minPrice from filters since we're only using maxPrice now
      delete updated.minPrice
      
      // If slider is at max value, clear the filter (no maxPrice filter)
      if (priceRange && value >= priceRange.max) {
        delete updated.maxPrice
      } else {
        updated.maxPrice = value
      }
      
      setLocalFilters(updated)
      onFiltersChange(updated)
    }, 300) // 300ms delay after user stops sliding
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  const clearFilters = () => {
    // Clear any pending debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
      debounceTimeoutRef.current = null
    }
    const cleared: FilterOptions = {}
    setLocalFilters(cleared)
    onFiltersChange(cleared)
    // Reset slider to max value (no filter)
    if (priceRange) {
      setSliderValue(priceRange.max)
    }
  }

  return (
    <div className="w-64 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-gray-600 hover:text-black transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Category */}
      <div>
        <h3 className="font-medium mb-3">Category</h3>
        <div className="space-y-2">
          {['shirts', 'pants', 'outerwear'].map((cat) => (
            <label key={cat} className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.category?.includes(cat) || false}
                onChange={() => handleCategoryChange(cat)}
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <span className="ml-2 text-sm capitalize">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <h3 className="font-medium mb-3">Size</h3>
        <div className="grid grid-cols-4 gap-2">
          {['S', 'M', 'L', 'XL'].map((size) => (
            <label key={size} className="flex items-center justify-center border border-gray-300 rounded-md py-2 cursor-pointer hover:border-black transition-colors">
              <input
                type="checkbox"
                checked={localFilters.size?.includes(size) || false}
                onChange={() => handleSizeChange(size)}
                className="sr-only"
              />
              <span className={`text-sm ${localFilters.size?.includes(size) ? 'font-semibold' : ''}`}>
                {size}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      {priceRange && (
        <div>
          <h3 className="font-medium mb-3">Price</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Max: ${sliderValue.toFixed(2)}
              </label>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step="1"
                value={sliderValue}
                onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                style={{
                  background: `linear-gradient(to right, #000 0%, #000 ${((sliderValue - priceRange.min) / (priceRange.max - priceRange.min) * 100)}%, #e5e7eb ${((sliderValue - priceRange.min) / (priceRange.max - priceRange.min) * 100)}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>${priceRange.min.toFixed(2)}</span>
                <span>${priceRange.max.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

