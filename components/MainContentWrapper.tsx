'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface MainContentWrapperProps {
  children: ReactNode
}

export default function MainContentWrapper({ children }: MainContentWrapperProps) {
  const pathname = usePathname()
  
  // Home page hero should start at top, all other pages need padding for fixed header
  // Header height: h-20 (80px) on mobile, h-24 (96px) on desktop
  // Plus announcement bar if present: 2.5rem (40px)
  // Maximum needed: 120px mobile, 136px desktop
  // Using safe values that work with or without announcement:
  // pt-32 = 128px (8rem) on mobile - covers 80px header + 40px announcement + 8px buffer
  // pt-40 = 160px (10rem) on desktop - covers 96px header + 40px announcement + 24px buffer
  const paddingTop = pathname === '/' ? 'pt-0' : 'pt-32 md:pt-40'

  return (
    <div className={paddingTop}>
      {children}
    </div>
  )
}
