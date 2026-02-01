'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/mockProducts'
import PlaceholderImage from './PlaceholderImage'
import { useCart } from '@/lib/cartContext'
import { useWishlist } from '@/lib/wishlistContext'
import { hoverEffects, fadeIn, transitions } from '@/lib/motion.config'

interface ProductCardProps {
  product: Product
}

const SIZES = ['S', 'M', 'L', 'XL', '2XL']

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [alternateImageSrc, setAlternateImageSrc] = useState<string | null>(null)
  const [alternateImageError, setAlternateImageError] = useState(false)
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

  // Helper function to get alternate image path
  const getAlternateImagePath = (basePath: string, extension: string): string => {
    // Extract the filename without extension
    const pathParts = basePath.split('/')
    const filename = pathParts[pathParts.length - 1]
    const filenameWithoutExt = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '')
    
    // Construct alternate image path
    return `/images/products/alternate images/${filenameWithoutExt} (2)${extension}`
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
        const foundExtension = extensions[currentIndex]
        setImageSrc(`${basePath}${foundExtension}`)
        
        // Try to load alternate image - try all extensions since alternate might have different extension
        let alternateIndex = 0
        const tryAlternateNext = () => {
          if (alternateIndex >= extensions.length) {
            setAlternateImageError(true)
            return
          }
          
          const alternatePath = getAlternateImagePath(basePath, extensions[alternateIndex])
          const alternateImg = new window.Image()
          alternateImg.onload = () => {
            setAlternateImageSrc(alternatePath)
          }
          alternateImg.onerror = () => {
            alternateIndex++
            tryAlternateNext()
          }
          alternateImg.src = alternatePath
        }
        
        tryAlternateNext()
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
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-stone-100 rounded-lg p-4 border border-stone-200 overflow-hidden"
      >
        <div className="relative aspect-[3/4] bg-white rounded-lg overflow-hidden mb-3">
          {imageSrc && !imageError ? (
            <>
              {/* Main Image */}
              <motion.div
                whileHover={hoverEffects.imageZoom}
                transition={transitions.hover}
                className="absolute inset-0"
                style={{ willChange: 'transform' }}
                animate={{ opacity: isHovered && alternateImageSrc && !alternateImageError ? 0 : 1 }}
              >
                <Image
                  src={imageSrc}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  priority={false}
                />
              </motion.div>
              
              {/* Alternate Image on Hover */}
              {alternateImageSrc && !alternateImageError && (
                <motion.div
                  whileHover={hoverEffects.imageZoom}
                  transition={transitions.hover}
                  className="absolute inset-0"
                  style={{ willChange: 'transform' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                >
                  <Image
                    src={alternateImageSrc}
                    alt={`${product.name} - alternate view`}
                    fill
                    className="object-cover"
                    onError={() => setAlternateImageError(true)}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    priority={false}
                  />
                </motion.div>
              )}
            </>
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
              <span className="bg-purple-600 text-white text-xs px-2.5 py-1 font-medium">
                New
              </span>
            )}
            {product.tags.includes('Popular') && (
              <span className="bg-black text-white text-xs px-2.5 py-1 font-medium">
                Popular
              </span>
            )}
            {product.tags.includes('Sale') && product.salePrice && product.basePrice && (
              <span className="bg-red-600 text-white text-xs px-2.5 py-1 font-medium">
                -{Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)}%
              </span>
            )}
          </motion.div>

          {/* Wishlist Heart Button - Always Visible */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 p-1.5 z-10 hover:opacity-70 transition-opacity"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
              className={`w-5 h-5 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'text-stone-400 stroke-stone-400'}`}
              fill={inWishlist ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Size Selection - Overlay on Hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-2 z-20"
              >
                <div className="flex flex-nowrap gap-1.5 justify-center">
                  {SIZES.map((size) => {
                    const outOfStock = isSizeOutOfStock(size)
                    const stock = getStockForSize(size)
                    return (
                      <button
                        key={size}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          if (!outOfStock) handleSizeSelect(size)
                        }}
                        disabled={outOfStock}
                        className={`px-2 py-1 text-xs font-medium transition-all focus:outline-none flex-shrink-0 ${
                          outOfStock
                            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            : stock > 0
                            ? 'bg-white border border-stone-300 text-stone-900 hover:border-stone-400'
                            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product Name and Price */}
        <div className="text-left">
          <h3 className="font-semibold text-stone-900 mb-1 text-base">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-stone-900">
              ${((product.salePrice || product.basePrice)).toFixed(2)}
            </span>
            {product.salePrice && (
              <span className="text-sm text-stone-500 line-through">
                ${product.basePrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
