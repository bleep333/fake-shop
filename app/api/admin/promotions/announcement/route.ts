import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/promotions/announcement - Get announcement bar text
export async function GET(request: NextRequest) {
  try {
    // Get or create the announcement bar (there should only be one)
    let announcementBar = await prisma.announcementBar.findFirst()
    
    if (!announcementBar) {
      announcementBar = await prisma.announcementBar.create({
        data: {
          text: 'Free shipping on orders over $100 - No discount code needed',
          isActive: true
        }
      })
    }

    return NextResponse.json({ announcementBar })
  } catch (error) {
    console.error('Error fetching announcement bar:', error)
    return NextResponse.json(
      { error: 'Failed to fetch announcement bar' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/promotions/announcement - Update announcement bar text
export async function PATCH(request: NextRequest) {
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
    const { text, isActive } = body

    // Get or create the announcement bar
    let announcementBar = await prisma.announcementBar.findFirst()
    
    const updateData: any = {}
    if (text !== undefined) updateData.text = text
    if (isActive !== undefined) updateData.isActive = isActive

    if (announcementBar) {
      announcementBar = await prisma.announcementBar.update({
        where: { id: announcementBar.id },
        data: updateData
      })
    } else {
      announcementBar = await prisma.announcementBar.create({
        data: {
          text: text || 'Free shipping on orders over $100 - No discount code needed',
          isActive: isActive !== undefined ? isActive : true
        }
      })
    }

    return NextResponse.json({ announcementBar })
  } catch (error) {
    console.error('Error updating announcement bar:', error)
    return NextResponse.json(
      { error: 'Failed to update announcement bar' },
      { status: 500 }
    )
  }
}
