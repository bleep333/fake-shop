'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { pageTransition } from '@/lib/motion.config'

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  // Safe page transition wrapper - non-blocking to prevent blank screens
  // Using AnimatePresence without mode="wait" allows new content to appear immediately
  // Fast exit animations (0.2s) prevent visible blank screens
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={pathname}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ willChange: 'transform, opacity' }}
        className="relative w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
