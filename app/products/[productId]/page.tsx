'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import PlaceholderImage from '@/components/PlaceholderImage'
import { useCart } from '@/lib/cartContext'
import { useWishlist } from '@/lib/wishlistContext'
import { Product } from '@/lib/mockProducts'
import { fadeInUp, pageTransition } from '@/lib/animations'

const SIZES = ['S', 'M', 'L', 'XL', '2XL']

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params?.productId as string
  const { addToCart } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  useEffect(() => {
    if (product?.image) {
      if (!product.image.startsWith('/images/products/')) {
        setImageSrc(product.image)
        return
      }
      
      const extensions = ['.jpg', '.jpeg', '.png', '.webp']
      const basePath = product.image
      
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
    }
  }, [product?.image, product?.id])

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  async function fetchProduct() {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${productId}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data.product)
      } else if (response.status === 404) {
        router.push('/')
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const getStockForSize = (size: string): number => {
    if (!product?.stockBySize) return 0
    return product.stockBySize[size] || 0
  }

  const isSizeOutOfStock = (size: string): boolean => {
    return getStockForSize(size) === 0
  }

  const handleAddToCart = () => {
    if (!selectedSize || !product) return
    if (isSizeOutOfStock(selectedSize)) return
    
    addToCart(product, selectedSize)
  }

  if (loading) {
    return (
      <div className="container-custom py-24">
        <div className="text-center">
          <p className="text-gray-600 font-light">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container-custom py-24">
        <div className="text-center">
          <p className="text-gray-600 mb-4 font-light">Product not found</p>
          <Link href="/" className="text-black hover:underline font-light">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const isAllSizesOutOfStock = SIZES.every(size => isSizeOutOfStock(size))

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="bg-white"
    >
      <div className="container-custom py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href={product.gender === 'mens' ? '/mens' : product.gender === 'womens' ? '/womens' : '/'}
            className="text-gray-600 hover:text-black mb-8 inline-block transition-colors font-light text-sm tracking-wide"
          >
            ← Back to {product.gender === 'mens' ? "Men's" : product.gender === 'womens' ? "Women's" : 'Products'}
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Product Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-square bg-neutral-100 overflow-hidden">
              {imageSrc && !imageError ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={imageSrc}
                    alt={product.name}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </motion.div>
              ) : (
                <PlaceholderImage seed={product.id} />
              )}
              
              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute top-6 left-6 flex gap-2 z-10"
              >
                {product.tags.includes('New') && (
                  <span className="bg-black text-white text-xs px-3 py-1.5 font-light tracking-wide">
                    New
                  </span>
                )}
                {product.tags.includes('Sale') && (
                  <span className="bg-red-600 text-white text-xs px-3 py-1.5 font-light tracking-wide">
                    Sale
                  </span>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Product Details - Sticky Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`${isSticky ? 'lg:sticky lg:top-24 lg:self-start' : ''}`}
          >
            <div className="space-y-8">
              {/* Title */}
              <div>
                <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4 text-black">
                  {product.name}
                </h1>
                
                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl md:text-4xl font-light tracking-tight">
                    ${((product.salePrice || product.basePrice)).toFixed(2)}
                  </span>
                  {product.salePrice && (
                    <span className="text-xl text-gray-500 line-through font-light">
                      ${product.basePrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="border-t border-neutral-200 pt-6"
                >
                  <p className="text-gray-700 leading-relaxed font-light text-base">
                    {product.description}
                  </p>
                </motion.div>
              )}

              {/* Size Selection */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
                className="border-t border-neutral-200 pt-6"
              >
                <h2 className="text-sm font-light tracking-wider uppercase mb-6 text-black">
                  Size
                </h2>
                <div className="grid grid-cols-5 gap-3">
                  {SIZES.map((size) => {
                    const outOfStock = isSizeOutOfStock(size)
                    const isSelected = selectedSize === size
                    return (
                      <motion.button
                        key={size}
                        onClick={() => !outOfStock && setSelectedSize(size)}
                        disabled={outOfStock}
                        whileHover={!outOfStock ? { scale: 1.05 } : {}}
                        whileTap={!outOfStock ? { scale: 0.95 } : {}}
                        className={`px-4 py-3 border-2 text-sm font-light tracking-wide transition-all focus:outline-none ${
                          outOfStock
                            ? 'border-neutral-200 text-neutral-400 line-through cursor-not-allowed bg-neutral-50'
                            : isSelected
                            ? 'bg-black border-black text-white'
                            : 'border-neutral-300 hover:border-black'
                        }`}
                      >
                        {size}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>

              {/* Add to Cart and Wishlist Buttons */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
                className="flex gap-4 pt-6 border-t border-neutral-200"
              >
                <motion.button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || isAllSizesOutOfStock || isSizeOutOfStock(selectedSize)}
                  whileHover={!(!selectedSize || isAllSizesOutOfStock || (selectedSize && isSizeOutOfStock(selectedSize))) ? { scale: 1.02 } : {}}
                  whileTap={!(!selectedSize || isAllSizesOutOfStock || (selectedSize && isSizeOutOfStock(selectedSize))) ? { scale: 0.98 } : {}}
                  className={`flex-1 py-4 px-6 text-base font-light tracking-wide transition-colors focus:outline-none ${
                    !selectedSize || isAllSizesOutOfStock || (selectedSize && isSizeOutOfStock(selectedSize))
                      ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-neutral-800'
                  }`}
                >
                  {isAllSizesOutOfStock
                    ? 'Sold Out'
                    : !selectedSize
                    ? 'Select a Size'
                    : 'Add to Cart'}
                </motion.button>
                {product && (
                  <motion.button
                    onClick={() => {
                      if (isInWishlist(product.id)) {
                        removeFromWishlist(product.id)
                      } else {
                        addToWishlist(product)
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-4 border-2 transition-colors focus:outline-none ${
                      isInWishlist(product.id)
                        ? 'border-red-500 bg-red-50 text-red-500 hover:bg-red-100'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                    aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <motion.svg
                      animate={isInWishlist(product.id) ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                      className={`w-6 h-6 ${isInWishlist(product.id) ? 'fill-current' : ''}`}
                      fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
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
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
