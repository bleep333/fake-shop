'use client'

import { FilterOptions } from '@/lib/mockProducts'
import { useState } from 'react'

interface FilterSidebarProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
}

export default function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters)

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

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    const numValue = value === '' ? undefined : Number(value)
    const updated = { ...localFilters, [field]: numValue }
    setLocalFilters(updated)
    onFiltersChange(updated)
  }

  const clearFilters = () => {
    const cleared = {}
    setLocalFilters(cleared)
    onFiltersChange(cleared)
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
      <div>
        <h3 className="font-medium mb-3">Price</h3>
        <div className="space-y-2">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Min</label>
            <input
              type="number"
              placeholder="0"
              value={localFilters.minPrice || ''}
              onChange={(e) => handlePriceChange('minPrice', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Max</label>
            <input
              type="number"
              placeholder="500"
              value={localFilters.maxPrice || ''}
              onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

