import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CartProvider } from '@/lib/cartContext'
import { WishlistProvider } from '@/lib/wishlistContext'
import SessionProvider from '@/components/SessionProvider'
import PageTransition from '@/components/PageTransition'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fake Shop - Clothing Store',
  description: 'A fake clothing store website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <SessionProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              {/* Main content with padding-top to account for fixed header (h-20 md:h-24 = 80px mobile, 96px desktop) */}
              <main className="flex-1 pt-20 md:pt-24">
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

