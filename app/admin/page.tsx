'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'

type Product = {
  id: string
  sku?: string | null
  name: string
  basePrice: number
  salePrice?: number | null
  category: string
  gender: string
  color?: string | null
  image: string
  tags: string[]
  sizes: string[]
  stockBySize: Record<string, number> | null
  status: string
  isVisible: boolean
  lowStockThreshold: number
}

type TabType = 'stock' | 'products' | 'orders' | 'users' | 'analytics' | 'promotions'

type OrderItem = {
  id: string
  productData: any
  quantity: number
  size: string
  price: number
}

type Order = {
  id: string
  orderNumber: string
  orderDate: string
  status: string
  customerDetails: any
  paymentMethod: string
  subtotal: number
  shipping: number
  tax: number
  total: number
  items: OrderItem[]
  user?: {
    id: string
    name: string | null
    email: string | null
  }
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('stock')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingStock, setEditingStock] = useState<{ [productId: string]: Record<string, number> }>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [loginCredentials, setLoginCredentials] = useState({ email: 'admin', password: 'admin' })
  const [sortColumn, setSortColumn] = useState<'sku' | 'name' | 'category' | 'gender' | 'price' | 'salePrice' | 'status' | 'isVisible' | 'stock' | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  
  // Product Management state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showProductModal, setShowProductModal] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkAction, setBulkAction] = useState<'price' | 'stock' | null>(null)

  // Order Management state
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetail, setShowOrderDetail] = useState(false)
  const [orderFilters, setOrderFilters] = useState({
    status: '',
    userId: '',
    startDate: '',
    endDate: '',
    search: ''
  })
  const [orderSortColumn, setOrderSortColumn] = useState<'orderNumber' | 'orderDate' | 'customer' | 'status' | 'total' | null>(null)
  const [orderSortDirection, setOrderSortDirection] = useState<'asc' | 'desc'>('desc')

  // User Management state
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [showUserDetail, setShowUserDetail] = useState(false)
  const [userSearch, setUserSearch] = useState('')

  // Analytics state
  const [analytics, setAnalytics] = useState<any>(null)
  const [analyticsDays, setAnalyticsDays] = useState(30)

  // Promotions state
  const [promoCodes, setPromoCodes] = useState<any[]>([])
  const [announcementBar, setAnnouncementBar] = useState<any>(null)
  const [showPromoCodeModal, setShowPromoCodeModal] = useState(false)
  const [editingPromoCode, setEditingPromoCode] = useState<any>(null)
  const [savingAnnouncement, setSavingAnnouncement] = useState(false)

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        const stockMap: { [productId: string]: Record<string, number> } = {}
        data.products.forEach((p: Product) => {
          stockMap[p.id] = p.stockBySize || {}
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
  }, [])

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
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockBySize: newStockBySize }),
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, stockBySize: data.product.stockBySize } : p))
        setEditingStock(prev => ({ ...prev, [productId]: data.product.stockBySize || {} }))
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

  const handleSort = (column: 'sku' | 'name' | 'category' | 'gender' | 'price' | 'salePrice' | 'status' | 'isVisible' | 'stock') => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const getSortedProducts = (): Product[] => {
    if (!sortColumn) return products

    const sorted = [...products].sort((a, b) => {
      let comparison = 0
      switch (sortColumn) {
        case 'sku':
          comparison = (a.sku || '').localeCompare(b.sku || '')
          break
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
          const aPrice = a.salePrice || a.basePrice
          const bPrice = b.salePrice || b.basePrice
          comparison = aPrice - bPrice
          break
        case 'salePrice':
          const aSalePrice = a.salePrice || 0
          const bSalePrice = b.salePrice || 0
          comparison = aSalePrice - bSalePrice
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
        case 'isVisible':
          comparison = (a.isVisible === b.isVisible) ? 0 : (a.isVisible ? 1 : -1)
          break
        case 'stock':
          const aStock = a.stockBySize ? Object.values(a.stockBySize).reduce((sum, val) => sum + val, 0) : 0
          const bStock = b.stockBySize ? Object.values(b.stockBySize).reduce((sum, val) => sum + val, 0) : 0
          comparison = aStock - bStock
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })
    return sorted
  }

  // Product Management Functions
  const handleCreateProduct = () => {
    setEditingProduct(null)
    setShowProductModal(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowProductModal(true)
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId))
        alert('Product deleted successfully!')
      } else {
        const error = await response.json()
        alert(`Failed to delete product: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product. Please try again.')
    }
  }

  const handleSaveProduct = async (productData: any) => {
    try {
      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products'
      const method = editingProduct ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        const data = await response.json()
        if (editingProduct) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? data.product : p))
        } else {
          setProducts(prev => [...prev, data.product])
        }
        setShowProductModal(false)
        setEditingProduct(null)
        fetchProducts() // Refresh to get all data
        alert(`Product ${editingProduct ? 'updated' : 'created'} successfully!`)
      } else {
        const error = await response.json()
        alert(`Failed to save product: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to save product. Please try again.')
    }
  }

  const handleBulkAction = async (actionData: any) => {
    if (selectedProducts.size === 0) {
      alert('Please select at least one product')
      return
    }

    try {
      if (bulkAction === 'price') {
        const response = await fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productIds: Array.from(selectedProducts),
            updates: {
              basePrice: actionData.basePrice ? parseFloat(actionData.basePrice) : undefined,
              salePrice: actionData.salePrice ? parseFloat(actionData.salePrice) : undefined,
              status: actionData.status || undefined,
              isVisible: actionData.isVisible !== undefined ? actionData.isVisible : undefined,
            }
          }),
        })

        if (response.ok) {
          alert(`Updated ${selectedProducts.size} product(s)`)
          setSelectedProducts(new Set())
          setShowBulkModal(false)
          fetchProducts()
        } else {
          const error = await response.json()
          alert(`Failed to update products: ${error.error || 'Unknown error'}`)
        }
      } else if (bulkAction === 'stock') {
        const updates = Array.from(selectedProducts).map(productId => ({
          productId,
          stockBySize: actionData.stockBySize
        }))

        const response = await fetch('/api/admin/products/bulk-stock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ updates }),
        })

        if (response.ok) {
          alert(`Updated stock for ${selectedProducts.size} product(s)`)
          setSelectedProducts(new Set())
          setShowBulkModal(false)
          fetchProducts()
        } else {
          const error = await response.json()
          alert(`Failed to update stock: ${error.error || 'Unknown error'}`)
        }
      }
    } catch (error) {
      console.error('Error performing bulk action:', error)
      alert('Failed to perform bulk action. Please try again.')
    }
  }

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  const toggleAllProducts = () => {
    if (selectedProducts.size === getSortedProducts().length) {
      setSelectedProducts(new Set())
    } else {
      setSelectedProducts(new Set(getSortedProducts().map(p => p.id)))
    }
  }

  const getDiscountPercent = (basePrice: number, salePrice?: number | null): number | null => {
    if (salePrice && salePrice < basePrice) {
      return Math.round(((basePrice - salePrice) / basePrice) * 100)
    }
    return null
  }

  // Order Management Functions
  const fetchOrders = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (orderFilters.status) params.append('status', orderFilters.status)
      if (orderFilters.userId) params.append('userId', orderFilters.userId)
      if (orderFilters.startDate) params.append('startDate', orderFilters.startDate)
      if (orderFilters.endDate) params.append('endDate', orderFilters.endDate)
      if (orderFilters.search) params.append('search', orderFilters.search)

      const response = await fetch(`/api/admin/orders?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    }
  }, [orderFilters])

  const handleOrderSort = (column: 'orderNumber' | 'orderDate' | 'customer' | 'status' | 'total') => {
    if (orderSortColumn === column) {
      setOrderSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setOrderSortColumn(column)
      setOrderSortDirection('asc')
    }
  }

  const getSortedOrders = (): Order[] => {
    if (!orderSortColumn) return orders

    const sorted = [...orders].sort((a, b) => {
      let comparison = 0

      switch (orderSortColumn) {
        case 'orderNumber':
          comparison = a.orderNumber.localeCompare(b.orderNumber)
          break
        case 'orderDate':
          comparison = new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
          break
        case 'customer':
          const aCustomer = (a.customerDetails as any)?.firstName && (a.customerDetails as any)?.lastName
            ? `${(a.customerDetails as any).firstName} ${(a.customerDetails as any).lastName}`
            : a.user?.name || a.user?.email || ''
          const bCustomer = (b.customerDetails as any)?.firstName && (b.customerDetails as any)?.lastName
            ? `${(b.customerDetails as any).firstName} ${(b.customerDetails as any).lastName}`
            : b.user?.name || b.user?.email || ''
          comparison = aCustomer.localeCompare(bCustomer)
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
        case 'total':
          comparison = a.total - b.total
          break
      }

      return orderSortDirection === 'asc' ? comparison : -comparison
    })

    return sorted
  }

  const OrderSortIcon = ({ column }: { column: 'orderNumber' | 'orderDate' | 'customer' | 'status' | 'total' }) => {
    if (orderSortColumn !== column) {
      return (
        <svg className="w-4 h-4 text-gray-400 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )
    }
    return orderSortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-black inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-black inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    )
  }

  const handleViewOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedOrder(data.order)
        setShowOrderDetail(true)
      }
    } catch (error) {
      console.error('Failed to fetch order:', error)
      alert('Failed to load order details')
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(prev => prev.map(o => o.id === orderId ? data.order : o))
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(data.order)
        }
        alert('Order status updated successfully!')
      } else {
        const error = await response.json()
        alert(`Failed to update order: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Failed to update order. Please try again.')
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return
    await handleUpdateOrderStatus(orderId, 'cancelled')
  }

  const handleIssueRefund = async (orderId: string) => {
    if (!confirm('Issue refund for this order? (This is a mocked action)')) return
    await handleUpdateOrderStatus(orderId, 'refunded')
    alert('Refund issued (mocked)')
  }

  const handleDownloadInvoice = () => {
    // Placeholder for PDF generation
    alert('Invoice download feature coming soon (PDF generation)')
  }

  // User Management Functions
  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (userSearch) params.append('search', userSearch)

      const response = await fetch(`/api/admin/users?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }, [userSearch])

  const handleViewUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedUser(data.user)
        setShowUserDetail(true)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      alert('Failed to load user details')
    }
  }

  const handleUpdateUser = async (userId: string, updates: { isAdmin?: boolean; isDisabled?: boolean }) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(prev => prev.map(u => u.id === userId ? data.user : u))
        if (selectedUser?.id === userId) {
          setSelectedUser(data.user)
        }
        alert('User updated successfully!')
        fetchUsers() // Refresh list
      } else {
        const error = await response.json()
        alert(`Failed to update user: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Failed to update user. Please try again.')
    }
  }

  const handlePromoteToAdmin = async (userId: string) => {
    if (!confirm('Are you sure you want to promote this user to admin? This will give them full access to the admin dashboard.')) return
    await handleUpdateUser(userId, { isAdmin: true })
  }

  const handleDisableUser = async (userId: string) => {
    if (!confirm('Are you sure you want to disable/ban this user? They will not be able to log in.')) return
    await handleUpdateUser(userId, { isDisabled: true })
  }

  const handleEnableUser = async (userId: string) => {
    await handleUpdateUser(userId, { isDisabled: false })
  }

  // Analytics Functions
  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/analytics?days=${analyticsDays}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    }
  }, [analyticsDays])

  // Promotions Functions
  const fetchPromoCodes = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/promotions/promo-codes')
      if (response.ok) {
        const data = await response.json()
        setPromoCodes(data.promoCodes || [])
      }
    } catch (error) {
      console.error('Failed to fetch promo codes:', error)
    }
  }, [])

  const fetchAnnouncementBar = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/promotions/announcement')
      if (response.ok) {
        const data = await response.json()
        setAnnouncementBar(data.announcementBar)
      }
    } catch (error) {
      console.error('Failed to fetch announcement bar:', error)
    }
  }, [])

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      setLoading(false)
      return
    }

    const isAdmin = (session.user as any)?.isAdmin === true
    if (!isAdmin) {
      router.push('/')
      return
    }

    fetchProducts()
    if (activeTab === 'orders') {
      fetchOrders()
    }
    if (activeTab === 'users') {
      fetchUsers()
    }
    if (activeTab === 'analytics') {
      fetchAnalytics()
    }
    if (activeTab === 'promotions') {
      fetchPromoCodes()
      fetchAnnouncementBar()
    }
  }, [session, status, router, activeTab, analyticsDays, fetchProducts, fetchOrders, fetchUsers, fetchAnalytics, fetchPromoCodes, fetchAnnouncementBar])

  const handleSaveAnnouncement = async (text: string, isActive: boolean) => {
    setSavingAnnouncement(true)
    try {
      const response = await fetch('/api/admin/promotions/announcement', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, isActive }),
      })

      if (response.ok) {
        const data = await response.json()
        setAnnouncementBar(data.announcementBar)
        alert('Announcement bar updated successfully!')
      } else {
        const error = await response.json()
        alert(`Failed to update announcement bar: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating announcement bar:', error)
      alert('Failed to update announcement bar. Please try again.')
    } finally {
      setSavingAnnouncement(false)
    }
  }

  const handleSavePromoCode = async (promoCodeData: any) => {
    try {
      const url = editingPromoCode
        ? `/api/admin/promotions/promo-codes/${editingPromoCode.id}`
        : '/api/admin/promotions/promo-codes'
      const method = editingPromoCode ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promoCodeData),
      })

      if (response.ok) {
        setShowPromoCodeModal(false)
        setEditingPromoCode(null)
        fetchPromoCodes()
        alert(`Promo code ${editingPromoCode ? 'updated' : 'created'} successfully!`)
      } else {
        const error = await response.json()
        alert(`Failed to save promo code: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving promo code:', error)
      alert('Failed to save promo code. Please try again.')
    }
  }

  const handleDeletePromoCode = async (promoCodeId: string) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return

    try {
      const response = await fetch(`/api/admin/promotions/promo-codes/${promoCodeId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPromoCodes()
        alert('Promo code deleted successfully!')
      } else {
        const error = await response.json()
        alert(`Failed to delete promo code: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting promo code:', error)
      alert('Failed to delete promo code. Please try again.')
    }
  }

  const SortIcon = ({ column }: { column: 'sku' | 'name' | 'category' | 'gender' | 'price' | 'salePrice' | 'status' | 'isVisible' | 'stock' }) => {
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
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => router.push('/')}
          className="text-gray-600 hover:text-black transition-colors"
        >
          Back to Shop
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('stock')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stock'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Stock Management
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'products'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Product Management
          </button>
          <button
            onClick={() => { setActiveTab('orders'); fetchOrders(); }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Order Management
          </button>
          <button
            onClick={() => { setActiveTab('users'); fetchUsers(); }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => { setActiveTab('analytics'); fetchAnalytics(); }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => { setActiveTab('promotions'); fetchPromoCodes(); fetchAnnouncementBar(); }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'promotions'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Promotions
          </button>
        </nav>
      </div>

      {/* Stock Management Tab */}
      {activeTab === 'stock' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none" onClick={() => handleSort('sku')}>
                    <span className="flex items-center">SKU <SortIcon column="sku" /></span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none" onClick={() => handleSort('name')}>
                    <span className="flex items-center">Product Name <SortIcon column="name" /></span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none" onClick={() => handleSort('category')}>
                    <span className="flex items-center">Category <SortIcon column="category" /></span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none" onClick={() => handleSort('gender')}>
                    <span className="flex items-center">Gender <SortIcon column="gender" /></span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none" onClick={() => handleSort('price')}>
                    <span className="flex items-center">Price <SortIcon column="price" /></span>
                  </th>
                  <th colSpan={5} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">Stock by Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">Actions</th>
                </tr>
                <tr>
                  <th colSpan={5}></th>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{product.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.salePrice ? (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 line-through">${product.basePrice.toFixed(2)}</span>
                            <span className="whitespace-nowrap text-sm text-gray-500">${product.salePrice.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span>${product.basePrice.toFixed(2)}</span>
                        )}
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
      )}

      {/* Product Management Tab */}
      {activeTab === 'products' && (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={handleCreateProduct}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                + Create Product
              </button>
              {selectedProducts.size > 0 && (
                <>
                  <button
                    onClick={() => { setBulkAction('price'); setShowBulkModal(true); }}
                    className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Bulk Price Update ({selectedProducts.size})
                  </button>
                  <button
                    onClick={() => { setBulkAction('stock'); setShowBulkModal(true); }}
                    className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Bulk Stock Update ({selectedProducts.size})
                  </button>
                </>
              )}
            </div>
            <button
              onClick={toggleAllProducts}
              className="text-sm text-gray-600 hover:text-black"
            >
              {selectedProducts.size === getSortedProducts().length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedProducts.size === getSortedProducts().length && getSortedProducts().length > 0}
                        onChange={toggleAllProducts}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none" onClick={() => handleSort('sku')}>
                      <span className="flex items-center">SKU <SortIcon column="sku" /></span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none" onClick={() => handleSort('name')}>
                      <span className="flex items-center">Name <SortIcon column="name" /></span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none" onClick={() => handleSort('gender')}>
                      <span className="flex items-center">Gender <SortIcon column="gender" /></span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none" onClick={() => handleSort('price')}>
                      <span className="flex items-center">Price <SortIcon column="price" /></span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none" onClick={() => handleSort('salePrice')}>
                      <span className="flex items-center">Sale Price <SortIcon column="salePrice" /></span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none" onClick={() => handleSort('status')}>
                      <span className="flex items-center">Status <SortIcon column="status" /></span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none" onClick={() => handleSort('isVisible')}>
                      <span className="flex items-center">Visible <SortIcon column="isVisible" /></span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none" onClick={() => handleSort('stock')}>
                      <span className="flex items-center">Stock <SortIcon column="stock" /></span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getSortedProducts().map((product) => {
                    const totalStock = product.stockBySize ? Object.values(product.stockBySize).reduce((a, b) => a + b, 0) : 0
                    const isLowStock = totalStock <= product.lowStockThreshold
                    const discount = getDiscountPercent(product.basePrice, product.salePrice)
                    
                    return (
                      <tr key={product.id} className={isLowStock ? 'bg-red-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedProducts.has(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{product.gender}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${product.basePrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.salePrice ? (
                            <>
                              ${product.salePrice.toFixed(2)}
                              {discount && <span className="ml-2 text-xs text-red-600">({discount}% off)</span>}
                            </>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            product.status === 'active' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.isVisible ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-red-600">✗</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={isLowStock ? 'text-red-600 font-semibold' : ''}>
                            {totalStock} {isLowStock && '(Low)'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Product Create/Edit Modal */}
      {showProductModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => { setShowProductModal(false); setEditingProduct(null); }}
          onSave={handleSaveProduct}
        />
      )}

      {/* Bulk Action Modal */}
      {showBulkModal && bulkAction && (
        <BulkActionModal
          action={bulkAction}
          onClose={() => { setShowBulkModal(false); setBulkAction(null); }}
          onSave={handleBulkAction}
        />
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <OrdersTab
          orders={getSortedOrders()}
          filters={orderFilters}
          onFiltersChange={setOrderFilters}
          onFetchOrders={fetchOrders}
          onViewOrder={handleViewOrder}
          onUpdateStatus={handleUpdateOrderStatus}
          onCancelOrder={handleCancelOrder}
          onIssueRefund={handleIssueRefund}
          onDownloadInvoice={handleDownloadInvoice}
          onSort={handleOrderSort}
          sortColumn={orderSortColumn}
          sortDirection={orderSortDirection}
          SortIcon={OrderSortIcon}
        />
      )}

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => { setShowOrderDetail(false); setSelectedOrder(null); }}
          onUpdateStatus={handleUpdateOrderStatus}
          onCancelOrder={handleCancelOrder}
          onIssueRefund={handleIssueRefund}
          onDownloadInvoice={handleDownloadInvoice}
        />
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <UsersTab
          users={users}
          search={userSearch}
          onSearchChange={setUserSearch}
          onSearch={fetchUsers}
          onViewUser={handleViewUser}
          onPromoteToAdmin={handlePromoteToAdmin}
          onDisableUser={handleDisableUser}
          onEnableUser={handleEnableUser}
        />
      )}

      {/* User Detail Modal */}
      {showUserDetail && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => { setShowUserDetail(false); setSelectedUser(null); }}
          onPromoteToAdmin={handlePromoteToAdmin}
          onDisableUser={handleDisableUser}
          onEnableUser={handleEnableUser}
        />
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <AnalyticsTab
          analytics={analytics}
          days={analyticsDays}
          onDaysChange={setAnalyticsDays}
        />
      )}

      {/* Promotions Tab */}
      {activeTab === 'promotions' && (
        <PromotionsTab
          promoCodes={promoCodes}
          announcementBar={announcementBar}
          onSaveAnnouncement={handleSaveAnnouncement}
          savingAnnouncement={savingAnnouncement}
          onCreatePromoCode={() => { setEditingPromoCode(null); setShowPromoCodeModal(true); }}
          onEditPromoCode={(promoCode) => { setEditingPromoCode(promoCode); setShowPromoCodeModal(true); }}
          onDeletePromoCode={handleDeletePromoCode}
        />
      )}

      {/* Promo Code Modal */}
      {showPromoCodeModal && (
        <PromoCodeModal
          promoCode={editingPromoCode}
          onClose={() => { setShowPromoCodeModal(false); setEditingPromoCode(null); }}
          onSave={handleSavePromoCode}
        />
      )}
    </div>
  )
}

