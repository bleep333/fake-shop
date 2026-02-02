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
          {/* Fixed height container to prevent layout shift */}
          <div className="relative min-h-[300px] md:min-h-[350px] flex flex-col justify-center">
            {/* Single review - carousel */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ 
                  duration: 0.3, 
                  ease: [0.22, 1, 0.36, 1],
                  opacity: { duration: 0.2 }
                }}
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ willChange: 'transform, opacity' }}
              >
                {/* Quotation mark */}
                <div className="flex justify-center mb-3">
                  <motion.span 
                    className="text-2xl md:text-3xl text-amber-600/90 font-serif leading-none" 
                    aria-hidden="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    &ldquo;
                  </motion.span>
                </div>

                <p className="text-lg md:text-xl font-semibold text-white uppercase tracking-wide leading-relaxed mb-6 px-2">
                  {current.quote}
                </p>

                {/* Profile - circular placeholder */}
                <div className="flex flex-col items-center mb-4">
                  <motion.div 
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-stone-700 flex items-center justify-center overflow-hidden"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-xl font-light text-stone-400">
                      {current.author.charAt(0)}
                    </span>
                  </motion.div>
                  <p className="text-base font-medium text-white mt-2">{current.author}</p>
                  <p className="text-xs text-stone-400 font-light">{current.location}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Clickable dots / lines to switch reviews */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  // Prevent rapid clicking that could cause glitches
                  if (activeIndex !== index) {
                    setActiveIndex(index)
                  }
                }}
                className="group p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded transition-opacity"
                aria-label={`View review ${index + 1} of ${testimonials.length}`}
                aria-current={activeIndex === index ? 'true' : undefined}
                disabled={activeIndex === index}
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
