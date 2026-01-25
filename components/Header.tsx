'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import MobileDrawer from './MobileDrawer'
import { useCart } from '@/lib/cartContext'
import { dropdownVariants, navbarVariants } from '@/lib/motion.config'

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { getCartCount } = useCart()
  const cartCount = getCartCount()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<'new-arrivals' | 'mens' | 'womens' | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 20)
      
      // Show/hide navbar on scroll (hide when scrolling down, show when scrolling up)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(currentScrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

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

  // Close dropdown when pathname changes
  useEffect(() => {
    setOpenDropdown(null)
  }, [pathname])

  return (
    <>
      {/* Announcement Bar */}
      {announcementText && (
        <div className="bg-black text-white text-center py-2 text-sm">
          <p>{announcementText}</p>
        </div>
      )}

      {/* Fixed Header - positioned at top, content below accounts for height with padding-top */}
      <motion.header
        initial={false}
        animate={{
          y: isVisible ? 0 : -100,
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 1)',
          backdropFilter: isScrolled ? 'blur(10px)' : 'blur(0px)',
          boxShadow: isScrolled ? '0 2px 40px rgba(0, 0, 0, 0.08)' : 'none',
        }}
        transition={{ 
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200 bg-white"
        style={{ willChange: 'transform' }}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Left: Logo */}
            <Link href="/" className="text-2xl md:text-3xl font-light tracking-tight text-black hover:opacity-70 transition-opacity">
              Fake Shop
            </Link>

            {/* Center: Nav Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-10">
              {/* New Arrivals Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (openDropdown === 'new-arrivals') {
                      setOpenDropdown(null)
                      router.push('/new-arrivals')
                    } else {
                      setOpenDropdown('new-arrivals')
                    }
                  }}
                  className={`text-sm font-light tracking-wide transition-colors ${
                    pathname === '/new-arrivals' ? 'text-black' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  New Arrivals
                </button>
                <AnimatePresence>
                  {openDropdown === 'new-arrivals' && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full left-0 mt-2 bg-white border border-neutral-200 shadow-soft py-2 min-w-[140px] z-50"
                      style={{ willChange: 'transform, opacity' }}
                    >
                      <Link
                        href="/new-arrivals?category=shirts"
                        onClick={() => setOpenDropdown(null)}
                        className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-neutral-50 font-light tracking-wide transition-colors"
                      >
                        Shirts
                      </Link>
                      <Link
                        href="/new-arrivals?category=pants"
                        onClick={() => setOpenDropdown(null)}
                        className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-neutral-50 font-light tracking-wide transition-colors"
                      >
                        Pants
                      </Link>
                      <Link
                        href="/new-arrivals?category=outerwear"
                        onClick={() => setOpenDropdown(null)}
                        className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-neutral-50 font-light tracking-wide transition-colors"
                      >
                        Outerwear
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Mens Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (openDropdown === 'mens') {
                      setOpenDropdown(null)
                      router.push('/mens')
                    } else {
                      setOpenDropdown('mens')
                    }
                  }}
                  className={`text-sm font-light tracking-wide transition-colors ${
                    pathname === '/mens' ? 'text-black' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Mens
                </button>
                <AnimatePresence>
                  {openDropdown === 'mens' && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full left-0 mt-2 bg-white border border-neutral-200 shadow-soft py-2 min-w-[140px] z-50"
                      style={{ willChange: 'transform, opacity' }}
                    >
                      <Link
                        href="/mens?category=shirts"
                        onClick={() => setOpenDropdown(null)}
                        className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-neutral-50 font-light tracking-wide transition-colors"
                      >
                        Shirts
                      </Link>
                      <Link
                        href="/mens?category=pants"
                        onClick={() => setOpenDropdown(null)}
                        className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-neutral-50 font-light tracking-wide transition-colors"
                      >
                        Pants
                      </Link>
                      <Link
                        href="/mens?category=outerwear"
                        onClick={() => setOpenDropdown(null)}
                        className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-neutral-50 font-light tracking-wide transition-colors"
                      >
                        Outerwear
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Womens Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (openDropdown === 'womens') {
                      setOpenDropdown(null)
                      router.push('/womens')
                    } else {
                      setOpenDropdown('womens')
                    }
                  }}
                  className={`text-sm font-light tracking-wide transition-colors ${
                    pathname === '/womens' ? 'text-black' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Womens
                </button>
                <AnimatePresence>
                  {openDropdown === 'womens' && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full left-0 mt-2 bg-white border border-neutral-200 shadow-soft py-2 min-w-[140px] z-50"
                      style={{ willChange: 'transform, opacity' }}
                    >
                      <Link
                        href="/womens?category=shirts"
                        onClick={() => setOpenDropdown(null)}
                        className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-neutral-50 font-light tracking-wide transition-colors"
                      >
                        Shirts
                      </Link>
                      <Link
                        href="/womens?category=pants"
                        onClick={() => setOpenDropdown(null)}
                        className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-neutral-50 font-light tracking-wide transition-colors"
                      >
                        Pants
                      </Link>
                      <Link
                        href="/womens?category=outerwear"
                        onClick={() => setOpenDropdown(null)}
                        className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-neutral-50 font-light tracking-wide transition-colors"
                      >
                        Outerwear
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link 
                href="/wishlist" 
                className={`text-sm font-light tracking-wide transition-colors ${
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

              {/* Profile / Sign In */}
              {session ? (
                <div className="relative group">
                  <Link 
                    href="/profile" 
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Profile"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Sign In"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )}

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
      </motion.header>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}

