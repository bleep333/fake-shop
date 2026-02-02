'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ScrollReveal'

export default function BlogPage() {
  const featuredArticle = {
    title: "Top Fashion Trends for the Season",
    category: "Style",
    journal: "Journal",
    image: "/images/blog/hero-fashion-trends.jpg",
    description: "Discover the essential pieces that define this season's wardrobe. From statement jackets to wide-leg trousers, explore the trends shaping modern fashion."
  }

  const latestNews = [
    {
      id: 1,
      title: "Better materials make better movement",
      category: "Materials",
      journal: "Journal",
      image: "/images/blog/accessories-flatlay.jpg",
      description: "Exploring how quality fabrics and sustainable materials create clothing that moves with you."
    },
    {
      id: 2,
      title: "Slower design makes stronger products",
      category: "Design",
      journal: "Journal",
      image: "/images/blog/model-blonde.jpg",
      description: "The art of thoughtful design and how taking time creates timeless pieces."
    },
    {
      id: 3,
      title: "Our clothing deserves elite-level design",
      category: "Design",
      journal: "Journal",
      image: "/images/blog/model-curly-hair.jpg",
      description: "Why every garment deserves the same attention to detail as high fashion."
    }
  ]

  const relatedArticles = [
    {
      id: 4,
      title: "Trust is the real product we build",
      category: "Brand Trust",
      journal: "Journal",
      image: "/images/blog/group-walking.jpg",
      description: "Building relationships through quality, transparency, and exceptional service."
    },
    {
      id: 5,
      title: "What is a competitive edge",
      category: "Culture",
      journal: "Journal",
      image: "/images/blog/group-five.jpg",
      description: "How our community and values set us apart in the fashion industry."
    },
    {
      id: 6,
      title: "Restraint is a strength, not a weakness",
      category: "Brand",
      journal: "Journal",
      image: "/images/blog/group-walking.jpg",
      description: "The power of minimalism and why less truly is more in modern fashion."
    }
  ]

  return (
    <div className="w-full">
      {/* Hero Section - NIVEST Style */}
      <section className="w-full py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-16 md:mb-20 text-black"
                style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
              Newsroom
            </h1>
          </ScrollReveal>

          {/* Featured Article - Large Hero */}
          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center mb-20 md:mb-24">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[4/3] rounded-lg overflow-hidden bg-stone-100"
              >
                <Image
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </motion.div>
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs font-medium text-stone-600 uppercase tracking-wider">{featuredArticle.category}</span>
                  <span className="text-stone-400">•</span>
                  <span className="text-xs font-medium text-stone-600 uppercase tracking-wider">{featuredArticle.journal}</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-6 text-black leading-tight"
                    style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
                  {featuredArticle.title}
                </h2>
                <p className="text-lg text-stone-600 font-light leading-relaxed mb-8">
                  {featuredArticle.description}
                </p>
                <Link 
                  href={`/blog/${featuredArticle.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-flex items-center gap-2 text-base font-medium text-black hover:underline transition-colors group"
                >
                  Read Now
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
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h3 className="text-2xl md:text-3xl font-light tracking-tight mb-12 md:mb-16 text-black"
                style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
              Latest news
            </h3>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {latestNews.map((article, index) => (
              <ScrollReveal key={article.id} delay={index * 0.1}>
                <Link 
                  href={`/blog/${article.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group block"
                >
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 mb-4"
                  >
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </motion.div>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-xs font-medium text-stone-600 uppercase tracking-wider">{article.category}</span>
                    <span className="text-stone-400">•</span>
                    <span className="text-xs font-medium text-stone-600 uppercase tracking-wider">{article.journal}</span>
                  </div>
                  <h4 className="text-xl md:text-2xl font-light tracking-tight text-black group-hover:underline transition-colors leading-tight"
                      style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
                    {article.title}
                  </h4>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* You Might Also Like Section */}
      <section className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h3 className="text-2xl md:text-3xl font-light tracking-tight mb-12 md:mb-16 text-black"
                style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
              You might also like
            </h3>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {relatedArticles.map((article, index) => (
              <ScrollReveal key={article.id} delay={index * 0.1}>
                <Link 
                  href={`/blog/${article.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group block"
                >
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 mb-4"
                  >
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </motion.div>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-xs font-medium text-stone-600 uppercase tracking-wider">{article.category}</span>
                    <span className="text-stone-400">•</span>
                    <span className="text-xs font-medium text-stone-600 uppercase tracking-wider">{article.journal}</span>
                  </div>
                  <h4 className="text-xl md:text-2xl font-light tracking-tight text-black group-hover:underline transition-colors leading-tight"
                      style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
                    {article.title}
                  </h4>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
