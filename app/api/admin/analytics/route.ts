import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = (session.user as any).isAdmin === true
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '30')

    // Calculate date ranges
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay()) // Start of week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0)
    // For "last N days" including today, go back (N-1) days
    // Use UTC consistently to avoid timezone issues
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0))
    const daysAgo = new Date(todayUTC)
    daysAgo.setUTCDate(todayUTC.getUTCDate() - (days - 1))

    // Total Revenue (sum of all order totals)
    const totalRevenueResult = await prisma.order.aggregate({
      _sum: {
        total: true
      },
      where: {
        status: {
          not: 'cancelled'
        }
      }
    })
    const totalRevenue = totalRevenueResult._sum.total || 0

    // Orders today
    const ordersTodayResult = await prisma.order.count({
      where: {
        orderDate: {
          gte: startOfToday
        }
      }
    })

    // Orders this week
    const ordersThisWeekResult = await prisma.order.count({
      where: {
        orderDate: {
          gte: startOfWeek
        }
      }
    })

    // Average order value
    const avgOrderValueResult = await prisma.order.aggregate({
      _avg: {
        total: true
      },
      where: {
        status: {
          not: 'cancelled'
        }
      }
    })
    const avgOrderValue = avgOrderValueResult._avg.total || 0

    // Total users
    const totalUsersResult = await prisma.user.count({
      where: {
        isDisabled: false
      }
    })

    // Orders per day (last N days)
    // Fetch all orders in the date range and group by date
    const ordersInPeriod = await prisma.order.findMany({
      where: {
        orderDate: {
          gte: daysAgo
        }
      },
      select: {
        orderDate: true
      }
    })

    // Process orders per day to fill in missing dates
    const ordersPerDayMap = new Map<string, number>()
    
    // Initialize all dates in range with 0
    // Convert daysAgo to UTC midnight for consistent date string generation
    const startDate = new Date(daysAgo.getTime())
    startDate.setUTCHours(0, 0, 0, 0)
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate)
      date.setUTCDate(date.getUTCDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      ordersPerDayMap.set(dateStr, 0)
    }
    
    // Count orders per day (all dates from database are already Date objects)
    ordersInPeriod.forEach(order => {
      const dateStr = order.orderDate.toISOString().split('T')[0]
      if (ordersPerDayMap.has(dateStr)) {
        ordersPerDayMap.set(dateStr, ordersPerDayMap.get(dateStr)! + 1)
      }
    })
    
    const ordersPerDayArray = Array.from(ordersPerDayMap.entries())
      .map(([date, count]) => ({
        date,
        count
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Top-selling products (by quantity sold)
    // First, get all order items
    const allOrderItems = await prisma.orderItem.findMany({
      select: {
        productData: true,
        quantity: true
      }
    })

    // Group by product name (sum quantities across all sizes)
    const productMap = new Map<string, number>()
    allOrderItems.forEach(item => {
      try {
        const productData = item.productData as any
        const productName = productData?.name || 'Unknown'
        const currentQuantity = productMap.get(productName) || 0
        productMap.set(productName, currentQuantity + (item.quantity || 0))
      } catch {
        // Skip invalid product data
      }
    })

    // Convert to array and sort by quantity
    const topProductsProcessed = Array.from(productMap.entries())
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10)

    // Low-stock products
    const allProducts = await prisma.product.findMany({
      where: {
        isVisible: true,
        status: 'active'
      },
      select: {
        id: true,
        name: true,
        stockBySize: true,
        lowStockThreshold: true
      }
    })

    const lowStockProducts = allProducts
      .map(product => {
        const stockBySize = (product.stockBySize as Record<string, number>) || {}
        const totalStock = Object.values(stockBySize).reduce((sum, val) => sum + val, 0)
        return {
          name: product.name,
          stock: totalStock,
          threshold: product.lowStockThreshold
        }
      })
      .filter(product => product.stock <= product.threshold)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 10)

    return NextResponse.json({
      kpis: {
        totalRevenue,
        ordersToday: ordersTodayResult,
        ordersThisWeek: ordersThisWeekResult,
        avgOrderValue,
        totalUsers: totalUsersResult
      },
      ordersPerDay: ordersPerDayArray,
      topProducts: topProductsProcessed,
      lowStockProducts
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
