'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
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
  const [openDropdown, setOpenDropdown] = useState<'shop' | 'company' | null>(null)
  const pathname = usePathname()
  // Initialize isScrolled based on pathname - non-home pages should always have white header
  const [isScrolled, setIsScrolled] = useState(pathname !== '/')
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
    
    // Check initial scroll position immediately and after a small delay to ensure DOM is ready
    handleScroll() // Call immediately for instant correct state
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

  // Listen for mobile drawer search trigger
  useEffect(() => {
    const handleOpenSearch = () => {
      setIsSearchOpen(true)
    }
    window.addEventListener('openSearch', handleOpenSearch)
    return () => window.removeEventListener('openSearch', handleOpenSearch)
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

      {/* Fixed Header - Left Nav | Center Brand | Right Icons */}
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
          pathname === '/' && !isScrolled ? 'border-b border-transparent' : 'border-b border-stone-200/50 bg-white'
        }`}
        style={{ 
          willChange: 'background-color',
          top: announcementText ? '2.5rem' : '0',
          ...(pathname === '/' && !isScrolled ? {
            backgroundColor: 'transparent',
            backdropFilter: 'none',
            boxShadow: 'none',
          } : {
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)',
          })
        }}
      >
        <div className="max-w-[1600px] mx-auto px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Left Navigation: Shop, Company, Blog */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-10">
              {/* Shop Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setOpenDropdown('shop')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={`text-base font-medium tracking-wide transition-colors focus:outline-none rounded px-2 py-1 ${
                    isOnHero ? 'text-white/90 hover:text-white' : 'text-stone-900 hover:text-black'
                  }`}
                  aria-label="Shop menu"
                  aria-expanded={openDropdown === 'shop'}
                  aria-haspopup="true"
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
                      className="absolute top-full left-0 mt-2 bg-white border border-stone-200 shadow-soft py-8 px-8 z-[100]"
                      style={{ willChange: 'transform, opacity', minWidth: '600px' }}
                      onMouseEnter={() => setOpenDropdown('shop')}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <div className="grid grid-cols-3 gap-12">
                        {/* Discover Column */}
                        <div>
                          <h3 className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-4">
                            Discover
                          </h3>
                          <ul className="space-y-2">
                            <li>
                              <Link
                                href="/all"
                                className="block text-sm text-stone-900 hover:text-black font-medium tracking-wide transition-colors"
                              >
                                All
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/new-arrivals"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                New
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/popular"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                Popular
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/sale"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                Sale
                              </Link>
                            </li>
                          </ul>
                        </div>

                        {/* Men Column */}
                        <div>
                          <h3 className="text-xs font-medium text-stone-900 uppercase tracking-wider mb-4">
                            Men
                          </h3>
                          <ul className="space-y-2">
                            <li>
                              <Link
                                href="/mens"
                                className="block text-sm text-stone-900 hover:text-black font-medium tracking-wide transition-colors"
                              >
                                All Men&apos;s
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/mens?category=t-shirts"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                T-Shirts
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/mens?category=shirts"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                Shirts
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/mens?category=hoodies"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                Hoodies
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/mens?category=jackets"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                Jackets
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/mens?category=knitwear"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                Knitwear
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/mens?category=pants"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                Pants
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/mens?category=jeans"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                Jeans
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/mens?category=shorts"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                Shorts
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/mens?category=accessories"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                Accessories
                              </Link>
                            </li>
                          </ul>
                        </div>

                        {/* Women Column */}
                        <div>
                          <h3 className="text-xs font-medium text-stone-900 uppercase tracking-wider mb-4">
                            Women
                          </h3>
                          <ul className="space-y-2">
                            <li>
                              <Link
                                href="/womens"
                                className="block text-sm text-stone-900 hover:text-black font-medium tracking-wide transition-colors"
                              >
                                All Women&apos;s
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/womens?category=dresses"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                Dresses
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/womens?category=tops"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                Tops
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/womens?category=t-shirts"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                T-Shirts
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/womens?category=skirts"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                Skirts
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/womens?category=pants"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                Pants
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/womens?category=jeans"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                Jeans
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/womens?category=jackets"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                Jackets
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/womens?category=knitwear"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                Knitwear
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/womens?category=shorts"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                Shorts
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/womens?category=jumpsuits"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                Jumpsuits
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/womens?category=lingerie"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                Lingerie
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/womens?category=accessories"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                Accessories
            </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Company Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setOpenDropdown('company')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={`text-base font-medium tracking-wide transition-colors focus:outline-none rounded px-2 py-1 ${
                    isOnHero ? 'text-white/90 hover:text-white' : 'text-stone-900 hover:text-black'
                  }`}
                  aria-label="Company menu"
                  aria-expanded={openDropdown === 'company'}
                  aria-haspopup="true"
                >
                  Company
                </button>
                <AnimatePresence>
                  {openDropdown === 'company' && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full left-0 mt-2 bg-white border border-stone-200 shadow-soft py-8 px-8 z-[100] rounded-lg"
                      style={{ willChange: 'transform, opacity', minWidth: '700px' }}
                      onMouseEnter={() => setOpenDropdown('company')}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <div className="flex gap-8">
                        {/* Visual Cards Section - Left */}
                        <div className="flex gap-4 flex-1">
                          {/* About Card */}
                          <Link
                            href="/about"
                            className="group relative flex-1 overflow-hidden rounded-lg aspect-[4/5] min-w-[180px] bg-stone-100 hover:opacity-90 transition-opacity"
                          >
                            <Image
                              src="/images/company/about-hero.jpg"
                              alt="About NOVARA"
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 180px, 200px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <span className="text-white font-medium text-sm tracking-wide">About</span>
                            </div>
                          </Link>

                          {/* Values Card */}
                          <Link
                            href="/values"
                            className="group relative flex-1 overflow-hidden rounded-lg aspect-[4/5] min-w-[180px] bg-stone-100 hover:opacity-90 transition-opacity"
                          >
                            <Image
                              src="/images/company/sustainability.jpg"
                              alt="Our Values"
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 180px, 200px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <span className="text-white font-medium text-sm tracking-wide">Values</span>
                            </div>
                          </Link>

                          {/* Locations Card */}
                          <Link
                            href="/locations"
                            className="group relative flex-1 overflow-hidden rounded-lg aspect-[4/5] min-w-[180px] bg-stone-100 hover:opacity-90 transition-opacity"
                          >
                            <Image
                              src="/images/company/team.jpg"
                              alt="Store Locations"
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 180px, 200px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <span className="text-white font-medium text-sm tracking-wide">Locations</span>
                            </div>
                          </Link>
                        </div>

                        {/* Text Links Section - Right */}
                        <div className="w-48 border-l border-stone-200 pl-8">
                          <h3 className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-4">
                            Others
                          </h3>
                          <ul className="space-y-2">
                            <li>
                              <Link
                                href="/faqs"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                FAQ&apos;s
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/contact"
                                className="block text-sm text-stone-700 hover:text-black font-light tracking-wide transition-colors"
                              >
                                Contact
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Blog Link */}
              <Link
                href="/blog"
                className={`text-base font-medium tracking-wide transition-colors focus:outline-none rounded px-2 py-1 ${
                  isOnHero ? 'text-white/90 hover:text-white' : 'text-stone-900 hover:text-black'
                }`}
              >
                Blog
              </Link>
            </nav>

            {/* Center: NOVARA Brand (Large, Centered) */}
              <Link 
              href="/" 
              className={`text-4xl md:text-5xl font-serif font-normal tracking-tight transition-opacity hover:opacity-70 ${
                isOnHero ? 'text-white' : 'text-black'
              }`}
              style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}
            >
              NOVARA
            </Link>

            {/* Right: Search, Wishlist, Cart */}
            <div className="flex items-center gap-5 md:gap-7">
              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`p-2 transition-colors rounded-full ${
                  isOnHero ? 'hover:bg-white/10 text-white' : 'hover:bg-stone-100 text-stone-700'
                }`}
                aria-label="Search"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Wishlist Icon */}
              <Link 
                href="/wishlist" 
                className={`relative p-2 transition-colors rounded-full ${
                  isOnHero ? 'hover:bg-white/10 text-white' : 'hover:bg-stone-100 text-stone-700'
                }`}
                aria-label="Wishlist"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className={`absolute top-0 right-0 text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold ${
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
                  isOnHero ? 'hover:bg-white/10 text-white' : 'hover:bg-stone-100 text-stone-700'
                }`}
                aria-label="Shopping cart"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className={`absolute top-0 right-0 text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold ${
                    isOnHero ? 'bg-white text-black' : 'bg-black text-white'
                  }`}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* Profile / Sign In (Desktop only) */}
              {session ? (
                <div className="hidden md:block relative group">
                  <button
                    className={`p-2 transition-colors rounded-full ${
                      isOnHero ? 'hover:bg-white/10 text-white' : 'hover:bg-stone-100 text-stone-700'
                    }`}
                    aria-label="Profile"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 bg-white border border-stone-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[200px] py-3">
                    <div className="flex flex-col">
                      {/* Greeting - Clickable link to profile */}
                      {!(session.user as any)?.isAdmin ? (
                        <Link
                          href="/profile"
                          className="px-4 py-2 border-b border-stone-200 hover:bg-stone-50 transition-colors"
                        >
                          <p className="text-sm font-semibold text-stone-900">
                            Hi, {session.user?.name?.split(' ')[0] || 'User'}
                          </p>
                        </Link>
                      ) : (
                        <div className="px-4 py-2 border-b border-stone-200">
                          <p className="text-sm font-semibold text-stone-900">
                            Hi, {session.user?.name?.split(' ')[0] || 'Admin'}
                          </p>
                        </div>
                      )}
                      {/* Quick Links - Only show for non-admin users */}
                      {!(session.user as any)?.isAdmin ? (
                        <>
                          <div className="py-1">
                            <Link
                              href="/orders"
                              className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                            >
                              My Orders
                            </Link>
                          </div>
                          {/* Divider */}
                          <div className="border-t border-stone-200 my-1" />
                        </>
                      ) : (
                        <>
                          <div className="py-1">
                            <Link
                              href="/admin"
                              className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                            >
                              Admin Dashboard
                            </Link>
                          </div>
                          {/* Divider */}
                          <div className="border-t border-stone-200 my-1" />
                        </>
                      )}
                      {/* Sign Out */}
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link 
                  href="/auth/signin" 
                  className={`hidden md:block p-2 transition-colors rounded-full ${
                    isOnHero ? 'hover:bg-white/10 text-white' : 'hover:bg-stone-100 text-stone-700'
                  }`}
                  aria-label="Sign In"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`md:hidden p-2 transition-colors rounded-full ${
                  isOnHero ? 'hover:bg-white/10 text-white' : 'hover:bg-stone-100 text-stone-700'
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
