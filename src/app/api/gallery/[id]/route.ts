import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/adminAuth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'Album ID is required' }, { status: 400 })
    }

    const album = await prisma.album.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
          select: { id: true, imageUrl: true, caption: true, category: true, createdAt: true, displayOrder: true }
        }
      }
    })

    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 })
    }

    return NextResponse.json({ album })
  } catch (error) {
    console.error('Get album API error:', error)
    return NextResponse.json({ error: 'Failed to fetch album' }, { status: 500 })
  }
}

export async function PUT(
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

    const body = await request.json()
    const { name, description, images: imagesFromReq, category } = body

    if (!name) {
      return NextResponse.json({ error: 'Album name is required' }, { status: 400 })
    }

    let photoList: string[] = []
    if (Array.isArray(imagesFromReq)) {
      photoList = imagesFromReq.filter((url: any) => typeof url === 'string' && url.trim() !== '')
    }

    const cover = photoList[0] || null

    const updatedAlbum = await prisma.$transaction(async (tx) => {
      // If images array was provided, replace album images with new list
      if (Array.isArray(imagesFromReq)) {
        await tx.galleryImage.deleteMany({
          where: { albumId: id }
        })

        if (photoList.length > 0) {
          await tx.galleryImage.createMany({
            data: photoList.map((url, idx) => ({
              albumId: id,
              imageUrl: url,
              caption: `${name} - Photo ${idx + 1}`,
              category: category || 'General',
              displayOrder: idx
            }))
          })
        }
      }

      return tx.album.update({
        where: { id },
        data: {
          name,
          description: description !== undefined ? (description || '') : undefined,
          coverImage: cover,
        },
        include: {
          images: {
            orderBy: { displayOrder: 'asc' },
            select: { id: true, imageUrl: true, caption: true, category: true, createdAt: true, displayOrder: true }
          }
        }
      })
    })

    revalidatePath('/gallery')
    revalidatePath('/admin/gallery')

    return NextResponse.json({ success: true, album: updatedAlbum })
  } catch (error) {
    console.error('Update album API error:', error)
    return NextResponse.json({ error: 'Failed to update album' }, { status: 500 })
  }
}

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

    revalidatePath('/gallery')
    revalidatePath('/admin/gallery')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete album API error:', error)
    return NextResponse.json({ error: 'Failed to delete album' }, { status: 500 })
  }
}
