'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Focus trap
      drawerRef.current?.focus()
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-xl transform transition-transform md:hidden"
        tabIndex={-1}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-4">
            <Link
              href="/new-arrivals"
              onClick={onClose}
              className={`block py-2 text-lg font-medium transition-colors ${
                pathname === '/new-arrivals' ? 'text-black' : 'text-gray-600 hover:text-black'
              }`}
            >
              New Arrivals
            </Link>
            <Link
              href="/mens"
              onClick={onClose}
              className={`block py-2 text-lg font-medium transition-colors ${
                pathname === '/mens' ? 'text-black' : 'text-gray-600 hover:text-black'
              }`}
            >
              Mens
            </Link>
            <Link
              href="/womens"
              onClick={onClose}
              className={`block py-2 text-lg font-medium transition-colors ${
                pathname === '/womens' ? 'text-black' : 'text-gray-600 hover:text-black'
              }`}
            >
              Womens
            </Link>
            <Link
              href="/wishlist"
              onClick={onClose}
              className={`block py-2 text-lg font-medium transition-colors ${
                pathname === '/wishlist' ? 'text-black' : 'text-gray-600 hover:text-black'
              }`}
            >
              Wishlist
            </Link>
            <Link
              href="/cart"
              onClick={onClose}
              className={`block py-2 text-lg font-medium transition-colors ${
                pathname === '/cart' ? 'text-black' : 'text-gray-600 hover:text-black'
              }`}
            >
              Cart
            </Link>
            <Link
              href="/profile"
              onClick={onClose}
              className={`block py-2 text-lg font-medium transition-colors ${
                pathname === '/profile' ? 'text-black' : 'text-gray-600 hover:text-black'
              }`}
            >
              Profile
            </Link>
          </nav>

          {/* Search in Mobile */}
          <div className="p-4 border-t">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
      </div>
    </>
  )
}

