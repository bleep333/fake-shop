'use client'

import { createContext, useContext, useReducer, useCallback, useEffect, useState, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { Product } from './mockProducts'

type WishlistContextType = {
  wishlistItems: Product[]
  isInWishlist: (productId: string) => boolean
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  getWishlistCount: () => number
  isHydrated: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const WISHLIST_STORAGE_KEY = 'fake-shop-wishlist'

type WishlistAction =
  | { type: 'LOAD_WISHLIST'; payload: Product[] }
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'CLEAR_WISHLIST' }

function wishlistReducer(state: Product[], action: WishlistAction): Product[] {
  switch (action.type) {
    case 'LOAD_WISHLIST':
      return action.payload
    
    case 'ADD_TO_WISHLIST': {
      // Check if product is already in wishlist
      if (state.some(item => item.id === action.payload.id)) {
        return state
      }
      return [...state, action.payload]
    }
    
    case 'REMOVE_FROM_WISHLIST':
      return state.filter(item => item.id !== action.payload)
    
    case 'CLEAR_WISHLIST':
      return []
    
    default:
      return state
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, dispatch] = useReducer(wishlistReducer, [])
  const [isHydrated, setIsHydrated] = useState(false)
  const { data: session, status } = useSession()

  // Load wishlist on mount
  useEffect(() => {
    async function loadWishlist() {
      try {
        if (status === 'loading') return

        if (session?.user) {
          // Load from API for logged-in users
          try {
            const response = await fetch('/api/wishlist')
            if (response.ok) {
              const data = await response.json()
              dispatch({ type: 'LOAD_WISHLIST', payload: data.products || [] })
            }
          } catch (error) {
            console.error('Failed to load wishlist from API:', error)
          }
        } else {
          // Load from localStorage for non-logged-in users
          const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY)
          if (savedWishlist) {
            try {
              const products = JSON.parse(savedWishlist)
              dispatch({ type: 'LOAD_WISHLIST', payload: products })
            } catch (error) {
              console.error('Failed to parse wishlist from localStorage:', error)
            }
          }
        }
      } catch (error) {
        console.error('Failed to load wishlist:', error)
      } finally {
        setIsHydrated(true)
      }
    }
    loadWishlist()
  }, [session, status])

  // Save wishlist when it changes
  useEffect(() => {
    if (!isHydrated) return

    async function saveWishlist() {
      try {
        if (session?.user) {
          // Save to API for logged-in users
          try {
            await fetch('/api/wishlist', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productIds: wishlistItems.map(p => p.id) }),
            })
          } catch (error) {
            console.error('Failed to save wishlist to API:', error)
          }
        } else {
          // Save to localStorage for non-logged-in users
          localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems))
        }
      } catch (error) {
        console.error('Failed to save wishlist:', error)
      }
    }
    saveWishlist()
  }, [wishlistItems, isHydrated, session])

  const addToWishlist = useCallback(async (product: Product) => {
    // Don't add if already in wishlist
    if (wishlistItems.some(item => item.id === product.id)) {
      return
    }

    dispatch({ type: 'ADD_TO_WISHLIST', payload: product })

    // If logged in, also sync with API
    if (session?.user) {
      try {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id }),
        })
      } catch (error) {
        console.error('Failed to add to wishlist via API:', error)
      }
    }
  }, [wishlistItems, session])

  const removeFromWishlist = useCallback(async (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId })

    // If logged in, also sync with API
    if (session?.user) {
      try {
        await fetch('/api/wishlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        })
      } catch (error) {
        console.error('Failed to remove from wishlist via API:', error)
      }
    }
  }, [session])

  const isInWishlist = useCallback((productId: string): boolean => {
    return wishlistItems.some(item => item.id === productId)
  }, [wishlistItems])

  const getWishlistCount = useCallback((): number => {
    return wishlistItems.length
  }, [wishlistItems])

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        getWishlistCount,
        isHydrated,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
