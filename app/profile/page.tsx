'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type ProfileInfo = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

type AddressInfo = {
  id?: string
  firstName: string
  lastName: string
  addressLine1: string
  addressLine2: string
  suburb: string
  state: string
  postcode: string
  country: string
  phone: string
  isDefault: boolean
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState<AddressInfo | null>(null)
  
  // Profile info state
  const [originalProfile, setOriginalProfile] = useState<ProfileInfo>({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '' 
  })
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '' 
  })
  const [savingProfile, setSavingProfile] = useState(false)
  
  // Addresses state
  const [addresses, setAddresses] = useState<AddressInfo[]>([])
  const [savingAddress, setSavingAddress] = useState(false)

  // Load profile and address data
  useEffect(() => {
    async function loadProfile() {
      if (session?.user) {
        const email = session.user.email || ''
        
        try {
          const response = await fetch('/api/user/profile')
          if (response.ok) {
            const data = await response.json()
            const dbName = data.user?.name || session.user.name || ''
            const nameParts = dbName.split(' ')
            const firstName = nameParts[0] || ''
            const lastName = nameParts.slice(1).join(' ') || ''
            
            const phone = data.user?.phone || ''
            
            const initialProfile = { 
              firstName, 
              lastName, 
              email, 
              phone 
            }
            setOriginalProfile(initialProfile)
            setProfileInfo(initialProfile)
            
            // Load addresses - parse existing address data
            const addressStreet = data.user?.addressStreet || ''
            const addressCity = data.user?.addressCity || ''
            const addressZipCode = data.user?.addressZipCode || ''
            const addressState = data.user?.addressState || ''
            
            if (addressStreet || addressCity || addressZipCode) {
              // Split street address into line 1 and line 2 if needed
              const streetParts = addressStreet.split(',').map((s: string) => s.trim())
              const addressLine1 = streetParts[0] || ''
              const addressLine2 = streetParts.slice(1).join(', ') || ''
              
              const address: AddressInfo = {
                id: 'default',
                firstName: firstName,
                lastName: lastName,
                addressLine1: addressLine1,
                addressLine2: addressLine2,
                suburb: addressCity,
                state: addressState || 'New South Wales',
                postcode: addressZipCode,
                country: 'Australia',
                phone: phone,
                isDefault: true
              }
              setAddresses([address])
            } else {
              setAddresses([])
            }
            return
          }
        } catch (error) {
          console.error('Failed to load profile from database:', error)
        }
        
        // Fallback to session data
        const name = session.user.name || ''
        const nameParts = name.split(' ')
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''
        
        const initialProfile = { 
          firstName, 
          lastName, 
          email, 
          phone: '' 
        }
        setOriginalProfile(initialProfile)
        setProfileInfo(initialProfile)
        setAddresses([])
      }
    }
    loadProfile()
  }, [session])

  // Check if profile has changes
  const hasProfileChanges = 
    profileInfo.firstName !== originalProfile.firstName ||
    profileInfo.lastName !== originalProfile.lastName ||
    profileInfo.phone !== originalProfile.phone

  // Handle profile save
  const handleSaveProfile = async () => {
    if (!hasProfileChanges || savingProfile) return
    
    setSavingProfile(true)
    try {
      const fullName = `${profileInfo.firstName} ${profileInfo.lastName}`.trim()
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          phone: profileInfo.phone
        })
      })
      
      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Failed to save profile')
        setProfileInfo({ ...originalProfile })
        return
      }
      
      const refreshResponse = await fetch('/api/user/profile')
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json()
        const updatedName = refreshData.user?.name || fullName
        const nameParts = updatedName.split(' ')
        const updatedFirstName = nameParts[0] || ''
        const updatedLastName = nameParts.slice(1).join(' ') || ''
        const updatedPhone = refreshData.user?.phone || profileInfo.phone
        
        setOriginalProfile({ 
          firstName: updatedFirstName,
          lastName: updatedLastName,
          email: originalProfile.email,
          phone: updatedPhone 
        })
        setProfileInfo({
          firstName: updatedFirstName,
          lastName: updatedLastName,
          email: originalProfile.email,
          phone: updatedPhone
        })
      }
      
      setShowEditModal(false)
    } catch (error) {
      console.error('Failed to save profile:', error)
      alert('Failed to save profile')
      setProfileInfo({ ...originalProfile })
    } finally {
      setSavingProfile(false)
    }
  }

  // Handle address save
  const handleSaveAddress = async () => {
    if (!editingAddress || savingAddress) return
    
    setSavingAddress(true)
    try {
      // If it's the default address, save to user profile
      if (editingAddress.isDefault) {
        // Combine address lines
        const fullStreet = editingAddress.addressLine2 
          ? `${editingAddress.addressLine1}, ${editingAddress.addressLine2}`
          : editingAddress.addressLine1
        
        const response = await fetch('/api/user/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            addressStreet: fullStreet,
            addressCity: editingAddress.suburb,
            addressZipCode: editingAddress.postcode,
            addressState: editingAddress.state,
            phone: editingAddress.phone
          })
        })
        
        if (!response.ok) {
          const error = await response.json()
          alert(error.error || 'Failed to save address')
          return
        }
        
        // Update addresses list
        const updatedAddresses = addresses.map(addr => 
          addr.isDefault ? { ...editingAddress, id: 'default' } : addr
        )
        if (updatedAddresses.length === 0) {
          setAddresses([{ ...editingAddress, id: 'default' }])
        } else {
          setAddresses(updatedAddresses)
        }
      }
      
      setShowAddressModal(false)
      setEditingAddress(null)
    } catch (error) {
      console.error('Failed to save address:', error)
      alert('Failed to save address')
    } finally {
      setSavingAddress(false)
    }
  }

  const openEditModal = () => {
    setShowEditModal(true)
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return
    
    if (addressId === 'default') {
      // Clear default address
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addressStreet: '',
          addressCity: '',
          addressZipCode: '',
          addressState: ''
        })
      })
      
      if (response.ok) {
        setAddresses([])
      }
    } else {
      // Remove non-default address
      setAddresses(addresses.filter(addr => addr.id !== addressId))
    }
  }

  const openAddressModal = (address?: AddressInfo) => {
    if (address) {
      setEditingAddress(address)
    } else {
      // New address
      const newAddress: AddressInfo = {
        firstName: profileInfo.firstName,
        lastName: profileInfo.lastName,
        addressLine1: '',
        addressLine2: '',
        suburb: '',
        state: 'New South Wales',
        postcode: '',
        country: 'Australia',
        phone: profileInfo.phone,
        isDefault: addresses.length === 0
      }
      setEditingAddress(newAddress)
    }
    setShowAddressModal(true)
  }

  // Check if user is admin - redirect to admin dashboard
  const isAdmin = (session?.user as any)?.isAdmin === true

  if (status === 'loading') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto text-center py-12">
          <p className="text-stone-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto text-center py-12">
          <h1 className="text-4xl font-bold mb-4">Sign In</h1>
          <p className="text-stone-600 mb-8">
            Sign in to view your profile, orders, and manage your account.
          </p>
          <Link
            href="/auth/signin"
            className="inline-block bg-black text-white px-8 py-3 rounded-md font-semibold hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  // Redirect admin users to admin dashboard
  if (isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto text-center py-12">
          <h1 className="text-4xl font-bold mb-4">Admin Account</h1>
          <p className="text-stone-600 mb-8">
            Admin accounts don&apos;t have access to user account features.
          </p>
          <Link
            href="/admin"
            className="inline-block bg-black text-white px-8 py-3 rounded-md font-semibold hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Go to Admin Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const fullName = `${profileInfo.firstName} ${profileInfo.lastName}`.trim() || 'User'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-black">Profile</h1>

      {/* User Information Card */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 md:p-8 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-stone-900">{fullName}</h2>
              <button
                onClick={openEditModal}
                className="p-1.5 hover:bg-stone-100 rounded transition-colors"
                aria-label="Edit profile"
              >
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
            <div className="mt-4">
              <p className="text-sm text-stone-500 mb-1">Email</p>
              <p className="text-stone-900">{profileInfo.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Addresses Card */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-stone-900">Addresses</h2>
          <button
            onClick={() => openAddressModal()}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            + Add
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-stone-600 mb-4">No addresses saved</p>
            <button
              onClick={() => openAddressModal()}
              className="text-blue-600 hover:text-blue-700 underline text-sm"
            >
              Add your first address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div key={address.id || 'default'} className="border border-stone-200 rounded-lg p-4 relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {address.isDefault && (
                      <p className="text-xs text-stone-500 mb-2">Default address</p>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-stone-900">
                        {address.firstName} {address.lastName}
                      </p>
                      <button
                        onClick={() => openAddressModal(address)}
                        className="p-1 hover:bg-stone-100 rounded transition-colors"
                        aria-label="Edit address"
                      >
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-stone-600 text-sm">{address.addressLine1}</p>
                    {address.addressLine2 && (
                      <p className="text-stone-600 text-sm">{address.addressLine2}</p>
                    )}
                    <p className="text-stone-600 text-sm">
                      {address.suburb} {address.state} {address.postcode}
                    </p>
                    <p className="text-stone-600 text-sm">{address.country}</p>
                    {address.phone && (
                      <p className="text-stone-600 text-sm mt-1">{address.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <h2 className="text-2xl font-bold mb-6">Edit profile</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        First name
                      </label>
                      <input
                        type="text"
                        value={profileInfo.firstName}
                        onChange={(e) => setProfileInfo({ ...profileInfo, firstName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Last name
                      </label>
                      <input
                        type="text"
                        value={profileInfo.lastName}
                        onChange={(e) => setProfileInfo({ ...profileInfo, lastName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileInfo.email}
                      disabled
                      className="w-full px-4 py-2.5 border border-stone-300 rounded-md bg-stone-50 text-stone-500 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-stone-500">
                      This email is used for sign-in and order updates.
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => {
                        setProfileInfo({ ...originalProfile })
                        setShowEditModal(false)
                      }}
                      className="px-6 py-2.5 border border-stone-300 rounded-md font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={!hasProfileChanges || savingProfile}
                      className={`px-6 py-2.5 rounded-md font-medium transition-colors ${
                        hasProfileChanges && !savingProfile
                          ? 'bg-black text-white hover:bg-stone-800'
                          : 'bg-stone-200 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      {savingProfile ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Address Modal */}
      <AnimatePresence>
        {showAddressModal && editingAddress && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowAddressModal(false)
                setEditingAddress(null)
              }}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ overflow: 'auto' }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowAddressModal(false)
                  setEditingAddress(null)
                }
              }}
            >
              <div 
                className="bg-white rounded-lg shadow-xl flex flex-col my-auto"
                style={{ 
                  width: 'min(920px, 92vw)',
                  maxWidth: '920px',
                  maxHeight: '90vh'
                }}
              >
                {/* Header - Always visible */}
                <div className="flex items-center justify-between p-6 border-b border-stone-200 flex-shrink-0">
                  <h2 className="text-2xl font-bold">
                    {editingAddress.id === 'default' ? 'Edit address' : 'Add address'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddressModal(false)
                      setEditingAddress(null)
                    }}
                    className="p-2 hover:bg-stone-100 rounded transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Form Content - Scrollable */}
                <div className="p-5 overflow-y-auto flex-1" style={{ minHeight: 0, maxHeight: 'calc(90vh - 140px)' }}>
                  <div className="space-y-4">
                    {/* Default Address Checkbox */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="defaultAddress"
                        checked={editingAddress.isDefault}
                        onChange={(e) => setEditingAddress({ ...editingAddress, isDefault: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-stone-300 rounded focus:ring-2 focus:ring-blue-600"
                      />
                      <label htmlFor="defaultAddress" className="ml-2 text-sm font-medium text-stone-700 cursor-pointer">
                        This is my default address
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Country/region - Full width */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Country/region
                        </label>
                        <select
                          value={editingAddress.country}
                          onChange={(e) => setEditingAddress({ ...editingAddress, country: e.target.value })}
                          className="w-full px-4 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                        >
                          <option value="Australia">Australia</option>
                          <option value="New Zealand">New Zealand</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                        </select>
                      </div>
                    
                    {/* First name and Last name - Side by side */}
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        First name
                      </label>
                      <input
                        type="text"
                        value={editingAddress.firstName}
                        onChange={(e) => setEditingAddress({ ...editingAddress, firstName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Last name
                      </label>
                      <input
                        type="text"
                        value={editingAddress.lastName}
                        onChange={(e) => setEditingAddress({ ...editingAddress, lastName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                      />
                    </div>
                    
                    </div>
                    
                    {/* Address Line 1 - Full width */}
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={editingAddress.addressLine1}
                        onChange={(e) => setEditingAddress({ ...editingAddress, addressLine1: e.target.value })}
                        className="w-full px-4 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                      />
                    </div>
                    
                    {/* Address Line 2 - Full width */}
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Apartment, suite, etc (optional)
                      </label>
                      <input
                        type="text"
                        value={editingAddress.addressLine2}
                        onChange={(e) => setEditingAddress({ ...editingAddress, addressLine2: e.target.value })}
                        className="w-full px-4 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                        placeholder="Optional"
                      />
                    </div>
                    
                    {/* Suburb, State, Postcode - 3 columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Suburb
                        </label>
                        <input
                          type="text"
                          value={editingAddress.suburb}
                          onChange={(e) => setEditingAddress({ ...editingAddress, suburb: e.target.value })}
                          className="w-full px-4 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          State/territory
                        </label>
                        <select
                          value={editingAddress.state}
                          onChange={(e) => setEditingAddress({ ...editingAddress, state: e.target.value })}
                          className="w-full px-4 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                        >
                          <option value="New South Wales">New South Wales</option>
                          <option value="Victoria">Victoria</option>
                          <option value="Queensland">Queensland</option>
                          <option value="Western Australia">Western Australia</option>
                          <option value="South Australia">South Australia</option>
                          <option value="Tasmania">Tasmania</option>
                          <option value="Australian Capital Territory">Australian Capital Territory</option>
                          <option value="Northern Territory">Northern Territory</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Postcode
                        </label>
                        <input
                          type="text"
                          value={editingAddress.postcode}
                          onChange={(e) => setEditingAddress({ ...editingAddress, postcode: e.target.value })}
                          className="w-full px-4 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                        />
                      </div>
                    </div>
                    
                    {/* Phone - Full width */}
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Phone
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="tel"
                          value={editingAddress.phone}
                          onChange={(e) => setEditingAddress({ ...editingAddress, phone: e.target.value })}
                          className="flex-1 px-4 py-2.5 border border-stone-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                          placeholder="+61"
                        />
                        <div className="flex items-center px-3 py-2.5 border border-stone-300 border-l-0 rounded-r-md bg-stone-50">
                          <span className="text-sm text-stone-700 mr-2">🇦🇺</span>
                          <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Footer - Sticky at bottom */}
                <div className="sticky bottom-0 bg-white border-t border-stone-200 p-5 pt-3 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    {editingAddress.id && (
                      <button
                        onClick={() => {
                          if (editingAddress.id) {
                            handleDeleteAddress(editingAddress.id)
                            setShowAddressModal(false)
                            setEditingAddress(null)
                          }
                        }}
                        className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
                      >
                        Delete
                      </button>
                    )}
                    <div className="flex gap-3 ml-auto">
                      <button
                        onClick={() => {
                          setShowAddressModal(false)
                          setEditingAddress(null)
                        }}
                        className="px-6 py-2.5 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveAddress}
                        disabled={savingAddress || !editingAddress.addressLine1 || !editingAddress.suburb || !editingAddress.postcode}
                        className={`px-6 py-2.5 rounded-md font-medium transition-colors ${
                          !savingAddress && editingAddress.addressLine1 && editingAddress.suburb && editingAddress.postcode
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-stone-200 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        {savingAddress ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
