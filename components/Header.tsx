'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import MobileDrawer from './MobileDrawer'
import SearchModal from './SearchModal'
import CartDrawer from './CartDrawer'
import { useCart } from '@/lib/cartContext'
import { useWishlist } from '@/lib/wishlistContext'
import { dropdownVariants } from '@/lib/motion.config'

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { getCartCount } = useCart()
  const { getWishlistCount } = useWishlist()
  const cartCount = getCartCount()
  const wishlistCount = getWishlistCount()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<'shop' | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      // Check if we've scrolled past the hero section (approximately 100vh)
      // Only check if we're on the home page
      if (pathname === '/') {
        setIsScrolled(currentScrollY > window.innerHeight * 0.8)
      } else {
        // On other pages, always show white background
        setIsScrolled(true)
      }
    }
    
    // Check initial scroll position after a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      handleScroll()
    }, 100)
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [pathname])

  // Close modals/drawers on route change
  useEffect(() => {
    setIsSearchOpen(false)
    setIsCartOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const [announcementText, setAnnouncementText] = useState<string>('')

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch('/api/promotions/announcement', {
          cache: 'no-store'
        })
        if (response.ok) {
          const data = await response.json()
          if (data.announcementBar) {
            setAnnouncementText(data.announcementBar.text)
          } else {
            setAnnouncementText('')
          }
        }
      } catch (error) {
        console.error('Failed to fetch announcement:', error)
      }
    }
    fetchAnnouncement()
  }, [])

  // Check if we're on the home page hero section (and haven't scrolled past it)
  const isOnHero = pathname === '/' && !isScrolled

  return (
    <>
      {/* Announcement Bar - Always visible, fixed at top */}
      {announcementText && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-black text-white text-center py-2.5 text-sm font-light tracking-wide">
          <p>{announcementText}</p>
        </div>
      )}

      {/* Fixed Header - Nivest Style: Left Nav | Center Brand | Right Icons */}
      <motion.header
        initial={{
          backgroundColor: pathname === '/' ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 0.98)',
          backdropFilter: pathname === '/' ? 'blur(0px)' : 'blur(10px)',
          boxShadow: pathname === '/' ? 'none' : '0 2px 40px rgba(0, 0, 0, 0.08)',
        }}
        animate={{
          backgroundColor: pathname === '/' && !isScrolled ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 0.98)',
          backdropFilter: pathname === '/' && !isScrolled ? 'blur(0px)' : 'blur(10px)',
          boxShadow: pathname === '/' && !isScrolled ? 'none' : '0 2px 40px rgba(0, 0, 0, 0.08)',
        }}
        transition={{ 
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`fixed left-0 right-0 z-50 ${
          pathname === '/' && !isScrolled ? 'border-b border-transparent bg-transparent' : 'border-b border-neutral-200/50 bg-white/98'
        }`}
        style={{ 
          willChange: 'background-color',
          top: announcementText ? '2.5rem' : '0',
          ...(pathname === '/' && !isScrolled ? {
            backgroundColor: 'transparent',
            backdropFilter: 'none',
            boxShadow: 'none',
          } : {})
        }}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Left Navigation: Shop, Company, Blog */}
            <nav className="hidden md:flex items-center gap-8">
              {/* Shop Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (openDropdown === 'shop') {
                      setOpenDropdown(null)
                    } else {
                      setOpenDropdown('shop')
                    }
                  }}
                  className={`text-sm font-light tracking-wide transition-colors ${
                    isOnHero ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-black'
                  }`}
                >
                  Shop
                </button>
                <AnimatePresence>
                  {openDropdown === 'shop' && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full left-0 mt-2 bg-white border border-neutral-200 shadow-soft py-2 min-w-[160px] z-50"
                      style={{ willChange: 'transform, opacity' }}
                    >
                      <Link
                        href="/mens"
                        onClick={() => setOpenDropdown(null)}
                        className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-neutral-50 font-light tracking-wide transition-colors"
                      >
                        All
                      </Link>
                      <Link
                        href="/mens"
                        onClick={() => setOpenDropdown(null)}
                        className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-neutral-50 font-light tracking-wide transition-colors"
                      >
                        Mens
                      </Link>
                      <Link
                        href="/womens"
                        onClick={() => setOpenDropdown(null)}
                        className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-neutral-50 font-light tracking-wide transition-colors"
                      >
                        Womens
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Company */}
              <Link 
                href="/about"
                className={`text-sm font-light tracking-wide transition-colors ${
                  isOnHero ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-black'
                }`}
              >
                Company
              </Link>

              {/* Blog */}
              <Link 
                href="/blog"
                className={`text-sm font-light tracking-wide transition-colors ${
                  isOnHero ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-black'
                }`}
              >
                Blog
              </Link>
            </nav>

            {/* Center: NOVARA Brand (Large, Centered) */}
            <Link 
              href="/" 
              className={`text-3xl md:text-4xl font-serif font-normal tracking-tight transition-opacity hover:opacity-70 ${
                isOnHero ? 'text-white' : 'text-black'
              }`}
              style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}
            >
              NOVARA
            </Link>

            {/* Right: Search, Wishlist, Cart */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`p-2 transition-colors rounded-full ${
                  isOnHero ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-700'
                }`}
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Wishlist Icon */}
              <Link 
                href="/wishlist" 
                className={`relative p-2 transition-colors rounded-full ${
                  isOnHero ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-700'
                }`}
                aria-label="Wishlist"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className={`absolute top-0 right-0 text-xs rounded-full w-4 h-4 flex items-center justify-center ${
                    isOnHero ? 'bg-white text-black' : 'bg-black text-white'
                  }`}>
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-2 transition-colors rounded-full ${
                  isOnHero ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-700'
                }`}
                aria-label="Shopping cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className={`absolute top-0 right-0 text-xs rounded-full w-4 h-4 flex items-center justify-center ${
                    isOnHero ? 'bg-white text-black' : 'bg-black text-white'
                  }`}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* Profile / Sign In (Desktop only) */}
              {session ? (
                <div className="hidden md:block relative group">
                  <Link 
                    href="/profile" 
                    className={`p-2 transition-colors rounded-full ${
                      isOnHero ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    aria-label="Profile"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link 
                  href="/auth/signin" 
                  className={`hidden md:block p-2 transition-colors rounded-full ${
                    isOnHero ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  aria-label="Sign In"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`md:hidden p-2 transition-colors rounded-full ${
                  isOnHero ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-700'
                }`}
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
