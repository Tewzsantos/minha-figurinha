import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  }

  // Fetch figurinha data from generate endpoint
  const origin = req.headers.get('host')
    ? `${req.headers.get('x-forwarded-proto') || 'http'}://${req.headers.get('host')}`
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  const res = await fetch(`${origin}/api/generate?id=${id}`)
  const data = await res.json()

  if (!data.paid || !data.cleanUrl) {
    return NextResponse.json({ error: 'Figurinha não disponível para download' }, { status: 403 })
  }

  // If stored in Vercel Blob, proxy the file
  if (data.cleanUrl.startsWith('http')) {
    const fileRes = await fetch(data.cleanUrl)
    const buffer = await fileRes.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="minha-figurinha-copa2026.png"`,
        'Cache-Control': 'no-store',
      },
    })
  }

  // Data URL fallback
  const base64 = data.cleanUrl.split(',')[1]
  const buffer = Buffer.from(base64, 'base64')

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="minha-figurinha-copa2026.png"`,
    },
  })
}
