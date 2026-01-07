'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import PlaceholderImage from '@/components/PlaceholderImage'
import { useSession } from 'next-auth/react'

type OrderItem = {
  id: string
  productData: {
    id: string
    name: string
    image: string
  }
  quantity: number
  size: string
  price: number
}

type Order = {
  id: string
  orderNumber: string
  orderDate: string
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
  paymentMethod: string
  subtotal: number
  shipping: number
  tax: number
  total: number
  items: OrderItem[]
}

function OrderItemImage({ product }: { product: OrderItem['productData'] }) {
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

export default function OrderSummaryPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useSession()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const orderId = params?.orderId as string

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId, session, status, router])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
      } else if (response.status === 404) {
        router.push('/profile')
      } else {
        router.push('/profile')
      }
    } catch (error) {
      console.error('Failed to fetch order:', error)
      router.push('/profile')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Order not found</p>
          <Link
            href="/profile"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Back to Profile
          </Link>
        </div>
      </div>
    )
  }

  const orderDate = new Date(order.orderDate)
  const formattedDate = orderDate.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const fullAddress = `${order.customerDetails.address}, ${order.customerDetails.city}, ${order.customerDetails.state} ${order.customerDetails.postcode}, ${order.customerDetails.country}`

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/profile"
          className="text-gray-600 hover:text-black transition-colors inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Profile
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Order Summary</h1>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Customer details */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
          <div className="space-y-2 text-gray-700 mb-8">
            <div>
              <span className="font-medium">Name: </span>
              <span>{order.customerDetails.firstName} {order.customerDetails.lastName}</span>
            </div>
            <div>
              <span className="font-medium">Address: </span>
              <span>{fullAddress}</span>
            </div>
            <div>
              <span className="font-medium">Phone: </span>
              <span>{order.customerDetails.phone}</span>
            </div>
            <div>
              <span className="font-medium">Email: </span>
              <span>{order.customerDetails.email}</span>
            </div>
          </div>

          {/* Order Info */}
          <div className="space-y-2 text-gray-700">
            <h2 className="text-xl font-semibold mb-4">Order Information</h2>
            <div>
              <span className="font-medium">Order Number: </span>
              <span>{order.orderNumber}</span>
            </div>
            <div>
              <span className="font-medium">Date: </span>
              <span>{formattedDate}</span>
            </div>
            <div>
              <span className="font-medium">Payment Method: </span>
              <span className="capitalize">
                {order.paymentMethod === 'credit-card' ? 'Credit Card' : 'PayPal'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            
            {/* Purchased Items */}
            <div className="space-y-4 mb-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <OrderItemImage product={item.productData} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{item.productData.name}</h3>
                    <p className="text-xs text-gray-600 mb-1">Size: {item.size}</p>
                    <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Cost */}
            <div className="space-y-2 pt-4 border-t border-gray-300">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Including ${order.tax.toFixed(2)} in taxes
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
          className="inline-block bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
