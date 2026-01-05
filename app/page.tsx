'use client'

import Link from 'next/link'
import { useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { mockProducts, Product } from '@/lib/mockProducts'

export default function Home() {
  const [showToast, setShowToast] = useState(false)
  const [email, setEmail] = useState('')

  const featuredProducts = mockProducts.slice(0, 8)

  const handleQuickAdd = (product: Product) => {
    // Mock: Add to cart
    console.log('Added to cart:', product.name)
    // In real app, this would update cart state
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setShowToast(true)
    setEmail('')
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="relative h-[600px] rounded-lg overflow-hidden mb-16 mt-8">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            New Season Collection
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Discover the latest trends in fashion
          </p>
          <div className="flex gap-4">
            <Link
              href="/mens"
              className="bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600"
            >
              Shop Mens
            </Link>
            <Link
              href="/womens"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600"
            >
              Shop Womens
            </Link>
          </div>
        </div>
      </section>

      {/* Category Tiles */}
      <section className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/mens"
            className="group relative aspect-square rounded-lg overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">Mens</span>
            </div>
          </Link>
          <Link
            href="/womens"
            className="group relative aspect-square rounded-lg overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-pink-600 group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">Womens</span>
            </div>
          </Link>
          <Link
            href="/mens?category=shirts"
            className="group relative aspect-square rounded-lg overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">Shirts</span>
            </div>
          </Link>
          <Link
            href="/mens?category=pants"
            className="group relative aspect-square rounded-lg overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">Pants</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">New Arrivals</h2>
          <Link
            href="/mens"
            className="text-gray-600 hover:text-black transition-colors font-medium"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickAdd={handleQuickAdd}
            />
          ))}
        </div>
      </section>

      {/* Promo Strip */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-gray-200">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Free Shipping</h3>
            <p className="text-sm text-gray-600">On orders over $100</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Easy Returns</h3>
            <p className="text-sm text-gray-600">30-day return policy</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Secure Checkout</h3>
            <p className="text-sm text-gray-600">100% secure payment</p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mb-16">
        <div className="bg-gray-50 rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay in the loop</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Subscribe to our newsletter and get 10% off your first order
          </p>
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-black text-white px-6 py-3 rounded-md shadow-lg z-50 animate-in slide-in-from-bottom">
          <p>Thanks for subscribing!</p>
        </div>
      )}
    </div>
  )
}
