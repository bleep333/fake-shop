'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import { getProducts } from '@/lib/products'
import { Product } from '@/lib/mockProducts'
import { fadeInUp, staggerContainer, pageTransition } from '@/lib/animations'
import ScrollReveal from '@/components/ScrollReveal'

export default function Home() {
  const [showToast, setShowToast] = useState(false)
  const [email, setEmail] = useState('')
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="overflow-hidden"
    >
      {/* Full-Width Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-neutral-50">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 via-neutral-50 to-white opacity-60" />
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight mb-6 text-black">
              New Season
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto font-light"
            >
              Discover the latest trends in fashion. Curated collections for the modern lifestyle.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/mens" className="btn-primary">
                Shop Mens
              </Link>
              <Link href="/womens" className="btn-secondary">
                Shop Womens
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Collections - Editorial Style */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-24">
              <Link
                href="/mens"
                className="group relative aspect-[4/5] overflow-hidden bg-neutral-100"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300"
                />
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-light text-black"
                  >
                    Mens
                  </motion.span>
                </div>
              </Link>
              <Link
                href="/womens"
                className="group relative aspect-[4/5] overflow-hidden bg-neutral-100"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300"
                />
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-light text-black"
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

      {/* New Arrivals Section */}
      <section className="section-spacing bg-neutral-50">
        <div className="container-custom">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-16">
              <div>
                <h2 className="text-5xl md:text-6xl font-light tracking-tight mb-4 text-black">
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
                  variants={fadeInUp}
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
    </motion.div>
  )
}
