'use client'

import { FilterOptions } from '@/lib/mockProducts'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface FilterSidebarProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  priceRange?: { min: number; max: number }
  availableColors?: string[]
  availableCategories?: string[]
  currentGender?: 'mens' | 'womens' | 'unisex'
}

export default function FilterSidebar({ filters, onFiltersChange, priceRange, availableColors = [], availableCategories = [], currentGender }: FilterSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
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

  const handleGenderChange = (gender: string) => {
    return () => {
      // Navigate to the appropriate page based on gender selection
      // Preserve current filters in URL if needed
      const currentSearchParams = new URLSearchParams()
      
      // Preserve category filter if exists
      if (filters.category && filters.category.length > 0) {
        filters.category.forEach(cat => currentSearchParams.append('category', cat))
      }
      
      // Preserve tags if exists
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach(tag => currentSearchParams.append('tag', tag))
      }
      
      // Preserve color filter if exists
      if (filters.color && filters.color.length > 0) {
        filters.color.forEach(color => currentSearchParams.append('color', color))
      }
      
      // Preserve size filter if exists
      if (filters.size && filters.size.length > 0) {
        filters.size.forEach(size => currentSearchParams.append('size', size))
      }
      
      // Preserve price filter if exists
      if (filters.maxPrice !== undefined) {
        currentSearchParams.append('maxPrice', filters.maxPrice.toString())
      }
      
      const queryString = currentSearchParams.toString()
      const url = queryString ? `/${gender}?${queryString}` : `/${gender}`
      
      router.push(url)
    }
  }
  
  const handleAllGenderClick = () => {
    // Navigate to /all page
    const currentSearchParams = new URLSearchParams()
    
    // Preserve category filter if exists
    if (filters.category && filters.category.length > 0) {
      filters.category.forEach(cat => currentSearchParams.append('category', cat))
    }
    
    // Preserve tags if exists
    if (filters.tags && filters.tags.length > 0) {
      filters.tags.forEach(tag => currentSearchParams.append('tag', tag))
    }
    
    // Preserve color filter if exists
    if (filters.color && filters.color.length > 0) {
      filters.color.forEach(color => currentSearchParams.append('color', color))
    }
    
    // Preserve size filter if exists
    if (filters.size && filters.size.length > 0) {
      filters.size.forEach(size => currentSearchParams.append('size', size))
    }
    
    // Preserve price filter if exists
    if (filters.maxPrice !== undefined) {
      currentSearchParams.append('maxPrice', filters.maxPrice.toString())
    }
    
    const queryString = currentSearchParams.toString()
    const url = queryString ? `/all?${queryString}` : '/all'
    
    router.push(url)
  }

  const handleCollectionChange = (tag: string) => {
    const currentTags = localFilters.tags || []
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag]
    
    const updated = { ...localFilters, tags: newTags }
    setLocalFilters(updated)
    onFiltersChange(updated)
  }

  const handleColorChange = (color: string) => {
    const currentColors = localFilters.color || []
    const newColors = currentColors.includes(color)
      ? currentColors.filter(c => c !== color)
      : [...currentColors, color]
    
    const updated = { ...localFilters, color: newColors }
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
    // Navigate to current page without query params to clear URL filters
    const basePath = pathname.split('?')[0]
    router.push(basePath)
  }

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    gender: true,
    collection: true,
    category: true,
    color: false,
    price: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="w-64 space-y-0">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter
        </h2>
        <button
          onClick={clearFilters}
          className="text-sm text-stone-600 hover:text-black transition-colors font-medium"
        >
          Clear filters
        </button>
      </div>

      {/* Gender */}
      <div className="border-b border-stone-200 py-4">
        <button
          onClick={() => toggleSection('gender')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-base text-stone-900">Gender ({pathname === '/all' ? 0 : currentGender ? 1 : 0})</h3>
          <span className="text-stone-400 text-base">{expandedSections.gender ? '−' : '+'}</span>
        </button>
        {expandedSections.gender && (
          <div className="space-y-2.5">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="gender-filter"
                checked={pathname === '/all' || (!currentGender && pathname !== '/mens' && pathname !== '/womens')}
                onChange={handleAllGenderClick}
                className="w-4 h-4 text-black border-stone-300 rounded focus:ring-black"
              />
              <span className="ml-2 text-base text-stone-900 font-medium">All</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="gender-filter"
                checked={currentGender === 'mens' || pathname === '/mens'}
                onChange={handleGenderChange('mens')}
                className="w-4 h-4 text-black border-stone-300 rounded focus:ring-black"
              />
              <span className="ml-2 text-base text-stone-900 font-medium">Men</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="gender-filter"
                checked={currentGender === 'womens' || pathname === '/womens'}
                onChange={handleGenderChange('womens')}
                className="w-4 h-4 text-black border-stone-300 rounded focus:ring-black"
              />
              <span className="ml-2 text-base text-stone-900 font-medium">Women</span>
            </label>
          </div>
        )}
      </div>

      {/* Collection */}
      <div className="border-b border-stone-200 py-4">
        <button
          onClick={() => toggleSection('collection')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-base text-stone-900">Collection ({localFilters.tags?.length || 0})</h3>
          <span className="text-stone-400 text-base">{expandedSections.collection ? '−' : '+'}</span>
        </button>
        {expandedSections.collection && (
          <div className="space-y-2.5">
            {['New', 'Popular', 'Sale'].map((tag) => (
              <label key={tag} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.tags?.includes(tag) || false}
                  onChange={() => handleCollectionChange(tag)}
                  className="w-4 h-4 text-black border-stone-300 rounded focus:ring-black"
                />
                <span className="ml-2 text-base text-stone-900 font-medium">{tag}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="border-b border-stone-200 py-4">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-base text-stone-900">Category ({localFilters.category?.length || 0})</h3>
          <span className="text-stone-400 text-base">{expandedSections.category ? '−' : '+'}</span>
        </button>
        {expandedSections.category && (
          <div className="space-y-2.5">
            {(() => {
              // Define category lists based on gender - always show all predefined categories
              const mensCategories = [
                't-shirts',
                'shirts',
                'hoodies',
                'jackets',
                'knitwear',
                'pants',
                'jeans',
                'shorts',
                'accessories'
              ]
              
              const womensCategories = [
                'dresses',
                'tops',
                't-shirts',
                'skirts',
                'pants',
                'jeans',
                'jackets',
                'knitwear',
                'shorts',
                'jumpsuits',
                'lingerie',
                'accessories'
              ]
              
              // Determine which categories to show based on current gender
              let categoriesToShow: string[] = []
              
              if (currentGender === 'mens' || pathname === '/mens') {
                // Show all mens categories
                categoriesToShow = mensCategories
              } else if (currentGender === 'womens' || pathname === '/womens') {
                // Show all womens categories
                categoriesToShow = womensCategories
              } else {
                // For "All" - combine both lists without duplicates, maintaining order
                // Start with mens categories, then add womens categories that aren't already included
                const allCategories = [...mensCategories]
                womensCategories.forEach(cat => {
                  if (!allCategories.includes(cat)) {
                    allCategories.push(cat)
                  }
                })
                categoriesToShow = allCategories
              }
              
              // Format category name for display
              const formatCategoryName = (category: string): string => {
                const categoryLabels: Record<string, string> = {
                  't-shirts': 'T-Shirts',
                  'shirts': 'Shirts',
                  'hoodies': 'Hoodies',
                  'jackets': 'Jackets',
                  'knitwear': 'Knitwear',
                  'pants': 'Pants',
                  'jeans': 'Jeans',
                  'shorts': 'Shorts',
                  'accessories': 'Accessories',
                  'dresses': 'Dresses',
                  'tops': 'Tops',
                  'skirts': 'Skirts',
                  'jumpsuits': 'Jumpsuits',
                  'lingerie': 'Lingerie'
                }
                return categoryLabels[category] || category
                  .split('-')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')
              }
              
              return categoriesToShow.map((category) => (
                <label key={category} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.category?.includes(category) || false}
                    onChange={() => handleCategoryChange(category)}
                    className="w-4 h-4 text-black border-stone-300 rounded focus:ring-black"
                  />
                  <span className="ml-2 text-base text-stone-900 font-medium">{formatCategoryName(category)}</span>
                </label>
              ))
            })()}
          </div>
        )}
      </div>

      {/* Color */}
      <div className="border-b border-stone-200 py-4">
        <button
          onClick={() => toggleSection('color')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-base text-stone-900">Color ({localFilters.color?.length || 0})</h3>
          <span className="text-stone-400 text-base">{expandedSections.color ? '−' : '+'}</span>
        </button>
        {expandedSections.color && (
          <div className="space-y-2.5">
            {availableColors.length > 0 ? (
              availableColors.map((color) => (
                <label key={color} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.color?.includes(color) || false}
                    onChange={() => handleColorChange(color)}
                    className="w-4 h-4 text-black border-stone-300 rounded focus:ring-black"
                  />
                  <span className="ml-2 text-base text-stone-900 font-medium capitalize">{color}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-stone-500">No colors available</p>
            )}
          </div>
        )}
      </div>

      {/* Price Range */}
      {priceRange && (
        <div className="border-b border-stone-200 py-4">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full mb-3"
          >
            <h3 className="font-semibold text-base text-stone-900">Price ({sliderValue < priceRange.max ? 1 : 0})</h3>
            <span className="text-stone-400 text-base">{expandedSections.price ? '−' : '+'}</span>
          </button>
          {expandedSections.price && (
            <div className="space-y-3">
              <div>
                <label className="block text-base text-stone-900 font-medium mb-2">
                  Max: ${sliderValue.toFixed(2)}
                </label>
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  step="1"
                  value={sliderValue}
                  onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-black"
                  style={{
                    background: `linear-gradient(to right, #000 0%, #000 ${((sliderValue - priceRange.min) / (priceRange.max - priceRange.min) * 100)}%, #e5e7eb ${((sliderValue - priceRange.min) / (priceRange.max - priceRange.min) * 100)}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-sm text-stone-600 mt-1 font-medium">
                  <span>${priceRange.min.toFixed(2)}</span>
                  <span>${priceRange.max.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

