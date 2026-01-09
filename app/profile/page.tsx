'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Order = {
  id: string
  orderNumber: string
  orderDate: string
  total: number
  status?: string
}

type ProfileInfo = {
  name: string
  email: string
  phone: string
}

type AddressInfo = {
  street: string
  city: string
  zipCode: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  
  // Profile info state
  const [originalProfile, setOriginalProfile] = useState<ProfileInfo>({ name: '', email: '', phone: '' })
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({ name: '', email: '', phone: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  
  // Address state
  const [originalAddress, setOriginalAddress] = useState<AddressInfo>({ street: '', city: '', zipCode: '' })
  const [addressInfo, setAddressInfo] = useState<AddressInfo>({ street: '', city: '', zipCode: '' })
  const [savingAddress, setSavingAddress] = useState(false)

  // Load profile and address data
  useEffect(() => {
    async function loadProfile() {
      if (session?.user) {
        const email = session.user.email || ''
        
        // Try to load from database first
        try {
          const response = await fetch('/api/user/profile')
          if (response.ok) {
            const data = await response.json()
            const dbName = data.user?.name || session.user.name || ''
            
            // Load phone and address from localStorage
            const phone = localStorage.getItem('user_phone') || '+61 412 345 678'
            const addressStr = localStorage.getItem('user_address')
            const address: AddressInfo = addressStr 
              ? JSON.parse(addressStr)
              : { street: '123 Main St', city: 'Sydney', zipCode: '2000' }
            
            const initialProfile = { name: dbName, email, phone }
            setOriginalProfile(initialProfile)
            setProfileInfo(initialProfile)
            
            setOriginalAddress(address)
            setAddressInfo(address)
            return
          }
        } catch (error) {
          console.error('Failed to load profile from database:', error)
        }
        
        // Fallback to session data if API fails
        const name = session.user.name || ''
        const phone = localStorage.getItem('user_phone') || '+61 412 345 678'
        const addressStr = localStorage.getItem('user_address')
        const address: AddressInfo = addressStr 
          ? JSON.parse(addressStr)
          : { street: '123 Main St', city: 'Sydney', zipCode: '2000' }
        
        const initialProfile = { name, email, phone }
        setOriginalProfile(initialProfile)
        setProfileInfo(initialProfile)
        
        setOriginalAddress(address)
        setAddressInfo(address)
      }
    }
    loadProfile()
  }, [session])

  useEffect(() => {
    if (session?.user?.id) {
      fetchOrders()
    }
  }, [session])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoadingOrders(false)
    }
  }

  // Check if profile has changes (excluding email since we don't allow email changes)
  const hasProfileChanges = 
    profileInfo.name !== originalProfile.name ||
    profileInfo.phone !== originalProfile.phone

  // Check if address has changes
  const hasAddressChanges =
    addressInfo.street !== originalAddress.street ||
    addressInfo.city !== originalAddress.city ||
    addressInfo.zipCode !== originalAddress.zipCode

  // Handle profile save
  const handleSaveProfile = async () => {
    if (!hasProfileChanges || savingProfile) return
    
    setSavingProfile(true)
    try {
      // Save name to database (email changes not supported to avoid session issues)
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileInfo.name
        })
      })
      
      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Failed to save profile')
        // Reset to original values on error
        setProfileInfo({ ...originalProfile })
        return
      }
      
      // Save phone to localStorage
      localStorage.setItem('user_phone', profileInfo.phone)
      
      // Reload profile from database to get the updated name
      const refreshResponse = await fetch('/api/user/profile')
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json()
        const updatedName = refreshData.user?.name || profileInfo.name
        
        // Update original values with the actual database values
        setOriginalProfile({ 
          name: updatedName,
          email: originalProfile.email, // Keep original email
          phone: profileInfo.phone 
        })
        setProfileInfo({
          name: updatedName,
          email: originalProfile.email,
          phone: profileInfo.phone
        })
      } else {
        // Fallback: just update original values if refresh fails
        setOriginalProfile({ 
          name: profileInfo.name,
          email: originalProfile.email,
          phone: profileInfo.phone 
        })
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
      alert('Failed to save profile')
      // Reset to original values on error
      setProfileInfo({ ...originalProfile })
    } finally {
      setSavingProfile(false)
    }
  }

  // Handle address save
  const handleSaveAddress = async () => {
    if (!hasAddressChanges || savingAddress) return
    
    setSavingAddress(true)
    try {
      // Save address to localStorage
      localStorage.setItem('user_address', JSON.stringify(addressInfo))
      
      // Update original values
      setOriginalAddress({ ...addressInfo })
    } catch (error) {
      console.error('Failed to save address:', error)
      alert('Failed to save address')
    } finally {
      setSavingAddress(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto text-center py-12">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto text-center py-12">
          <h1 className="text-4xl font-bold mb-4">Sign In</h1>
          <p className="text-gray-600 mb-8">
            Sign in to view your profile, orders, and manage your account.
          </p>
          <Link
            href="/auth/signin"
            className="inline-block bg-black text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Sign In
          </Link>
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
                  value={profileInfo.name}
                  onChange={(e) => setProfileInfo({ ...profileInfo, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profileInfo.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                  title="Email cannot be changed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profileInfo.phone}
                  onChange={(e) => setProfileInfo({ ...profileInfo, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={!hasProfileChanges || savingProfile}
                className={`px-6 py-2 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                  hasProfileChanges && !savingProfile
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {savingProfile ? 'Saving...' : 'Save Changes'}
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
                  value={addressInfo.street}
                  onChange={(e) => setAddressInfo({ ...addressInfo, street: e.target.value })}
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
                    value={addressInfo.city}
                    onChange={(e) => setAddressInfo({ ...addressInfo, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={addressInfo.zipCode}
                    onChange={(e) => setAddressInfo({ ...addressInfo, zipCode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveAddress}
                disabled={!hasAddressChanges || savingAddress}
                className={`px-6 py-2 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                  hasAddressChanges && !savingAddress
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {savingAddress ? 'Saving...' : 'Update Address'}
              </button>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Past Orders</h2>
              {orders.length > 0 && (
                <Link
                  href="/orders"
                  className="text-sm text-gray-600 hover:text-black underline"
                >
                  View All
                </Link>
              )}
            </div>
            {loadingOrders ? (
              <div className="text-center py-8 text-gray-600">
                <p>Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <p className="mb-4">No orders yet</p>
                <Link
                  href="/mens"
                  className="text-sm underline hover:text-black"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  const orderDate = new Date(order.orderDate)
                  const formattedDate = orderDate.toLocaleDateString('en-AU', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                  
                  return (
                    <Link
                      key={order.id}
                      href={`/orders/${order.id}`}
                      className="block p-4 border border-gray-200 rounded-md hover:border-gray-400 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-sm">{order.orderNumber}</p>
                          <p className="text-xs text-gray-600">{formattedDate}</p>
                        </div>
                        <p className="font-semibold">${order.total.toFixed(2)}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
