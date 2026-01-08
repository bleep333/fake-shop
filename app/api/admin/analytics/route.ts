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
    const daysAgo = new Date(now)
    daysAgo.setDate(now.getDate() - days)
    daysAgo.setHours(0, 0, 0, 0)

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
    const ordersPerDay = await prisma.order.groupBy({
      by: ['orderDate'],
      _count: {
        id: true
      },
      where: {
        orderDate: {
          gte: daysAgo
        }
      },
      orderBy: {
        orderDate: 'asc'
      }
    })

    // Process orders per day to fill in missing dates
    const ordersPerDayMap = new Map<string, number>()
    for (let i = 0; i < days; i++) {
      const date = new Date(daysAgo)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      ordersPerDayMap.set(dateStr, 0)
    }
    ordersPerDay.forEach(item => {
      const dateStr = item.orderDate.toISOString().split('T')[0]
      ordersPerDayMap.set(dateStr, item._count.id)
    })
    const ordersPerDayArray = Array.from(ordersPerDayMap.entries()).map(([date, count]) => ({
      date,
      count
    }))

    // Top-selling products (by quantity sold)
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productData'],
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        },
      },
      take: 10
    })

    // Process top products - extract product name from JSON
    const topProductsProcessed = topProducts
      .map(item => {
        try {
          const productData = item.productData as any
          return {
            name: productData?.name || 'Unknown',
            quantity: item._sum.quantity || 0
          }
        } catch {
          return null
        }
      })
      .filter((item): item is { name: string; quantity: number } => item !== null)

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
