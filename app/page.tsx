'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import ProductCard from '@/components/ProductCard'
import { getProducts } from '@/lib/products'
import { Product } from '@/lib/mockProducts'
import { staggerContainer, staggerFadeUp, transitions, getReducedMotionTransition } from '@/lib/motion.config'
import ScrollReveal from '@/components/ScrollReveal'
import CountdownTimer from '@/components/CountdownTimer'
import CopyableCode from '@/components/CopyableCode'
import Testimonials from '@/components/Testimonials'
import ScrollingProductStrip from '@/components/ScrollingProductStrip'
import NewArrivalsCarousel from '@/components/NewArrivalsCarousel'
import FeaturesScrollingStrip from '@/components/FeaturesScrollingStrip'
import FAQ from '@/components/FAQ'

export default function Home() {
  const [showToast, setShowToast] = useState(false)
  const [email, setEmail] = useState('')
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const prefersReducedMotion = useReducedMotion()
  const { scrollY } = useScroll()
  
  // Parallax effects - keep image visible on scroll
  const heroY = useTransform(scrollY, [0, 500], [0, 150])
  // Removed heroOpacity fade - keep image visible instead of fading to black

  useEffect(() => {
    async function loadProducts() {
      try {
        const newest = await getProducts({ sortBy: 'newest' })
        setFeaturedProducts(newest.slice(0, 8))
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setShowToast(true)
        setEmail('')
        setTimeout(() => setShowToast(false), 3000)
      } else {
        console.error('Failed to subscribe')
        setShowToast(true)
        setEmail('')
        setTimeout(() => setShowToast(false), 3000)
      }
    } catch (error) {
      console.error('Error subscribing:', error)
    setShowToast(true)
    setEmail('')
    setTimeout(() => setShowToast(false), 3000)
    }
  }

  // Note: PageTransition component already handles page transitions, so we don't need
  // a motion.div wrapper here. Removing it prevents double-wrapping that causes blank pages.
  return (
    <div className="relative -mt-0 pt-0">
      {/* Full-Viewport Hero Section - starts at top, header overlays it */}
      <section className="relative w-full overflow-hidden bg-black film-grain" style={{ 
        height: '100vh',
        minHeight: '100vh'
      }}>
        {/* Background Image with Ambient Motion and Parallax */}
        <motion.div
          className="absolute inset-0"
          style={{ 
            y: heroY,
          }}
          initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.05 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: prefersReducedMotion ? 0 : [0, -0.5, 0.3, -0.2, 0],
          }}
          transition={{ 
            opacity: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
            x: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Image
            src="/hero-fakeshop.png"
            alt="NOVARA Hero"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            quality={90}
          />
        </motion.div>

        {/* Subtle Dark Gradient Overlay - minimal for premium look */}
        <div 
          className="absolute inset-0 z-[1]"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.3) 100%)'
          }}
        />

        {/* Text Content - Bottom Left */}
        <div className="absolute bottom-0 left-0 z-10 p-8 md:p-12 lg:p-16 xl:p-20">
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: prefersReducedMotion ? 0.3 : 1,
              ease: [0.22, 1, 0.36, 1],
              delay: prefersReducedMotion ? 0 : 0.3
            }}
            className="space-y-4 md:space-y-5"
          >
            {/* Title - Enhanced Animation */}
            <motion.h1
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: prefersReducedMotion ? 0.3 : 1.2,
                ease: [0.22, 1, 0.36, 1],
                delay: prefersReducedMotion ? 0 : 0.4
              }}
              className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-white leading-[0.95] tracking-[-0.02em]"
              style={{
                textShadow: '0 2px 20px rgba(0, 0, 0, 0.4), 0 4px 40px rgba(0, 0, 0, 0.2)',
                fontFamily: 'var(--font-playfair), ui-serif, Georgia, serif',
                letterSpacing: '0.02em'
              }}
            >
              NOVARA
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: prefersReducedMotion ? 0.3 : 1,
                ease: [0.22, 1, 0.36, 1],
                delay: prefersReducedMotion ? 0 : 0.7
              }}
              className="text-lg md:text-xl lg:text-2xl text-white font-light tracking-wide"
              style={{
                textShadow: '0 1px 10px rgba(0, 0, 0, 0.4), 0 2px 20px rgba(0, 0, 0, 0.2)',
                fontFamily: 'var(--font-inter), system-ui, sans-serif'
              }}
            >
              Effortless Style, Everyday.
            </motion.p>

            {/* Shop Now CTA */}
            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: prefersReducedMotion ? 0.3 : 0.8,
                ease: [0.22, 1, 0.36, 1],
                delay: prefersReducedMotion ? 0 : 0.9
              }}
              className="pt-2"
            >
              <Link
                href="/all"
                className="inline-block px-8 py-4 bg-white text-black font-light tracking-wide hover:bg-white/90 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Shop all products"
              >
                <span className="flex items-center gap-2">
                  Shop Now
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </motion.svg>
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Collections - Editorial Style with Enhanced Animations */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-24">
              {/* Mens Category Link - Enhanced hover effects */}
          <Link
            href="/mens"
                className="group relative aspect-[4/5] overflow-hidden bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2"
                prefetch={true}
                aria-label="Shop Men&apos;s collection"
              >
                {/* Background Image */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/images/mens-hero.png"
                    alt="Mens Collection"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  {/* Subtle overlay for text readability */}
                  <motion.div 
                    className="absolute inset-0 bg-black/20"
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                  <motion.span
                    initial={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="text-5xl md:text-6xl font-light text-white drop-shadow-2xl mb-2"
                    style={{ textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)' }}
                  >
                    Men&apos;s
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                    className="text-lg md:text-xl font-light text-white/90 uppercase tracking-wider"
                    style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)' }}
                  >
                    Collection
                  </motion.span>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-4 text-sm font-light text-white uppercase tracking-widest"
                  >
                    Shop Men →
                  </motion.div>
            </div>
          </Link>
              {/* Womens Category Link - Enhanced hover effects */}
          <Link
            href="/womens"
                className="group relative aspect-[4/5] overflow-hidden bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2"
                prefetch={true}
                aria-label="Shop Women&apos;s collection"
              >
                {/* Background Image */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/images/womens-hero.jpg"
                    alt="Womens Collection"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  {/* Subtle overlay for text readability */}
                  <motion.div 
                    className="absolute inset-0 bg-black/20"
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                  <motion.span
                    initial={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="text-5xl md:text-6xl font-light text-white drop-shadow-2xl mb-2"
                    style={{ textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)' }}
                  >
                    Women&apos;s
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                    className="text-lg md:text-xl font-light text-white/90 uppercase tracking-wider"
                    style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)' }}
                  >
                    Collection
                  </motion.span>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-4 text-sm font-light text-white uppercase tracking-widest"
                  >
                    Shop Women →
                  </motion.div>
                </div>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Built for the Bold - editorial block, matches section rhythm */}
      <section className="section-spacing bg-stone-100">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-2xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-stone-900 mb-6"
                style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}
              >
                Built for the Bold
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-lg md:text-xl text-stone-600 font-light leading-relaxed mb-10 max-w-xl"
              >
                Discover premium essentials designed for those who dare to stand out. Crafted with intention, styled with confidence.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href="/all"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-stone-900 text-white font-light tracking-wide hover:bg-stone-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2"
                  aria-label="Shop all products"
                >
                  Shop Now
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </motion.svg>
                </Link>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* New Arrivals Section - horizontal scroll, pauses on hover */}
      <section className="section-spacing bg-stone-50">
        <div className="container-custom">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-5xl md:text-6xl font-light tracking-tight mb-4 text-black"
                    style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
                  New Arrivals
                </h2>
                <p className="text-stone-600 text-lg font-light">
                  Discover the latest additions to our collection
                </p>
              </div>
              <Link
                href="/new-arrivals"
                className="hidden md:block text-sm font-medium tracking-wide text-black hover:underline transition-all focus:outline-none focus:ring-2 focus:ring-stone-900 rounded px-2 py-1"
                aria-label="View all new arrivals"
              >
                View all →
              </Link>
            </div>
          </ScrollReveal>
          <NewArrivalsCarousel products={featuredProducts} loading={loading} />
        </div>
      </section>

      {/* Sale Section - full photo behind, copyable code, centered for clear viewing */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden bg-stone-900">
        {/* Full background image - add sale-bg.jpg to public/images for custom photo */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/sale-bg.jpg"
            alt="NOVARA sale collection background"
            className="absolute inset-0 w-full h-full object-cover object-center"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/55" aria-hidden />
        </div>
        <div className="relative container-custom py-16 md:py-24 flex flex-col items-center justify-center z-10 w-full">
          <ScrollReveal>
            <div className="text-center max-w-xl mx-auto px-4">
              <CopyableCode code="NOVARA38" className="mb-5" />
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl md:text-4xl lg:text-5xl font-medium text-white uppercase tracking-wider mb-5"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
              >
                Get 38% off
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-lg md:text-xl text-white/95 font-light mb-10 leading-relaxed"
                style={{ textShadow: '0 1px 12px rgba(0,0,0,0.35)' }}
              >
                Limited time. Unlock our best deals – don&apos;t overthink it.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href="/sale"
                  className="inline-block px-10 py-4 bg-white text-stone-900 font-medium tracking-wide hover:bg-white/95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-stone-900"
                  aria-label="Shop sale items"
                >
                  Shop Sale
                </Link>
              </motion.div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <div className="flex flex-col items-center mt-14 md:mt-16 w-full max-w-2xl mx-auto px-4">
              <CountdownTimer
                targetDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Free Return / Secure Checkout / Worldwide - small scrolling strip */}
      <FeaturesScrollingStrip />

      {/* Statement, Not Subtle - centered editorial block, dark theme */}
      <section className="section-spacing bg-stone-900">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-2xl mx-auto text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white mb-6"
                style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}
              >
                Statement, Not Subtle
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-lg md:text-xl text-white/85 font-light leading-relaxed mb-10"
              >
                Timeless pieces that move with you. No fluff, just refined style and exceptional quality.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="flex justify-center"
              >
                <Link
                  href="/all"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-stone-900 font-light tracking-wide hover:bg-white/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-stone-900"
                  aria-label="Shop all products"
                >
                  Shop Now
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </motion.svg>
                </Link>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Scrolling product strip */}
      <ScrollingProductStrip />

      {/* FAQ Section */}
      <FAQ />

      {/* Newsletter - Enhanced Style */}
      <section className="section-spacing bg-black text-white">
        <div className="container-custom max-w-2xl">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6 text-white"
                  style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
                Subscribe to Our Newsletter
              </h2>
              <p className="text-white/80 mb-12 font-light text-lg">
                Stay updated with the latest collections, exclusive offers, and style inspiration from NOVARA. You can unsubscribe at any time.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-6 py-4 border border-white/20 bg-white/5 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors font-light"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-white text-black font-light tracking-wide hover:bg-white/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="Subscribe to newsletter"
                >
                  Subscribe
                </motion.button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Toast Notification */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 right-8 bg-black text-white px-8 py-4 shadow-soft-lg z-50"
        >
          <p className="font-light">Thanks for subscribing!</p>
        </motion.div>
      )}

    </div>
  )
}
