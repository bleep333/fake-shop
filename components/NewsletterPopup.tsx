'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'novara-newsletter-popup-closed'
const POPUP_DELAY_MS = 2500

interface NewsletterPopupProps {
  onSubscribe?: (email: string) => Promise<boolean>
}

export default function NewsletterPopup({ onSubscribe }: NewsletterPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const closedAt = typeof window !== 'undefined' ? sessionStorage.getItem(STORAGE_KEY) : null
    if (closedAt) return
    const timer = setTimeout(() => setIsOpen(true), POPUP_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, Date.now().toString())
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      if (onSubscribe) {
        const ok = await onSubscribe(email.trim())
        if (ok) {
          setSubmitted(true)
          if (typeof window !== 'undefined') sessionStorage.setItem(STORAGE_KEY, Date.now().toString())
        }
      } else {
        const res = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        })
        if (res.ok) {
          setSubmitted(true)
          if (typeof window !== 'undefined') sessionStorage.setItem(STORAGE_KEY, Date.now().toString())
        }
      }
    } catch {
      // keep form open on error
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
            aria-hidden
          />
          {/* Centering wrapper so popup is always in the middle */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none p-4">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="newsletter-popup-title"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-xl bg-stone-800 border border-amber-900/50 shadow-2xl pointer-events-auto p-10 md:p-14"
            >
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-5 top-5 p-2 text-stone-400 hover:text-stone-200 transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {submitted ? (
                <div className="text-center py-6">
                  <p className="text-xl md:text-2xl font-light text-stone-100">Thanks for subscribing!</p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-8 px-8 py-4 bg-amber-800 text-stone-100 font-light text-base hover:bg-amber-700 transition-colors border border-amber-700"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <h2 id="newsletter-popup-title" className="text-3xl md:text-4xl font-light text-stone-50 mb-4" style={{ fontFamily: 'var(--font-playfair), ui-serif, serif' }}>
                    Stay in the loop
                  </h2>
                  <p className="text-stone-300 text-base md:text-lg font-light mb-8 max-w-md">
                    Get 10% off your first order and be the first to hear about new collections, restocks and exclusive offers.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-5 py-4 text-lg border border-amber-900/50 bg-stone-700/80 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-700 font-light"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 text-lg bg-amber-800 text-stone-100 font-light hover:bg-amber-700 border border-amber-700 transition-colors disabled:opacity-60"
                    >
                      {loading ? 'Subscribing…' : 'Subscribe'}
                    </button>
                  </form>
                  <p className="mt-6 text-sm text-stone-500 font-light">
                    Unsubscribe at any time.
                  </p>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
