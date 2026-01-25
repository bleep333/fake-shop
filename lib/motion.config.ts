// Premium animation configuration inspired by Calder Co
// High-end fashion ecommerce motion design system

import { Variants, Transition, Easing } from 'framer-motion'

// ============================================
// EASING PRESETS (Premium, Slow, Smooth)
// ============================================

export const easings = {
  // Primary easing - smooth, premium feel
  smooth: [0.22, 1, 0.36, 1] as Easing,
  // Gentle ease-out
  gentle: [0.4, 0, 0.2, 1] as Easing,
  // Spring-like
  spring: [0.34, 1.56, 0.64, 1] as Easing,
  // Slow ease
  slow: [0.25, 0.46, 0.45, 0.94] as Easing,
  // Ultra smooth
  premium: [0.16, 1, 0.3, 1] as Easing,
} as const

// ============================================
// TRANSITION PRESETS
// ============================================

export const transitions = {
  // Slow, premium page transitions
  page: {
    duration: 0.8,
    ease: easings.premium,
  } as Transition,
  
  // Section reveal
  reveal: {
    duration: 1,
    ease: easings.smooth,
  } as Transition,
  
  // Hover interactions
  hover: {
    duration: 0.5,
    ease: easings.smooth,
  } as Transition,
  
  // Quick microinteractions
  quick: {
    duration: 0.3,
    ease: easings.gentle,
  } as Transition,
  
  // Spring-based
  spring: {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
    mass: 1,
  } as Transition,
  
  // Stagger delay
  stagger: {
    staggerChildren: 0.08,
    delayChildren: 0.1,
  } as Transition,
} as const

// ============================================
// ANIMATION VARIANTS
// ============================================

// Fade up with premium timing
export const fadeUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    transition: transitions.reveal,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.reveal,
  },
}

// Fade in
export const fadeIn: Variants = {
  hidden: { 
    opacity: 0,
    transition: transitions.reveal,
  },
  visible: { 
    opacity: 1,
    transition: transitions.reveal,
  },
}

// Scale + fade (for images)
export const scaleFade: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    transition: transitions.reveal,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: transitions.reveal,
  },
}

// Slide up with mask reveal
export const slideUpMask: Variants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    clipPath: 'inset(100% 0 0 0)',
    transition: transitions.reveal,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    clipPath: 'inset(0% 0 0 0)',
    transition: transitions.reveal,
  },
}

// Stagger container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      ...transitions.stagger,
      duration: 0.6,
    },
  },
}

// Stagger children with fade up
export const staggerFadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easings.smooth,
    },
  },
}

// Page transition - faster exit to prevent blank screens
export const pageTransition: Variants = {
  initial: { 
    opacity: 0, 
    y: 10,
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      ...transitions.page,
      duration: 0.4, // Faster entrance
    },
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: {
      duration: 0.2, // Much faster exit to prevent blank screen
      ease: easings.gentle,
    },
  },
}

// Navbar variants
export const navbarVariants: Variants = {
  hidden: { 
    y: -100,
    opacity: 0,
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easings.smooth,
    },
  },
}

// Dropdown variants
export const dropdownVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: -10,
    scale: 0.95,
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: easings.gentle,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: easings.gentle,
    },
  },
}

// Mobile menu slide
export const mobileMenuVariants: Variants = {
  hidden: { 
    x: '100%',
    transition: {
      duration: 0.4,
      ease: easings.smooth,
    },
  },
  visible: { 
    x: 0,
    transition: {
      duration: 0.4,
      ease: easings.smooth,
    },
  },
}

// Modal variants (for search modal)
export const modalVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
      ease: easings.gentle,
    },
  },
}

// Drawer variants (for cart drawer)
export const drawerVariants: Variants = {
  hidden: { 
    x: '100%',
    transition: {
      duration: 0.4,
      ease: easings.smooth,
    },
  },
  visible: { 
    x: 0,
    transition: {
      duration: 0.4,
      ease: easings.smooth,
    },
  },
  exit: {
    x: '100%',
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
}

// ============================================
// HOVER EFFECTS
// ============================================

export const hoverEffects = {
  // Product card hover
  productCard: {
    scale: 1.02,
    transition: transitions.hover,
  },
  
  // Image zoom
  imageZoom: {
    scale: 1.08,
    transition: transitions.hover,
  },
  
  // Button fill
  buttonFill: {
    scale: 1.02,
    transition: transitions.quick,
  },
  
  // Text underline
  textUnderline: {
    scaleX: 1,
    transition: transitions.quick,
  },
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Get reduced motion transition
export function getReducedMotionTransition(reduced: boolean): Transition {
  if (reduced) {
    return {
      duration: 0.01,
      ease: easings.gentle,
    }
  }
  return transitions.reveal
}

// Create stagger with custom delay
export function createStagger(delay: number = 0.08) {
  return {
    staggerChildren: delay,
    delayChildren: 0.1,
  }
}

// Parallax transform
export function getParallaxTransform(progress: number, intensity: number = 0.1) {
  return {
    y: progress * intensity * 100,
    opacity: 1 - progress * 0.3,
  }
}
