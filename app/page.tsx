'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import ProductCard from '@/components/ProductCard'
import { getProducts } from '@/lib/products'
import { Product } from '@/lib/mockProducts'
import { staggerContainer, staggerFadeUp, transitions, getReducedMotionTransition } from '@/lib/motion.config'
import ScrollReveal from '@/components/ScrollReveal'

export default function Home() {
  const [showToast, setShowToast] = useState(false)
  const [email, setEmail] = useState('')
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    async function loadProducts() {
      try {
        const products = await getProducts({ sortBy: 'newest' })
        setFeaturedProducts(products.slice(0, 8))
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
        {/* Background Image with Ambient Motion */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.05 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: prefersReducedMotion ? 0 : [0, -0.5, 0.3, -0.2, 0],
            y: prefersReducedMotion ? 0 : [0, -0.3, 0.5, 0.2, 0]
          }}
          transition={{ 
            opacity: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
            x: { duration: 12, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 12, repeat: Infinity, ease: "easeInOut" }
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
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: prefersReducedMotion ? 0.3 : 1,
                ease: [0.22, 1, 0.36, 1],
                delay: prefersReducedMotion ? 0 : 0.5
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
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: prefersReducedMotion ? 0.3 : 0.8,
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
                href="/mens"
                className="inline-block px-8 py-4 bg-white text-black font-light tracking-wide hover:bg-white/90 transition-all duration-300 group"
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

      {/* Featured Collections - Editorial Style */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-24">
              {/* Mens Category Link - Safe navigation without blocking */}
          <Link
            href="/mens"
                className="group relative aspect-[4/5] overflow-hidden bg-neutral-100"
                prefetch={true}
              >
                {/* Background Image */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/images/mens-hero.png"
                    alt="Mens Collection"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  {/* Subtle overlay for text readability */}
                  <div className="absolute inset-0 bg-black/20" />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <motion.span
                    initial={{ opacity: 1, y: 0 }}
                    whileHover={{ opacity: 1, y: -5 }}
                    className="text-5xl md:text-6xl font-light text-white drop-shadow-2xl"
                    style={{ textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)' }}
                  >
                    Mens
                  </motion.span>
            </div>
          </Link>
              {/* Womens Category Link - Safe navigation without blocking */}
          <Link
            href="/womens"
                className="group relative aspect-[4/5] overflow-hidden bg-neutral-100"
                prefetch={true}
              >
                {/* Background Image */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/images/womens-hero.jpg"
                    alt="Womens Collection"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  {/* Subtle overlay for text readability */}
                  <div className="absolute inset-0 bg-black/20" />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <motion.span
                    initial={{ opacity: 1, y: 0 }}
                    whileHover={{ opacity: 1, y: -5 }}
                    className="text-5xl md:text-6xl font-light text-white drop-shadow-2xl"
                    style={{ textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)' }}
                  >
                    Womens
                  </motion.span>
                </div>
              </Link>
            </div>
          </ScrollReveal>

          {/* Category Grid */}
          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <Link
            href="/mens?category=shirts"
                className="group relative aspect-square overflow-hidden bg-neutral-50"
              >
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200"
                />
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="text-2xl md:text-3xl font-light text-black">Shirts</span>
            </div>
          </Link>
          <Link
            href="/mens?category=pants"
                className="group relative aspect-square overflow-hidden bg-neutral-50"
              >
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200"
                />
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="text-2xl md:text-3xl font-light text-black">Pants</span>
                </div>
              </Link>
              <Link
                href="/mens?category=outerwear"
                className="group relative aspect-square overflow-hidden bg-neutral-50"
              >
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200"
                />
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="text-2xl md:text-3xl font-light text-black">Outerwear</span>
                </div>
              </Link>
              <Link
                href="/new-arrivals"
                className="group relative aspect-square overflow-hidden bg-neutral-50"
              >
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200"
                />
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="text-2xl md:text-3xl font-light text-black">New</span>
                </div>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Editorial Banner - Built for the Bold */}
      <section className="relative h-[60vh] md:h-[80vh] overflow-hidden bg-black">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center px-4 z-10">
          <ScrollReveal>
            <div className="max-w-3xl">
              <h2 
                className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight"
                style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}
              >
                Built for the Bold
              </h2>
              <p className="text-lg md:text-xl text-white/90 font-light tracking-wide max-w-2xl mx-auto mb-8">
                Discover premium essentials designed for those who dare to stand out. 
                Crafted with intention, styled with confidence.
              </p>
              <Link
                href="/mens"
                className="inline-block px-8 py-4 bg-white text-black font-light tracking-wide hover:bg-white/90 transition-all duration-300"
              >
                Explore Collection
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="section-spacing bg-neutral-50">
        <div className="container-custom">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-16">
              <div>
                <h2 className="text-5xl md:text-6xl font-light tracking-tight mb-4 text-black"
                    style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
                  New Arrivals
                </h2>
                <p className="text-gray-600 text-lg font-light">
                  Latest additions to our collection
                </p>
              </div>
          <Link
                href="/new-arrivals"
                className="hidden md:block text-sm font-medium tracking-wide text-black hover:underline transition-all"
          >
            View all →
          </Link>
        </div>
          </ScrollReveal>

        {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-neutral-200 animate-pulse" />
            ))}
          </div>
        ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
            >
              {featuredProducts.map((product, index) => (
                <motion.div
                key={product.id}
                  variants={staggerFadeUp}
                  custom={index}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
          </div>
      </section>

      {/* Lifestyle Banner */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 py-16 border-y border-neutral-200">
          <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
                <h3 className="text-lg font-light mb-2 text-black">Free Shipping</h3>
                <p className="text-sm text-gray-600 font-light">On orders over $100</p>
          </div>
          <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
                <h3 className="text-lg font-light mb-2 text-black">Easy Returns</h3>
                <p className="text-sm text-gray-600 font-light">30-day return policy</p>
          </div>
          <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
                </div>
                <h3 className="text-lg font-light mb-2 text-black">Secure Checkout</h3>
                <p className="text-sm text-gray-600 font-light">100% secure payment</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Newsletter - Minimal Style */}
      <section className="section-spacing bg-neutral-50">
        <div className="container-custom max-w-2xl">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6 text-black">
                Stay in the loop
              </h2>
              <p className="text-gray-600 mb-12 font-light text-lg">
            Subscribe to our newsletter and get 10% off your first order
          </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
                  disabled
                  className="flex-1 px-6 py-4 border border-neutral-300 bg-white text-gray-500 cursor-not-allowed focus:outline-none font-light"
            />
            <button
              type="submit"
                  disabled
                  className="px-8 py-4 bg-neutral-400 text-white font-light tracking-wide cursor-not-allowed opacity-60"
            >
              Subscribe
            </button>
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
