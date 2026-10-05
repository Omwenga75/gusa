import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/adminAuth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await verifyAdminSession()
  if (error) return error

  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Album ID is required' }, { status: 400 })
    }

    await prisma.album.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete album API error:', error)
    return NextResponse.json({ error: 'Failed to delete album' }, { status: 500 })
  }
}
