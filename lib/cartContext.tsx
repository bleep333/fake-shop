'use client'

import { createContext, useContext, useReducer, useEffect, useRef, useCallback, useState, ReactNode } from 'react'
import { Product } from './mockProducts'

export type CartItem = {
  product: Product
  quantity: number
  size: string
}

type CartContextType = {
  cartItems: CartItem[]
  addToCart: (product: Product, size?: string) => void
  removeFromCart: (index: number) => void
  updateQuantity: (index: number, quantity: number) => void
  clearCart: () => void
  getCartCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'fake-shop-cart'

type CartAction =
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'ADD_TO_CART'; payload: { product: Product; size: string } }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { index: number; quantity: number } }
  | { type: 'CLEAR_CART' }

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'LOAD_CART':
      return action.payload
    
    case 'ADD_TO_CART': {
      const { product, size } = action.payload
      const existingIndex = state.findIndex(
        (item) => item.product.id === product.id && item.size === size
      )

      if (existingIndex >= 0) {
        const updated = [...state]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        }
        return updated
      } else {
        return [...state, { product, quantity: 1, size }]
      }
    }
    
    case 'REMOVE_FROM_CART':
      return state.filter((_, i) => i !== action.payload)
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity < 1) return state
      const updated = [...state]
      updated[action.payload.index] = {
        ...updated[action.payload.index],
        quantity: action.payload.quantity
      }
      return updated
    }
    
    case 'CLEAR_CART':
      return []
    
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, dispatch] = useReducer(cartReducer, [])
  const [isHydrated, setIsHydrated] = useState(false)
  const lastAddRef = useRef<{ key: string; timestamp: number } | null>(null)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) })
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error)
      }
    }
  }, [cartItems, isHydrated])

  const addToCart = useCallback((product: Product, size: string = 'M') => {
    const addKey = `${product.id}-${size}`
    const now = Date.now()
    
    // Prevent duplicate calls within 500ms (handles React Strict Mode double-invocation)
    if (lastAddRef.current?.key === addKey && now - lastAddRef.current.timestamp < 500) {
      return
    }
    
    lastAddRef.current = { key: addKey, timestamp: now }
    
    dispatch({ type: 'ADD_TO_CART', payload: { product, size } })
  }, [])

  const removeFromCart = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: index })
  }, [])

  const updateQuantity = useCallback((index: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { index, quantity } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const getCartCount = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }, [cartItems])

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
