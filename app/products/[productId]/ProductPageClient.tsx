'use client'

// Client Component for Product Detail Page
// Handles all Framer Motion animations and interactive features
// Receives product data as props from Server Component

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import PlaceholderImage from '@/components/PlaceholderImage'
import ProductCard from '@/components/ProductCard'
import ScrollReveal from '@/components/ScrollReveal'
import { useCart } from '@/lib/cartContext'
import { useWishlist } from '@/lib/wishlistContext'
import { Product } from '@/lib/mockProducts'
import { getProducts } from '@/lib/products'
import { transitions, hoverEffects, staggerContainer, staggerFadeUp } from '@/lib/motion.config'

const SIZES = ['S', 'M', 'L', 'XL', '2XL']

interface ProductPageClientProps {
  product: Product
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const { addToCart } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [isSticky, setIsSticky] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loadingRelated, setLoadingRelated] = useState(true)

  // Handle image extension detection (client-side only)
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

  // Fetch related products (same category and gender, excluding current product)
  useEffect(() => {
    async function loadRelatedProducts() {
      if (!product) return
      
      try {
        setLoadingRelated(true)
        const allProducts = await getProducts({
          gender: product.gender,
          category: [product.category],
          sortBy: 'newest',
        })
        
        // Filter out current product and limit to 4
        const filtered = allProducts
          .filter(p => p.id !== product.id)
          .slice(0, 4)
        
        setRelatedProducts(filtered)
      } catch (error) {
        console.error('Failed to load related products:', error)
        setRelatedProducts([])
      } finally {
        setLoadingRelated(false)
      }
    }
    
    loadRelatedProducts()
  }, [product])

  // Handle sticky positioning for product details panel
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  const isAllSizesOutOfStock = SIZES.every(size => isSizeOutOfStock(size))

  // Note: PageTransition component in layout.tsx already handles page animations
  // No need for duplicate motion.div wrapper here
  return (
    <div className="bg-white">
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
            <motion.div 
              className="relative aspect-square bg-neutral-100 overflow-hidden"
              whileHover={hoverEffects.imageZoom}
              transition={transitions.hover}
              style={{ willChange: 'transform' }}
            >
              {imageSrc && !imageError ? (
                <Image
                  src={imageSrc}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
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
            </motion.div>
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
                <ScrollReveal className="border-t border-neutral-200 pt-6">
                  <p className="text-gray-700 leading-relaxed font-light text-base">
                    {product.description}
                  </p>
                </ScrollReveal>
              )}

              {/* Size Selection */}
              <ScrollReveal delay={0.1} className="border-t border-neutral-200 pt-6">
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
                        transition={transitions.quick}
                        className={`px-4 py-3 border-2 text-sm font-light tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                          outOfStock
                            ? 'border-neutral-200 text-neutral-400 line-through cursor-not-allowed bg-neutral-50'
                            : isSelected
                            ? 'bg-black border-black text-white'
                            : 'border-neutral-300 hover:border-black'
                        }`}
                        style={{ willChange: 'transform' }}
                      >
                        {size}
                      </motion.button>
                    )
                  })}
                </div>
              </ScrollReveal>

              {/* Add to Cart and Wishlist Buttons */}
              <ScrollReveal delay={0.2} className="flex gap-4 pt-6 border-t border-neutral-200">
                <motion.button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || isAllSizesOutOfStock || (selectedSize && isSizeOutOfStock(selectedSize))}
                  whileHover={(!selectedSize || isAllSizesOutOfStock || (selectedSize && isSizeOutOfStock(selectedSize))) ? {} : hoverEffects.buttonFill}
                  whileTap={(!selectedSize || isAllSizesOutOfStock || (selectedSize && isSizeOutOfStock(selectedSize))) ? {} : { scale: 0.98 }}
                  transition={transitions.quick}
                  className={`flex-1 py-4 px-6 text-base font-light tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                    !selectedSize || isAllSizesOutOfStock || (selectedSize && isSizeOutOfStock(selectedSize))
                      ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-neutral-800'
                  }`}
                  style={{ willChange: 'transform' }}
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
                    transition={transitions.quick}
                    className={`px-6 py-4 border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                      isInWishlist(product.id)
                        ? 'border-red-500 bg-red-50 text-red-500 hover:bg-red-100'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                    aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    style={{ willChange: 'transform' }}
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
              </ScrollReveal>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="section-spacing bg-white border-t border-neutral-200">
          <div className="container-custom">
            <ScrollReveal>
              <h2 
                className="text-4xl md:text-5xl font-light tracking-tight mb-12 text-black"
                style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}
              >
                You May Also Like
              </h2>
            </ScrollReveal>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
            >
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  variants={staggerFadeUp}
                  custom={index}
                >
                  <ProductCard product={relatedProduct} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}
