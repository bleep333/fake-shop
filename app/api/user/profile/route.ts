import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/user/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user by email (case-insensitive search using findFirst)
    const user = await prisma.user.findFirst({
      where: { 
        email: {
          equals: session.user.email,
          mode: 'insensitive'
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PATCH /api/user/profile - Update user profile (name only - email changes not supported)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name } = body

    if (name === undefined) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    // Use upsert to either update existing user or create if doesn't exist
    // This prevents duplicate users
    const user = await prisma.user.upsert({
      where: { 
        email: session.user.email 
      },
      update: {
        name: name
      },
      create: {
        email: session.user.email,
        name: name || session.user.name || null
      }
    })

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error('Error updating user profile:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
