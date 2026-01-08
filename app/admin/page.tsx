'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'

type Product = {
  id: string
  name: string
  price: number
  category: string
  gender: string
  sizes: string[]
  stockBySize: Record<string, number> | null
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingStock, setEditingStock] = useState<{ [productId: string]: Record<string, number> }>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [loginCredentials, setLoginCredentials] = useState({ email: 'admin', password: 'admin' })
  const [sortColumn, setSortColumn] = useState<'name' | 'category' | 'gender' | 'price' | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      // Not logged in, show login form
      setLoading(false)
      return
    }

    // Check if user is admin
    const isAdmin = (session.user as any)?.isAdmin === true
    if (!isAdmin) {
      router.push('/')
      return
    }

    // User is admin, fetch products
    fetchProducts()
  }, [session, status, router])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        // Initialize editing stock with current stockBySize values
        const stockMap: { [productId: string]: Record<string, number> } = {}
        data.products.forEach((p: Product) => {
          stockMap[p.id] = p.stockBySize || {}
          // Initialize with zeros for all sizes if stockBySize is null
          if (!p.stockBySize && p.sizes) {
            stockMap[p.id] = {}
            p.sizes.forEach(size => {
              stockMap[p.id][size] = 0
            })
          }
        })
        setEditingStock(stockMap)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStockChange = (productId: string, size: string, value: string) => {
    const numValue = parseInt(value, 10)
    if (!isNaN(numValue) && numValue >= 0) {
      setEditingStock(prev => ({
        ...prev,
        [productId]: {
          ...(prev[productId] || {}),
          [size]: numValue
        }
      }))
    }
  }

  const handleSaveStock = async (productId: string) => {
    const newStockBySize = editingStock[productId]
    if (!newStockBySize) return

    setSaving(productId)
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stockBySize: newStockBySize }),
      })

      if (response.ok) {
        const data = await response.json()
        // Update the product in the list
        setProducts(prev =>
          prev.map(p => p.id === productId ? { ...p, stockBySize: data.product.stockBySize } : p)
        )
        // Update editing stock to match saved values
        setEditingStock(prev => ({
          ...prev,
          [productId]: data.product.stockBySize || {}
        }))
        alert('Stock updated successfully!')
      } else {
        const error = await response.json()
        alert(`Failed to update stock: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating stock:', error)
      alert('Failed to update stock. Please try again.')
    } finally {
      setSaving(null)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await signIn('credentials', {
      email: loginCredentials.email,
      password: loginCredentials.password,
      redirect: false,
    })

    if (result?.error) {
      alert('Invalid credentials')
    } else {
      // Refetch products after login
      fetchProducts()
    }
  }

  const hasChanges = (productId: string): boolean => {
    const product = products.find(p => p.id === productId)
    if (!product) return false
    
    const currentStock = product.stockBySize || {}
    const editingStockForProduct = editingStock[productId] || {}
    
    return JSON.stringify(currentStock) !== JSON.stringify(editingStockForProduct)
  }

  const handleSort = (column: 'name' | 'category' | 'gender' | 'price') => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new column and default to ascending
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const getSortedProducts = (): Product[] => {
    if (!sortColumn) return products

    const sorted = [...products].sort((a, b) => {
      let comparison = 0

      switch (sortColumn) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'category':
          comparison = a.category.localeCompare(b.category)
          break
        case 'gender':
          comparison = a.gender.localeCompare(b.gender)
          break
        case 'price':
          comparison = a.price - b.price
          break
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })

    return sorted
  }

  const SortIcon = ({ column }: { column: 'name' | 'category' | 'gender' | 'price' }) => {
    if (sortColumn !== column) {
      return (
        <svg className="w-4 h-4 text-gray-400 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )
    }
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-black inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-black inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    )
  }

  if (status === 'loading' || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Username/Email
              </label>
              <input
                type="text"
                id="email"
                value={loginCredentials.email}
                onChange={(e) => setLoginCredentials(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={loginCredentials.password}
                onChange={(e) => setLoginCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  const isAdmin = (session.user as any)?.isAdmin === true
  if (!isAdmin) {
    return null // Will redirect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin - Product Stock Management</h1>
        <button
          onClick={() => router.push('/')}
          className="text-gray-600 hover:text-black transition-colors"
        >
          Back to Shop
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('name')}
                >
                  <span className="flex items-center">
                    Product Name
                    <SortIcon column="name" />
                  </span>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('category')}
                >
                  <span className="flex items-center">
                    Category
                    <SortIcon column="category" />
                  </span>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('gender')}
                >
                  <span className="flex items-center">
                    Gender
                    <SortIcon column="gender" />
                  </span>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('price')}
                >
                  <span className="flex items-center">
                    Price
                    <SortIcon column="price" />
                  </span>
                </th>
                <th colSpan={5} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                  Stock by Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                  Actions
                </th>
              </tr>
              <tr>
                <th colSpan={4}></th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500">S</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500">M</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500">L</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500">XL</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-500">2XL</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getSortedProducts().map((product) => {
                const currentStock = product.stockBySize || {}
                const editingStockForProduct = editingStock[product.id] || {}
                const sizes = ['S', 'M', 'L', 'XL', '2XL']
                
                return (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {product.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${product.price.toFixed(2)}
                    </td>
                    {sizes.map((size) => {
                      const currentValue = currentStock[size] || 0
                      const editingValue = editingStockForProduct[size] ?? currentValue
                      
                      return (
                        <td key={size} className="px-2 py-4 whitespace-nowrap border-l border-gray-200">
                          <div className="text-center">
                            <div className="text-xs text-gray-400 mb-1">{currentValue}</div>
                            <input
                              type="number"
                              min="0"
                              value={editingValue}
                              onChange={(e) => handleStockChange(product.id, size, e.target.value)}
                              className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm text-center"
                            />
                          </div>
                        </td>
                      )
                    })}
                    <td className="px-6 py-4 whitespace-nowrap text-sm border-l border-gray-200">
                      <button
                        onClick={() => handleSaveStock(product.id)}
                        disabled={saving === product.id || !hasChanges(product.id)}
                        className="bg-black text-white px-4 py-1 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                      >
                        {saving === product.id ? 'Saving...' : 'Update'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 text-gray-600">
          <p>No products found.</p>
        </div>
      )}
    </div>
  )
}
