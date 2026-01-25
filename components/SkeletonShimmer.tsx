'use client'

import { motion } from 'framer-motion'

interface SkeletonShimmerProps {
  className?: string
}

export default function SkeletonShimmer({ className = '' }: SkeletonShimmerProps) {
  return (
    <div className={`relative overflow-hidden bg-neutral-200 ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ willChange: 'transform' }}
      />
    </div>
  )
}
