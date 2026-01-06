'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Product } from '@/lib/mockProducts'
import PlaceholderImage from './PlaceholderImage'
import { useCart } from '@/lib/cartContext'

interface ProductCardProps {
  product: Product
}

const SIZES = ['S', 'M', 'L', 'XL', '2XL']

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const { addToCart } = useCart()

  const handleSizeSelect = (size: string) => {
    addToCart(product, size)
  }

  // Try to find the correct image extension
  useEffect(() => {
    if (!product.image.startsWith('/images/products/')) return
    
    const extensions = ['.jpg', '.jpeg', '.png', '.webp']
    const basePath = product.image
    
    // Try each extension to find which one exists
    let currentIndex = 0
    const tryNext = () => {
      if (currentIndex >= extensions.length) {
        setImageError(true)
        return
      }
      
      const testImg = new window.Image()
      testImg.onload = () => {
        setImageSrc(`${basePath}${extensions[currentIndex]}`)
      }
      testImg.onerror = () => {
        currentIndex++
        tryNext()
      }
      testImg.src = `${basePath}${extensions[currentIndex]}`
    }
    
    tryNext()
  }, [product.image, product.id])

  return (
    <div className="group">
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden rounded-lg mb-3">
        {imageSrc && !imageError ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <PlaceholderImage seed={product.id} className="group-hover:scale-105 transition-transform duration-300" />
        )}
        
        {/* Tags */}
        <div className="absolute top-2 left-2 flex gap-2">
          {product.tags.includes('New') && (
            <span className="bg-black text-white text-xs px-2 py-1 rounded">New</span>
          )}
          {product.tags.includes('Sale') && (
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">Sale</span>
          )}
        </div>

        {/* Size Selection Buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-2 justify-center">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeSelect(size)}
                className="px-3 py-1.5 border border-gray-300 rounded hover:bg-black hover:text-white hover:border-black transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

