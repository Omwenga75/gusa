import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/adminAuth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  const { error } = await verifyAdminSession()
  if (error) return error

  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gallery')
    let isReadOnly = false
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch {
      isReadOnly = true
    }

    const urls: string[] = []

    for (const file of files) {
      if (!(file instanceof File) || !file.type.startsWith('image/')) {
        continue
      }

      const buffer = Buffer.from(await file.arrayBuffer())

      if (!isReadOnly) {
        try {
          // Generate unique filename
          const ext = file.name.split('.').pop() || 'jpg'
          const uniqueName = `gallery_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
          const filePath = path.join(uploadDir, uniqueName)

          // Write file to disk
          await writeFile(filePath, buffer)

          // Return the public URL path
          urls.push(`/uploads/gallery/${uniqueName}`)
          continue
        } catch {
          // Fall through to data URL if writing fails
        }
      }

      // Fallback for Vercel/serverless environments where disk is read-only
      const base64 = buffer.toString('base64')
      urls.push(`data:${file.type || 'image/jpeg'};base64,${base64}`)
    }

    if (urls.length === 0) {
      return NextResponse.json({ error: 'No valid image files found' }, { status: 400 })
    }

    return NextResponse.json({ success: true, urls })
  } catch (err) {
    console.error('Gallery upload error:', err)
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 })
  }
}
