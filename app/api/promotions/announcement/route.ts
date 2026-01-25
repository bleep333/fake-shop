import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET /api/promotions/announcement - Get announcement bar text (public)
export async function GET(request: NextRequest) {
  try {
    // Get the announcement bar (there should only be one)
    let announcementBar = await prisma.announcementBar.findFirst()
    
    if (!announcementBar) {
      // Create default if doesn't exist
      announcementBar = await prisma.announcementBar.create({
        data: {
          text: 'Free shipping on orders over $100 - No discount code needed',
          isActive: true
        }
      })
    }

    // Only return if active
    if (!announcementBar.isActive) {
      return NextResponse.json({ announcementBar: null })
    }

    return NextResponse.json(
      { announcementBar },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  } catch (error) {
    console.error('Error fetching announcement bar:', error)
    return NextResponse.json(
      { error: 'Failed to fetch announcement bar' },
      { status: 500 }
    )
  }
}
