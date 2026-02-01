'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Testimonial {
  quote: string
  author: string
  location: string
}

const testimonials: Testimonial[] = [
  {
    quote: "NOVARA pieces have become the foundation of my wardrobe. The quality is exceptional and the fit is perfect. I've been wearing these pieces for months and they still look brand new.",
    author: "Marcus Petrov",
    location: "Customer from Netherlands",
  },
  {
    quote: "The attention to detail is incredible. Every piece feels thoughtfully designed. I love how versatile the collection is - I can dress it up or down effortlessly.",
    author: "Sarah Chen",
    location: "Customer from USA",
  },
  {
    quote: "Best clothing purchase I've made this year. The style is timeless and the quality is unmatched. I get compliments everywhere I go.",
    author: "James Wilson",
    location: "Customer from UK",
  },
]

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const current = testimonials[activeIndex]

  return (
    <section className="section-spacing bg-black text-white">
      <div className="container-custom flex justify-center">
        <div className="text-center w-full max-w-xl px-4 py-6 md:py-8">
          {/* Quotation mark */}
          <div className="flex justify-center mb-3">
            <span className="text-2xl md:text-3xl text-amber-600/90 font-serif leading-none" aria-hidden>
              &ldquo;
            </span>
          </div>

          {/* Single review - carousel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="min-h-0"
            >
              <p className="text-lg md:text-xl font-semibold text-white uppercase tracking-wide leading-relaxed mb-6">
                {current.quote}
              </p>

              {/* Profile - circular placeholder */}
              <div className="flex flex-col items-center mb-4">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-stone-700 flex items-center justify-center overflow-hidden">
                  <span className="text-xl font-light text-stone-400">
                    {current.author.charAt(0)}
                  </span>
                </div>
                <p className="text-base font-medium text-white mt-2">{current.author}</p>
                <p className="text-xs text-stone-400 font-light">{current.location}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Clickable dots / lines to switch reviews */}
          <div className="flex items-center justify-center gap-3 mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
                aria-label={`View review ${index + 1} of ${testimonials.length}`}
                aria-current={activeIndex === index ? 'true' : undefined}
              >
                <span
                  className={`block w-12 h-0.5 md:w-16 transition-all duration-300 ${
                    activeIndex === index
                      ? 'bg-white'
                      : 'bg-stone-600 group-hover:bg-stone-500'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
