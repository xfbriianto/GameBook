import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) {
    return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const ext = file.name.split('.').pop()
  const fileName = `station_${Date.now()}.${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  const filePath = path.join(uploadDir, fileName)
  const publicPath = `/uploads/${fileName}`

  // Ensure uploads directory exists
  await fs.mkdir(uploadDir, { recursive: true })
  await fs.writeFile(filePath, buffer)

  return NextResponse.json({ success: true, path: publicPath })
} 