'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ProfilePage() {
  // Mock authentication state
  const [isLoggedIn] = useState(false)

  if (!isLoggedIn) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto text-center py-12">
          <h1 className="text-4xl font-bold mb-4">Sign In</h1>
          <p className="text-gray-600 mb-8">
            Sign in to view your profile, orders, and manage your account.
          </p>
          <button
            className="bg-black text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Sign In
          </button>
          <p className="mt-4 text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="#" className="underline hover:text-black">
              Sign up
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="john.doe@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <button
                className="bg-black text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  defaultValue="123 Main St"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    defaultValue="New York"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    defaultValue="10001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
              <button
                className="bg-black text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                Update Address
              </button>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            <div className="text-center py-8 text-gray-600">
              <p className="mb-4">No orders yet</p>
              <Link
                href="/mens"
                className="text-sm underline hover:text-black"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
