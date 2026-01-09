'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import PlaceholderImage from '@/components/PlaceholderImage'
import { useCart } from '@/lib/cartContext'
import { useWishlist } from '@/lib/wishlistContext'
import { Product } from '@/lib/mockProducts'

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
    // Optionally show a toast or notification
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Product not found</p>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const isAllSizesOutOfStock = SIZES.every(size => isSizeOutOfStock(size))

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href={product.gender === 'mens' ? '/mens' : product.gender === 'womens' ? '/womens' : '/'}
        className="text-gray-600 hover:text-black mb-6 inline-block transition-colors"
      >
        ← Back to {product.gender === 'mens' ? "Men's" : product.gender === 'womens' ? "Women's" : 'Products'}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {imageSrc && !imageError ? (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <PlaceholderImage seed={product.id} />
          )}
          
          {/* Tags */}
          <div className="absolute top-4 left-4 flex gap-2">
            {product.tags.includes('New') && (
              <span className="bg-black text-white text-xs px-3 py-1.5 rounded">New</span>
            )}
            {product.tags.includes('Sale') && (
              <span className="bg-red-600 text-white text-xs px-3 py-1.5 rounded">Sale</span>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          
          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-semibold">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xl text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Size Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Size</h2>
            <div className="grid grid-cols-5 gap-3">
              {SIZES.map((size) => {
                const outOfStock = isSizeOutOfStock(size)
                const isSelected = selectedSize === size
                return (
                  <button
                    key={size}
                    onClick={() => !outOfStock && setSelectedSize(size)}
                    disabled={outOfStock}
                    className={`px-4 py-3 border-2 rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                      outOfStock
                        ? 'border-gray-200 text-gray-400 line-through cursor-not-allowed bg-gray-50'
                        : isSelected
                        ? 'bg-black border-black text-white'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Add to Cart and Wishlist Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || isAllSizesOutOfStock || isSizeOutOfStock(selectedSize)}
              className={`flex-1 py-4 px-6 rounded-md text-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                !selectedSize || isAllSizesOutOfStock || (selectedSize && isSizeOutOfStock(selectedSize))
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {isAllSizesOutOfStock
                ? 'Sold Out'
                : !selectedSize
                ? 'Select a Size'
                : 'Add to Cart'}
            </button>
            {product && (
              <button
                onClick={() => {
                  if (isInWishlist(product.id)) {
                    removeFromWishlist(product.id)
                  } else {
                    addToWishlist(product)
                  }
                }}
                className={`px-4 py-4 rounded-md border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                  isInWishlist(product.id)
                    ? 'border-red-500 bg-red-50 text-red-500 hover:bg-red-100'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
                aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <svg
                  className={`w-6 h-6 ${isInWishlist(product.id) ? 'fill-current' : ''}`}
                  fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
