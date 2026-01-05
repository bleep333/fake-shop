'use client'

import { useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { mockProducts, Product } from '@/lib/mockProducts'

export default function WishlistPage() {
  // Mock wishlist items
  const [wishlistItems, setWishlistItems] = useState<Product[]>([
    mockProducts[2],
    mockProducts[4],
    mockProducts[7],
    mockProducts[11],
  ])

  const handleMoveToCart = (product: Product) => {
    console.log('Moved to cart:', product.name)
    // In real app, this would add to cart and remove from wishlist
    setWishlistItems(wishlistItems.filter(item => item.id !== product.id))
  }

  const handleRemove = (productId: string) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== productId))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your wishlist is empty</p>
          <a
            href="/mens"
            className="inline-block bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </a>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-6">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="flex-1 bg-black text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-black"
                    aria-label="Remove from wishlist"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
