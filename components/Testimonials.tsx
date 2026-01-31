'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import ScrollReveal from './ScrollReveal'

interface Testimonial {
  quote: string
  author: string
  location: string
  image?: string
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
  return (
    <section className="section-spacing bg-white">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-light tracking-tight mb-4 text-black"
                style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
              What Our Customers Say
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="bg-neutral-50 p-8 md:p-10 h-full flex flex-col"
              >
                <div className="flex-1 mb-6">
                  <p className="text-lg md:text-xl text-gray-900 font-light leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="border-t border-neutral-200 pt-6">
                  <p className="text-base font-medium text-black mb-1">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-600 font-light">
                    {testimonial.location}
                  </p>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
