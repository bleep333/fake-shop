'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import ScrollReveal from './ScrollReveal'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "What's your return policy?",
    answer: "We offer a 30-day return or exchange policy. No questions asked. Simply return your items in their original condition with tags attached for a full refund or exchange.",
  },
  {
    question: "How long does shipping take?",
    answer: "Orders ship in 1–2 days with full tracking included. Standard shipping typically takes 5-7 business days, while express shipping takes 2-3 business days.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship worldwide. International shipping times vary by location, typically 7-14 business days. All international orders include full tracking.",
  },
  {
    question: "What if I ordered the wrong size?",
    answer: "No problem! You can exchange your item for a different size within 30 days of purchase. We offer free exchanges on all items. Just contact our customer service team and we'll help you process the exchange quickly.",
  },
  {
    question: "Are your sizes true to fit?",
    answer: "Yes, our clothing is designed to be true to size. However, we recommend checking our size guide for specific measurements. If you're between sizes, we suggest sizing up for a more comfortable fit. All items include detailed size charts.",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="section-spacing bg-stone-50">
      <div className="container-custom max-w-4xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-light tracking-tight mb-4 text-black"
                style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
              Know Before You Go
            </h2>
            <p className="text-stone-600 text-lg font-light">
              Common questions answered
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} delay={index * 0.05}>
              <motion.div
                initial={false}
                className="bg-stone-50 border border-stone-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 md:px-8 py-6 md:py-8 flex items-center justify-between text-left hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-inset"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span id={`faq-question-${index}`} className="text-lg md:text-xl font-medium text-black pr-8">
                    {faq.question}
                  </span>
                  <motion.svg
                    className="w-6 h-6 text-black flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                    >
                      <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                        <p className="text-stone-600 font-light leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <div className="text-center mt-12">
            <Link
              href="/faqs"
              className="inline-block text-sm font-medium tracking-wide text-black hover:underline transition-all focus:outline-none focus:ring-2 focus:ring-stone-900 rounded px-2 py-1"
            >
              See FAQ&apos;s →
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