// Product Modal Component
function ProductModal({ product, onClose, onSave }: { product: Product | null, onClose: () => void, onSave: (data: any) => void }) {
  // Available tags for selection
  const availableTags = ['New', 'Sale', 'Popular']
  
  // Category options based on gender
  const categoryOptions: {
    mens: Array<{ value: string; label: string }>
    womens: Array<{ value: string; label: string }>
  } = {
    mens: [
      { value: 't-shirts', label: 'T-Shirts' },
      { value: 'shirts', label: 'Shirts' },
      { value: 'hoodies', label: 'Hoodies' },
      { value: 'jackets', label: 'Jackets' },
      { value: 'knitwear', label: 'Knitwear' },
      { value: 'pants', label: 'Pants' },
      { value: 'jeans', label: 'Jeans' },
      { value: 'shorts', label: 'Shorts' },
      { value: 'accessories', label: 'Accessories' },
    ],
    womens: [
      { value: 'dresses', label: 'Dresses' },
      { value: 'tops', label: 'Tops' },
      { value: 't-shirts', label: 'T-Shirts' },
      { value: 'skirts', label: 'Skirts' },
      { value: 'pants', label: 'Pants' },
      { value: 'jeans', label: 'Jeans' },
      { value: 'jackets', label: 'Jackets' },
      { value: 'knitwear', label: 'Knitwear' },
      { value: 'shorts', label: 'Shorts' },
      { value: 'jumpsuits', label: 'Jumpsuits' },
      { value: 'lingerie', label: 'Lingerie' },
      { value: 'accessories', label: 'Accessories' },
    ],
  }
  
  const [formData, setFormData] = useState({
    sku: product?.sku || '',
    name: product?.name || '',
    basePrice: product?.basePrice || 0,
    salePrice: product?.salePrice || '',
    category: product?.category || 'shirts',
    gender: product?.gender || 'mens',
    color: product?.color || '',
    image: product?.image || '',
    tags: product?.tags || [], // Changed to array
    sizes: product?.sizes?.join(', ') || 'S, M, L, XL, 2XL',
    stockBySize: product?.stockBySize || { S: 0, M: 0, L: 0, XL: 0, '2XL': 0 },
    status: product?.status || 'active',
    isVisible: product?.isVisible ?? true,
    lowStockThreshold: product?.lowStockThreshold || 10,
  })

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null)

  // Update image preview when formData.image changes
  useEffect(() => {
    if (formData.image) {
      setImagePreview(formData.image)
    }
  }, [formData.image])

  // Calculate sale percentage
  const calculateSalePercentage = (): number | null => {
    if (!formData.salePrice || !formData.basePrice) return null
    const base = parseFloat(formData.basePrice as any)
    const sale = parseFloat(formData.salePrice as any)
    if (base <= 0 || sale >= base) return null
    return Math.round(((base - sale) / base) * 100)
  }

  // Get current categories based on selected gender
  const getCurrentCategories = () => {
    return categoryOptions[formData.gender as keyof typeof categoryOptions] || categoryOptions.mens
  }

  // Reset category if it's not valid for the selected gender
  useEffect(() => {
    const currentCategories = getCurrentCategories()
    const isValidCategory = currentCategories.some(cat => cat.value === formData.category)
    if (!isValidCategory && currentCategories.length > 0) {
      setFormData(prev => ({ ...prev, category: currentCategories[0].value }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.gender])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(s => s)
    
    const submitData: any = {
      ...formData,
      tags: formData.tags, // Already an array
      sizes: sizesArray,
      basePrice: parseFloat(formData.basePrice as any),
      salePrice: formData.salePrice ? parseFloat(formData.salePrice as any) : null,
      lowStockThreshold: parseInt(formData.lowStockThreshold as any),
    }

    // Don't send SKU for new products (it will be auto-generated)
    if (!product) {
      delete submitData.sku
    }

    onSave(submitData)
  }

  const handleTagToggle = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.includes(tag)
        ? formData.tags.filter(t => t !== tag)
        : [...formData.tags, tag]
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, and WebP are allowed.')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert('File size too large. Maximum size is 5MB.')
      return
    }

    setUploadingImage(true)

    try {
      const formDataToUpload = new FormData()
      formDataToUpload.append('file', file)
      formDataToUpload.append('gender', formData.gender)
      formDataToUpload.append('productName', formData.name || 'product')

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataToUpload,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upload image')
      }

      const data = await response.json()
      setFormData({ ...formData, image: data.imagePath })
      setImagePreview(data.imagePath)
    } catch (error: any) {
      console.error('Error uploading image:', error)
      alert(error.message || 'Failed to upload image. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{product ? 'Edit Product' : 'Create Product'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {product && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Auto-generated)</label>
                <input
                  type="text"
                  value={formData.sku}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>
            )}
            <div className={product ? '' : 'col-span-2'}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Gender and Category - Reordered: Gender first, then Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select
                required
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="mens">Mens</option>
                <option value="womens">Womens</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                {getCurrentCategories().map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Price *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
              {formData.salePrice && calculateSalePercentage() && (
                <p className="mt-1 text-sm text-gray-600">
                  Sale: <span className="font-semibold text-red-600">-{calculateSalePercentage()}%</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., Black, White, Red, Blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="active">Active (Visible on website)</option>
                <option value="archived">Archived (Not visible on website)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image *</label>
            <div className="space-y-3">
              <div>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Accepted formats: JPEG, PNG, WebP. Max size: 5MB
                </p>
              </div>
              {uploadingImage && (
                <p className="text-sm text-blue-600">Uploading image...</p>
              )}
              {imagePreview && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div className="relative w-32 h-32 border border-gray-300 rounded overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Product preview"
                      fill
                      className="object-cover"
                      onError={() => setImagePreview(null)}
                      unoptimized
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Image path: {formData.image}</p>
                </div>
              )}
              {!imagePreview && formData.image && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Current image path:</p>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value })
                      setImagePreview(e.target.value)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                    placeholder="/images/products/MENS-product-name"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-3">
              {availableTags.map((tag) => (
                <label
                  key={tag}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.tags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-2 focus:ring-black focus:ring-offset-0"
                  />
                  <span className="ml-2 text-sm text-gray-700">{tag}</span>
                </label>
              ))}
            </div>
            {formData.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs text-gray-500">Selected:</span>
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma-separated) *</label>
            <input
              type="text"
              required
              value={formData.sizes}
              onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="S, M, L, XL, 2XL"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
              <input
                type="number"
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isVisible}
                  onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  className="rounded border-gray-300 mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Visible to customers</span>
              </label>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              {product ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Orders Tab Component
function OrdersTab({
  orders,
  filters,
  onFiltersChange,
  onFetchOrders,
  onViewOrder,
  onUpdateStatus,
  onCancelOrder,
  onIssueRefund,
  onDownloadInvoice,
  onSort,
  sortColumn,
  sortDirection,
  SortIcon
}: {
  orders: Order[]
  filters: any
  onFiltersChange: (filters: any) => void
  onFetchOrders: () => void
  onViewOrder: (orderId: string) => void
  onUpdateStatus: (orderId: string, status: string) => void
  onCancelOrder: (orderId: string) => void
  onIssueRefund: (orderId: string) => void
  onDownloadInvoice: () => void
  onSort: (column: 'orderNumber' | 'orderDate' | 'customer' | 'status' | 'total') => void
  sortColumn: 'orderNumber' | 'orderDate' | 'customer' | 'status' | 'total' | null
  sortDirection: 'asc' | 'desc'
  SortIcon: ({ column }: { column: 'orderNumber' | 'orderDate' | 'customer' | 'status' | 'total' }) => JSX.Element
}) {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const handleApplyFilters = () => {
    onFetchOrders()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-purple-100 text-purple-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search (Order #, Customer)</label>
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search orders..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleApplyFilters}
              className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none" onClick={() => onSort('orderNumber')}>
                  <span className="flex items-center">Order # <SortIcon column="orderNumber" /></span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none" onClick={() => onSort('orderDate')}>
                  <span className="flex items-center">Date <SortIcon column="orderDate" /></span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none" onClick={() => onSort('customer')}>
                  <span className="flex items-center">Customer <SortIcon column="customer" /></span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none" onClick={() => onSort('status')}>
                  <span className="flex items-center">Status <SortIcon column="status" /></span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none" onClick={() => onSort('total')}>
                  <span className="flex items-center">Total <SortIcon column="total" /></span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => {
                const customerDetails = order.customerDetails as any
                const customerName = customerDetails?.firstName && customerDetails?.lastName
                  ? `${customerDetails.firstName} ${customerDetails.lastName}`
                  : order.user?.name || order.user?.email || 'N/A'
                return (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>{order.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => onViewOrder(order.id)} className="text-blue-600 hover:text-blue-900 mr-4">View</button>
                      {order.status !== 'cancelled' && order.status !== 'refunded' && (
                        <button onClick={() => onUpdateStatus(order.id, order.status === 'pending' ? 'paid' : order.status === 'paid' ? 'shipped' : 'shipped')} className="text-green-600 hover:text-green-900 mr-4">
                          {order.status === 'pending' ? 'Mark Paid' : order.status === 'paid' ? 'Mark Shipped' : 'Update'}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && <div className="text-center py-12 text-gray-600"><p>No orders found.</p></div>}
      </div>
    </div>
  )
}

// Order Detail Modal Component
function OrderDetailModal({ order, onClose, onUpdateStatus, onCancelOrder, onIssueRefund, onDownloadInvoice }: { order: Order, onClose: () => void, onUpdateStatus: (orderId: string, status: string) => void, onCancelOrder: (orderId: string) => void, onIssueRefund: (orderId: string) => void, onDownloadInvoice: () => void }) {
  const customerDetails = order.customerDetails as any
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-purple-100 text-purple-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold">Order Details - {order.orderNumber}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div><h3 className="text-sm font-medium text-gray-500 mb-1">Order ID</h3><p className="text-sm text-gray-900">{order.id}</p></div>
            <div><h3 className="text-sm font-medium text-gray-500 mb-1">Order Date</h3><p className="text-sm text-gray-900">{new Date(order.orderDate).toLocaleString()}</p></div>
            <div><h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3><span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>{order.status}</span></div>
            <div><h3 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h3><p className="text-sm text-gray-900 capitalize">{order.paymentMethod}</p></div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-500">Name</p><p className="text-sm font-medium">{customerDetails?.firstName} {customerDetails?.lastName}</p></div>
              <div><p className="text-sm text-gray-500">Email</p><p className="text-sm font-medium">{customerDetails?.email}</p></div>
              <div><p className="text-sm text-gray-500">Phone</p><p className="text-sm font-medium">{customerDetails?.phone}</p></div>
              <div><p className="text-sm text-gray-500">Address</p><p className="text-sm font-medium">{customerDetails?.address}, {customerDetails?.city}, {customerDetails?.state} {customerDetails?.postcode}</p></div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Items</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th></tr></thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item) => {
                    const product = item.productData as any
                    return (
                      <tr key={item.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{product?.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{item.size}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">${item.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span><span className="text-gray-900">${order.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Shipping</span><span className="text-gray-900">${order.shipping.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Tax</span><span className="text-gray-900">${order.tax.toFixed(2)}</span></div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-end gap-2 flex-wrap">
            <button onClick={onDownloadInvoice} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Download Invoice</button>
            {order.status === 'pending' && (<><button onClick={() => onUpdateStatus(order.id, 'paid')} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Mark as Paid</button><button onClick={() => onCancelOrder(order.id)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Cancel Order</button></>)}
            {order.status === 'paid' && (<><button onClick={() => onUpdateStatus(order.id, 'shipped')} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Mark as Shipped</button><button onClick={() => onIssueRefund(order.id)} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Issue Refund</button></>)}
            {order.status === 'shipped' && <button onClick={() => onIssueRefund(order.id)} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Issue Refund</button>}
            <select value={order.status} onChange={(e) => onUpdateStatus(order.id, e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black">
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Analytics Tab Component
function AnalyticsTab({
  analytics,
  days,
  onDaysChange
}: {
  analytics: any
  days: number
  onDaysChange: (days: number) => void
}) {
  if (!analytics) {
    return (
      <div className="text-center py-12 text-gray-600">
        <p>Loading analytics...</p>
      </div>
    )
  }

  const { kpis, ordersPerDay, topProducts, lowStockProducts } = analytics

  // Calculate max values for chart scaling
  const maxOrders = Math.max(...ordersPerDay.map((d: any) => d.count), 1)
  const maxQuantity = Math.max(...topProducts.map((p: any) => p.quantity), 1)

  // Debug: log the data
  console.log('Orders per day data:', ordersPerDay)
  console.log('Max orders:', maxOrders)

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">${kpis.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Orders Today</h3>
          <p className="text-2xl font-bold text-gray-900">{kpis.ordersToday}</p>
          <p className="text-xs text-gray-500 mt-1">This Week: {kpis.ordersThisWeek}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Avg Order Value</h3>
          <p className="text-2xl font-bold text-gray-900">${kpis.avgOrderValue.toFixed(2)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Users</h3>
          <p className="text-2xl font-bold text-gray-900">{kpis.totalUsers}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Per Day Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Orders Per Day</h3>
            <div className="flex gap-2">
              <button
                onClick={() => onDaysChange(7)}
                className={`px-3 py-1 text-sm rounded-md ${days === 7 ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                7 Days
              </button>
              <button
                onClick={() => onDaysChange(30)}
                className={`px-3 py-1 text-sm rounded-md ${days === 30 ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                30 Days
              </button>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-1 pb-6">
            {ordersPerDay.map((day: any, index: number) => {
              // Use a scale that makes bars more visible
              // Add some padding so bars with small counts are still visible
              const scaleFactor = 0.85 // Use 85% of available height for better visibility
              const heightPercent = maxOrders > 0 
                ? ((day.count / maxOrders) * 100 * scaleFactor) + (15 * scaleFactor) // Scale to 85% + add base padding
                : 0
              const minHeightPercent = day.count > 0 ? 8 : 2 // Minimum 8% for days with orders
              const height = Math.max(heightPercent, minHeightPercent)
              const date = new Date(day.date)
              const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              const showLabel = index % Math.ceil(ordersPerDay.length / 7) === 0
              return (
                <div key={index} className="flex-1 flex flex-col items-center justify-end group relative" style={{ height: '100%' }}>
                  <div
                    className={`w-full rounded-t ${day.count > 0 ? 'bg-blue-500 hover:bg-blue-600 transition-colors' : 'bg-gray-200'}`}
                    style={{ height: day.count > 0 ? `${height}%` : '2px', minHeight: day.count > 0 ? '8px' : '2px' }}
                    title={`${dayLabel}: ${day.count} orders`}
                  />
                  {showLabel && (
                    <span className="text-xs text-gray-500 whitespace-nowrap absolute" style={{ bottom: '-20px', left: '50%', transform: 'translateX(-50%) rotate(-45deg)' }}>
                      {dayLabel}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sales data available</p>
            ) : (
              topProducts.map((product: any, index: number) => {
                const width = maxQuantity > 0 ? (product.quantity / maxQuantity) * 100 : 0
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{product.name}</span>
                      <span className="text-sm text-gray-600">{product.quantity}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Products */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Low Stock Products</h3>
        {lowStockProducts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">All products are well stocked</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lowStockProducts.map((product: any, index: number) => (
                  <tr key={index} className={product.stock === 0 ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.threshold}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.stock === 0 ? 'bg-red-100 text-red-800' :
                        product.stock <= product.threshold / 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.stock === 0 ? 'Out of Stock' :
                         product.stock <= product.threshold / 2 ? 'Critical' : 'Low Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// Users Tab Component
function UsersTab({
  users,
  search,
  onSearchChange,
  onSearch,
  onViewUser,
  onPromoteToAdmin,
  onDisableUser,
  onEnableUser
}: {
  users: any[]
  search: string
  onSearchChange: (search: string) => void
  onSearch: () => void
  onViewUser: (userId: string) => void
  onPromoteToAdmin: (userId: string) => void
  onDisableUser: (userId: string) => void
  onEnableUser: (userId: string) => void
}) {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch()
  }

  return (
    <div>
      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by email or name..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { onSearchChange(''); onSearch(); }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className={user.isDisabled ? 'bg-red-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.isDisabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {user.isDisabled ? 'Disabled' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user._count?.orders || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => onViewUser(user.id)} className="text-blue-600 hover:text-blue-900 mr-4">View</button>
                    {!user.isAdmin && (
                      <button onClick={() => onPromoteToAdmin(user.id)} className="text-purple-600 hover:text-purple-900 mr-4">Promote</button>
                    )}
                    {user.isDisabled ? (
                      <button onClick={() => onEnableUser(user.id)} className="text-green-600 hover:text-green-900">Enable</button>
                    ) : (
                      <button onClick={() => onDisableUser(user.id)} className="text-red-600 hover:text-red-900">Disable</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <p>No users found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// User Detail Modal Component
function UserDetailModal({
  user,
  onClose,
  onPromoteToAdmin,
  onDisableUser,
  onEnableUser
}: {
  user: any
  onClose: () => void
  onPromoteToAdmin: (userId: string) => void
  onDisableUser: (userId: string) => void
  onEnableUser: (userId: string) => void
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold">User Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
              <p className="text-sm text-gray-900">{user.email || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Name</h3>
              <p className="text-sm text-gray-900">{user.name || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Role</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                {user.isAdmin ? 'Admin' : 'User'}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${user.isDisabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {user.isDisabled ? 'Disabled' : 'Active'}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Orders</h3>
              <p className="text-sm text-gray-900">{user._count?.orders || 0}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Member Since</h3>
              <p className="text-sm text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Order History */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Order History</h3>
            {user.orders && user.orders.length > 0 ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {user.orders.map((order: any) => {
                      const getStatusColor = (status: string) => {
                        switch (status) {
                          case 'paid': return 'bg-green-100 text-green-800'
                          case 'shipped': return 'bg-blue-100 text-blue-800'
                          case 'cancelled': return 'bg-red-100 text-red-800'
                          case 'refunded': return 'bg-purple-100 text-purple-800'
                          default: return 'bg-yellow-100 text-yellow-800'
                        }
                      }
                      return (
                        <tr key={order.id}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.orderNumber}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">${order.total.toFixed(2)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600 border border-gray-200 rounded-lg">
                <p>No orders found</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 pt-4 flex justify-end gap-2 flex-wrap">
            {!user.isAdmin && (
              <button
                onClick={() => onPromoteToAdmin(user.id)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Promote to Admin
              </button>
            )}
            {user.isDisabled ? (
              <button
                onClick={() => onEnableUser(user.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Enable User
              </button>
            ) : (
              <button
                onClick={() => onDisableUser(user.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Disable User
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Bulk Action Modal Component
function BulkActionModal({ action, onClose, onSave }: { action: 'price' | 'stock', onClose: () => void, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState<any>({
    basePrice: '',
    salePrice: '',
    status: '',
    isVisible: undefined,
    stockBySize: { S: 0, M: 0, L: 0, XL: 0, '2XL': 0 },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">Bulk {action === 'price' ? 'Price' : 'Stock'} Update</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {action === 'price' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (leave empty to keep current)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (leave empty to remove)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status (leave empty to keep current)</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Keep current</option>
                  <option value="active">Active</option>
                  <option value="active">Active (Visible on website)</option>
                  <option value="archived">Archived (Not visible on website)</option>
                </select>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isVisible === true}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked ? true : undefined })}
                    className="rounded border-gray-300 mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Visible (uncheck to hide, leave for no change)</span>
                </label>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock by Size</label>
              {['S', 'M', 'L', 'XL', '2XL'].map(size => (
                <div key={size} className="mb-2">
                  <label className="block text-xs text-gray-600 mb-1">{size}</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockBySize[size]}
                    onChange={(e) => setFormData({
                      ...formData,
                      stockBySize: { ...formData.stockBySize, [size]: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-gray-200 pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Promotions Tab Component
function PromotionsTab({
  promoCodes,
  announcementBar,
  onSaveAnnouncement,
  savingAnnouncement,
  onCreatePromoCode,
  onEditPromoCode,
  onDeletePromoCode
}: {
  promoCodes: any[]
  announcementBar: any
  onSaveAnnouncement: (text: string, isActive: boolean) => void
  savingAnnouncement: boolean
  onCreatePromoCode: () => void
  onEditPromoCode: (promoCode: any) => void
  onDeletePromoCode: (promoCodeId: string) => void
}) {
  const [announcementText, setAnnouncementText] = useState(announcementBar?.text || '')
  const [announcementActive, setAnnouncementActive] = useState(announcementBar?.isActive !== false)

  useEffect(() => {
    if (announcementBar) {
      setAnnouncementText(announcementBar.text || '')
      setAnnouncementActive(announcementBar.isActive !== false)
    }
  }, [announcementBar])

  const handleSaveAnnouncementClick = () => {
    onSaveAnnouncement(announcementText, announcementActive)
  }

  return (
    <div className="space-y-6">
      {/* Announcement Bar Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Announcement Bar</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Announcement Text
            </label>
            <textarea
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Free shipping on orders over $100 • Use code: SAVE20"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={announcementActive}
                onChange={(e) => setAnnouncementActive(e.target.checked)}
                className="rounded border-gray-300 mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
          </div>
          <button
            onClick={handleSaveAnnouncementClick}
            disabled={savingAnnouncement}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            {savingAnnouncement ? 'Saving...' : 'Save Announcement'}
          </button>
        </div>
      </div>

      {/* Promo Codes Section */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Promo Codes</h2>
          <button
            onClick={onCreatePromoCode}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            + Create Promo Code
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min. Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {promoCodes.map((promoCode) => {
                const isExpired = promoCode.expiryDate && new Date(promoCode.expiryDate) < new Date()
                const displayStatus = !promoCode.isActive ? 'Inactive' : isExpired ? 'Expired' : 'Active'
                
                return (
                  <tr key={promoCode.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{promoCode.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {promoCode.discountType === 'percentage' 
                        ? `${promoCode.discountValue}%`
                        : `$${promoCode.discountValue.toFixed(2)}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {promoCode.minimumOrder ? `$${promoCode.minimumOrder.toFixed(2)}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        displayStatus === 'Active' ? 'bg-green-100 text-green-800' :
                        displayStatus === 'Expired' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {displayStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {promoCode.expiryDate ? new Date(promoCode.expiryDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{promoCode.usageCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onEditPromoCode(promoCode)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeletePromoCode(promoCode.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {promoCodes.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              <p>No promo codes found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Promo Code Modal Component
function PromoCodeModal({ promoCode, onClose, onSave }: { promoCode: any | null, onClose: () => void, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    code: promoCode?.code || '',
    discountType: promoCode?.discountType || 'percentage',
    discountValue: promoCode?.discountValue || '',
    minimumOrder: promoCode?.minimumOrder || '',
    isActive: promoCode?.isActive !== undefined ? promoCode.isActive : true,
    expiryDate: promoCode?.expiryDate ? new Date(promoCode.expiryDate).toISOString().split('T')[0] : '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const submitData = {
      code: formData.code,
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue as any),
      minimumOrder: formData.minimumOrder ? parseFloat(formData.minimumOrder as any) : null,
      isActive: formData.isActive,
      expiryDate: formData.expiryDate || null,
    }

    onSave(submitData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">{promoCode ? 'Edit Promo Code' : 'Create Promo Code'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="SAVE20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
            <select
              required
              value={formData.discountType}
              onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Value * {formData.discountType === 'percentage' ? '(0-100%)' : '($)'}
            </label>
            <input
              type="number"
              step={formData.discountType === 'percentage' ? '1' : '0.01'}
              min="0"
              max={formData.discountType === 'percentage' ? '100' : undefined}
              required
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder={formData.discountType === 'percentage' ? '20' : '10.00'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Value ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.minimumOrder}
              onChange={(e) => setFormData({ ...formData, minimumOrder: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="100.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300 mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
          </div>

          <div className="border-t border-gray-200 pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              {promoCode ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
