'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

interface UseParallaxOptions {
  speed?: number
  enabled?: boolean
}

export function useParallax(options: UseParallaxOptions = {}) {
  const { speed = 0.1, enabled = true } = options
  const [offset, setOffset] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (!enabled || prefersReducedMotion) {
      setOffset(0)
      return
    }

    const handleScroll = () => {
      const scrollY = window.scrollY
      setOffset(scrollY * speed)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed, enabled, prefersReducedMotion])

  return offset
}
