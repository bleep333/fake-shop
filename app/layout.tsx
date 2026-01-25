import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CartProvider } from '@/lib/cartContext'
import { WishlistProvider } from '@/lib/wishlistContext'
import SessionProvider from '@/components/SessionProvider'
import PageTransition from '@/components/PageTransition'
import './globals.css'

// Google Fonts - Luxury typography system
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NOVARA - Premium Clothing',
  description: 'Premium clothing and fashion essentials',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <SessionProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              {/* Main content - no padding, hero starts at top */}
              <main className="flex-1 pt-0">
                <PageTransition>
                  {children}
                </PageTransition>
              </main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

