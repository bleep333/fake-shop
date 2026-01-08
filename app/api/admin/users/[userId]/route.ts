import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/users/[userId] - Get a single user with orders (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = (session.user as any).isAdmin === true
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      include: {
        orders: {
          include: {
            items: true
          },
          orderBy: {
            orderDate: 'desc'
          }
        },
        _count: {
          select: {
            orders: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/users/[userId] - Update user (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = (session.user as any).isAdmin === true
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { isAdmin: makeAdmin, isDisabled } = body

    // Prevent disabling the current admin user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email || undefined }
    })

    if (currentUser?.id === params.userId && (makeAdmin === false || isDisabled === true)) {
      return NextResponse.json(
        { error: 'Cannot remove admin status or disable your own account' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (typeof makeAdmin === 'boolean') updateData.isAdmin = makeAdmin
    if (typeof isDisabled === 'boolean') updateData.isDisabled = isDisabled

    const user = await prisma.user.update({
      where: { id: params.userId },
      data: updateData,
      include: {
        orders: {
          include: {
            items: true
          },
          orderBy: {
            orderDate: 'desc'
          }
        },
        _count: {
          select: {
            orders: true
          }
        }
      }
    })

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error('Error updating user:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
