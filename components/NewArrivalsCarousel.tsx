'use client'

import { useState } from 'react'
import ProductCard from './ProductCard'
import SkeletonShimmer from './SkeletonShimmer'
import { Product } from '@/lib/mockProducts'

interface NewArrivalsCarouselProps {
  products: Product[]
  loading: boolean
}

export default function NewArrivalsCarousel({ products, loading }: NewArrivalsCarouselProps) {
  const [isPaused, setIsPaused] = useState(false)

  if (loading) {
    return (
      <div className="flex gap-6 overflow-hidden py-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-[3/4] w-[280px] shrink-0 bg-stone-100 rounded-lg overflow-hidden">
            <SkeletonShimmer className="w-full h-full" />
          </div>
        ))}
      </div>
    )
  }

  const duplicated = [...products, ...products]

  return (
    <div
      className="overflow-hidden py-4 -mx-4 md:-mx-6 lg:-mx-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex gap-6 w-max animate-scroll-left"
        style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
      >
        {duplicated.map((product) => (
          <div key={`${product.id}-${product.name}`} className="w-[280px] md:w-[320px] shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}
