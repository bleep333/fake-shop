'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import MobileDrawer from './MobileDrawer'
import { useCart } from '@/lib/cartContext'

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { getCartCount } = useCart()
  const cartCount = getCartCount()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-black text-white text-center py-2 text-sm">
        <p>Free shipping on orders over $100 • Use code: SAVE20</p>
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <Link href="/" className="text-2xl font-bold text-black hover:opacity-80 transition-opacity">
              Fake Shop
            </Link>

            {/* Center: Nav Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-8">
              <Link 
                href="/mens" 
                className={`text-sm font-medium transition-colors ${
                  pathname === '/mens' ? 'text-black' : 'text-gray-600 hover:text-black'
                }`}
              >
                Mens
              </Link>
              <Link 
                href="/womens" 
                className={`text-sm font-medium transition-colors ${
                  pathname === '/womens' ? 'text-black' : 'text-gray-600 hover:text-black'
                }`}
              >
                Womens
              </Link>
              <Link 
                href="/wishlist" 
                className={`text-sm font-medium transition-colors ${
                  pathname === '/wishlist' ? 'text-black' : 'text-gray-600 hover:text-black'
                }`}
              >
                Wishlist
              </Link>
            </nav>

            {/* Right: Search, Cart, Profile */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                {isSearchOpen ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      autoFocus
                      onBlur={() => setIsSearchOpen(false)}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Cart */}
              <Link 
                href="/cart" 
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Shopping cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <Link 
                href="/profile" 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Profile"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}

