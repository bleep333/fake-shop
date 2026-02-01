'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import PlaceholderImage from '@/components/PlaceholderImage'
import { CartItem } from '@/lib/cartContext'

type OrderData = {
  customerDetails: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    postcode: string
    country: string
  }
  paymentMethod: 'credit-card' | 'paypal'
  cartItems: CartItem[]
  orderNumber: string
  orderDate: string
  subtotal: number
  shipping: number
  tax: number
  total: number
}

function OrderItemImage({ product }: { product: CartItem['product'] }) {
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!product.image.startsWith('/images/products/')) return
    
    const extensions = ['.jpg', '.jpeg', '.png', '.webp']
    const basePath = product.image
    
    let currentIndex = 0
    const tryNext = () => {
      if (currentIndex >= extensions.length) {
        setImageError(true)
        return
      }
      
      const testImg = new window.Image()
      testImg.onload = () => {
        setImageSrc(`${basePath}${extensions[currentIndex]}`)
      }
      testImg.onerror = () => {
        currentIndex++
        tryNext()
      }
      testImg.src = `${basePath}${extensions[currentIndex]}`
    }
    
    tryNext()
  }, [product.image, product.id])

  return (
    <>
      {imageSrc && !imageError ? (
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <PlaceholderImage seed={product.id} />
      )}
    </>
  )
}

export default function OrderConfirmationPage() {
  const router = useRouter()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    // Small delay to ensure sessionStorage is available after navigation
    const timer = setTimeout(() => {
      // Retrieve order data from sessionStorage
      const storedOrderData = sessionStorage.getItem('order-confirmation-data')
      console.log('Order confirmation page loaded, stored data:', storedOrderData ? 'Found' : 'Not found')
      
      if (!storedOrderData) {
        // If no order data, redirect to home
        console.log('No order data found, redirecting to home')
        setIsLoading(false)
        router.push('/')
        return
      }

      try {
        const parsed = JSON.parse(storedOrderData) as OrderData
        
        // Validate that we have the required data
        if (!parsed.cartItems || parsed.cartItems.length === 0) {
          throw new Error('Invalid order data: no cart items')
        }
        
        setOrderData(parsed)
        setIsLoading(false)
        // Clear the stored order data after reading
        sessionStorage.removeItem('order-confirmation-data')
      } catch (error) {
        console.error('Failed to parse order data:', error)
        setIsLoading(false)
        router.push('/')
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [router])

  if (isLoading || !orderData) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-stone-600">Loading order confirmation...</p>
        </div>
      </div>
    )
  }

  const { customerDetails, paymentMethod, cartItems, orderNumber, orderDate, subtotal, shipping, tax, total } = orderData
  const fullAddress = `${customerDetails.address}, ${customerDetails.city}, ${customerDetails.state} ${customerDetails.postcode}, ${customerDetails.country}`

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Banner */}
      <div className="bg-green-600 text-white px-6 py-4 rounded-md mb-8">
        <p className="font-semibold">Order submitted successfully!</p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Thank you message and customer details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">Thank you for your purchase!</h1>
          <p className="text-stone-700 mb-8">
            Your order will be processed shortly. An email confirmation has been sent to the provided email address.
          </p>

          {/* Customer Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
            <div className="space-y-2 text-stone-700">
              <div>
                <span className="font-medium">Name: </span>
                <span>{customerDetails.firstName} {customerDetails.lastName}</span>
              </div>
              <div>
                <span className="font-medium">Address: </span>
                <span>{fullAddress}</span>
              </div>
              <div>
                <span className="font-medium">Phone: </span>
                <span>{customerDetails.phone}</span>
              </div>
              <div>
                <span className="font-medium">Email: </span>
                <span>{customerDetails.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <div className="bg-stone-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {/* Top row: Date | Order Number | Payment Method */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 pb-4 border-b border-stone-300">
              <div>
                <p className="text-sm text-stone-600 mb-1">Date</p>
                <p className="font-medium">{orderDate}</p>
              </div>
              <div>
                <p className="text-sm text-stone-600 mb-1">Order Number</p>
                <p className="font-medium">{orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-stone-600 mb-1">Payment Method</p>
                <p className="font-medium capitalize">
                  {paymentMethod === 'credit-card' ? 'Credit Card' : 'PayPal'}
                </p>
              </div>
            </div>

            {/* Purchased Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => (
                <div key={`${item.product.id}-${index}`} className="flex gap-4">
                  <div className="relative w-20 h-24 bg-stone-100 rounded-md overflow-hidden flex-shrink-0">
                    <OrderItemImage product={item.product} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{item.product.name}</h3>
                    <p className="text-xs text-stone-600 mb-1">Size: {item.size}</p>
                    <p className="text-xs text-stone-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      ${((item.product.salePrice || item.product.basePrice) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Cost */}
            <div className="space-y-2 pt-4 border-t border-stone-300">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t border-stone-300 pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Including ${tax.toFixed(2)} in taxes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Shopping Link */}
      <div className="mt-8 text-center">
        <Link
          href="/mens"
          className="inline-block bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
