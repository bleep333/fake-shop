'use client'

import Link from 'next/link'
import PlaceholderImage from '@/components/PlaceholderImage'
import { useCart } from '@/lib/cartContext'

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart()

  // Price includes tax, so we need to extract tax for display
  // Tax = price / 11
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity) / 11, 0)
  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal + shipping

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link
            href="/mens"
            className="inline-block bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div key={`${item.product.id}-${index}`} className="flex gap-4 border-b border-gray-200 pb-4">
                <div className="relative w-24 h-32 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  <PlaceholderImage seed={item.product.id} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{item.product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">Size: {item.size}</p>
                  <p className="font-semibold mb-4">${item.product.price.toFixed(2)}</p>
                  
                  <div className="flex items-center gap-4">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-black"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="px-4 py-1 min-w-[3rem] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-black"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-sm text-gray-600 hover:text-black transition-colors underline focus:outline-none focus:ring-2 focus:ring-black rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Including ${tax.toFixed(2)} in taxes
                  </p>
                </div>
              </div>
              <Link
                href="/checkout"
                className="block w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors mb-4 text-center focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                Checkout
              </Link>
              <Link
                href="/mens"
                className="block text-center text-sm text-gray-600 hover:text-black transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
