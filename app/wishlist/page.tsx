'use client'

import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { useWishlist } from '@/lib/wishlistContext'

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, isHydrated } = useWishlist()

  if (!isHydrated) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your wishlist is empty</p>
          <Link
            href="/mens"
            className="inline-block bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-6">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard product={product} />
                <div className="mt-2">
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="w-full py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
                  >
                    Remove from wishlist
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
