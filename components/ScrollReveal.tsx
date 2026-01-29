'use client'

import { motion } from 'framer-motion'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { fadeUp, getReducedMotionTransition } from '@/lib/motion.config'
import { ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  variant?: 'fadeUp' | 'fadeIn' | 'scaleFade'
}

export default function ScrollReveal({ 
  children, 
  className, 
  delay = 0,
  variant = 'fadeUp'
}: ScrollRevealProps) {
  const { ref, isVisible, prefersReducedMotion } = useScrollReveal()

  const variants = {
    fadeUp,
    fadeIn: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
    scaleFade: { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } },
  }

  return (
    <motion.div
      ref={ref as any}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={variants[variant]}
      transition={{
        ...getReducedMotionTransition(prefersReducedMotion ?? false),
        delay,
      }}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}
