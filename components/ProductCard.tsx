'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/mockProducts'
import PlaceholderImage from './PlaceholderImage'
import { useCart } from '@/lib/cartContext'
import { useWishlist } from '@/lib/wishlistContext'
import { imageZoom, fadeIn } from '@/lib/animations'

interface ProductCardProps {
  product: Product
}

const SIZES = ['S', 'M', 'L', 'XL', '2XL']

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)

  const handleSizeSelect = (size: string) => {
    addToCart(product, size)
  }

  // Get stock for a specific size
  const getStockForSize = (size: string): number => {
    if (!product.stockBySize) return 0
    return product.stockBySize[size] || 0
  }

  // Check if all sizes are out of stock
  const isAllSizesOutOfStock = (): boolean => {
    if (!product.stockBySize) return false
    return SIZES.every(size => getStockForSize(size) === 0)
  }

  // Check if a specific size is out of stock
  const isSizeOutOfStock = (size: string): boolean => {
    return getStockForSize(size) === 0
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

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on size buttons or wishlist button
    const target = e.target as HTMLElement
    if (target.closest('button')) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <Link href={`/products/${product.id}`} className="block group">
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="relative"
      >
        <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden mb-4">
          {imageSrc && !imageError ? (
            <motion.div
              whileHover={imageZoom}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </motion.div>
          ) : (
            <PlaceholderImage seed={product.id} />
          )}
          
          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="absolute top-3 left-3 flex gap-2 z-10"
          >
            {product.tags.includes('New') && (
              <span className="bg-black text-white text-xs px-2.5 py-1 font-light tracking-wide">
                New
              </span>
            )}
            {product.tags.includes('Sale') && (
              <span className="bg-red-600 text-white text-xs px-2.5 py-1 font-light tracking-wide">
                Sale
              </span>
            )}
          </motion.div>

          {/* Wishlist Heart Button */}
          <motion.button
            onClick={handleWishlistToggle}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-3 right-3 p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-soft z-10 hover:bg-white"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <motion.svg
              animate={inWishlist ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
              className={`w-5 h-5 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
              fill={inWishlist ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </motion.svg>
          </motion.button>

          {/* Size Selection Buttons or Sold Out */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 left-0 right-0 p-4 bg-white/98 backdrop-blur-sm"
          >
            {isAllSizesOutOfStock() ? (
              <div className="flex justify-center">
                <div className="px-4 py-2 bg-neutral-200 text-neutral-600 text-sm font-light tracking-wide cursor-not-allowed">
                  Sold out
                </div>
              </div>
            ) : (
              <div className="flex gap-2 justify-center">
                {SIZES.map((size) => {
                  const outOfStock = isSizeOutOfStock(size)
                  return (
                    <motion.button
                      key={size}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (!outOfStock) handleSizeSelect(size)
                      }}
                      disabled={outOfStock}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1.5 border text-xs font-light tracking-wide transition-colors focus:outline-none ${
                        outOfStock
                          ? 'border-neutral-200 text-neutral-400 line-through cursor-not-allowed bg-neutral-50'
                          : 'border-neutral-300 hover:bg-black hover:text-white hover:border-black'
                      }`}
                    >
                      {size}
                    </motion.button>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>

        <div className="text-center">
          <h3 className="font-light text-gray-900 mb-1.5 text-sm tracking-wide">{product.name}</h3>
          <div className="flex items-center justify-center gap-2">
            <span className="text-base font-light tracking-wide">
              ${((product.salePrice || product.basePrice)).toFixed(2)}
            </span>
            {product.salePrice && (
              <span className="text-sm text-gray-500 line-through font-light">
                ${product.basePrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
