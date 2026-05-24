import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'
import OpenAI from 'openai'
import { put } from '@vercel/blob'
import * as fs from 'fs'
import * as path from 'path'
import { figurinhaStore } from './store'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const maxDuration = 60 // seconds — allow time for image generation

// ─────────────────────────────────────────────
// POST  /api/generate   — create a new figurinha
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const foto    = form.get('foto')    as File
    const nome    = form.get('nome')    as string
    const birthDate = form.get('birthDate') as string
    const altura  = form.get('altura')  as string
    const peso    = form.get('peso')    as string
    const clube   = form.get('clube')   as string

    if (!foto || !nome) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const id = uuidv4()

    // Convert uploaded photo to base64
    const photoBuffer = Buffer.from(await foto.arrayBuffer())
    const photoBase64 = photoBuffer.toString('base64')
    const photoMime   = foto.type || 'image/jpeg'

    // Load reference figurinha from /public (if present)
    const refImagePath = path.join(process.cwd(), 'public', 'figurinha-ref.png')
    let refBase64 = photoBase64
    let refMime   = photoMime
    if (fs.existsSync(refImagePath)) {
      refBase64 = fs.readFileSync(refImagePath).toString('base64')
      refMime   = 'image/png'
    }

    // ── Step 1: GPT-4o analyses both images ──
    await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Quero que você substitua o jogador dessa figurinha Panini pela pessoa da segunda foto.
Garanta que as informações mudem conforme os dados:
- Nome: ${nome.toUpperCase()}
- Data de nascimento: ${birthDate}
- Altura: ${altura}
- Peso: ${peso} kg
- Clube: ${clube.toUpperCase()} (BRA)
Responda apenas "OK".`,
          },
          { type: 'image_url', image_url: { url: `data:${refMime};base64,${refBase64}`, detail: 'high' } },
          { type: 'image_url', image_url: { url: `data:${photoMime};base64,${photoBase64}`, detail: 'high' } },
        ],
      }],
    })

    // ── Step 2: DALL-E 3 generates the figurinha ──
    let generatedBase64: string

    try {
      const imgRes = await openai.images.generate({
        model: 'dall-e-3',
        prompt: buildPrompt(nome, birthDate, altura, peso, clube),
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
        quality: 'hd',
      })
      generatedBase64 = imgRes.data[0].b64_json!
    } catch {
      // Fallback: composite the user's photo into a basic template
      generatedBase64 = await buildFallback(photoBuffer, nome, birthDate, altura, peso, clube)
    }

    // ── Step 3: Resize & watermark ──
    const cleanResized = await sharp(Buffer.from(generatedBase64, 'base64'))
      .resize(400, 560, { fit: 'cover', position: 'top' })
      .png()
      .toBuffer()

    const watermarked = await addWatermark(cleanResized)

    // ── Step 4: Store ──
    let watermarkUrl: string
    let cleanUrl: string

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const [wm, cl] = await Promise.all([
        put(`figurinhas/${id}/watermark.png`, watermarked, { access: 'public', contentType: 'image/png' }),
        put(`figurinhas/${id}/clean.png`,     cleanResized, { access: 'public', contentType: 'image/png' }),
      ])
      watermarkUrl = wm.url
      cleanUrl     = cl.url
    } else {
      // Dev: return data URLs so the UI still works without Blob
      watermarkUrl = `data:image/png;base64,${watermarked.toString('base64')}`
      cleanUrl     = `data:image/png;base64,${cleanResized.toString('base64')}`
    }

    figurinhaStore.set(id, { id, name: nome, watermarkUrl, cleanUrl, paid: false, createdAt: new Date() })

    return NextResponse.json({ id, name: nome, watermarkUrl })

  } catch (err: any) {
    console.error('Generate error:', err)
    return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 500 })
  }
}

// ─────────────────────────────────────────────
// GET  /api/generate?id=...  — fetch figurinha
// ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID necessário' }, { status: 400 })

  const record = figurinhaStore.get(id)
  if (!record) return NextResponse.json({ error: 'Figurinha não encontrada' }, { status: 404 })

  return NextResponse.json({
    id:           record.id,
    name:         record.name,
    watermarkUrl: record.watermarkUrl,
    cleanUrl:     record.paid ? record.cleanUrl : null,
    paid:         record.paid,
  })
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function buildPrompt(nome: string, birthDate: string, altura: string, peso: string, clube: string) {
  return `Create an official Panini FIFA World Cup 2026 sticker card (portrait, 400x560px proportions).

Layout (match exactly):
- Background: cyan/turquoise (#00C4C8)
- Left side: large decorative "26" in dark green, semi-transparent, full height
- Top-right corner: FIFA World Cup 2026 trophy icon + "FIFA" + "2026" in white on small badge
- Center: photorealistic portrait of a Brazilian footballer in yellow Brazil #10 jersey (CBF logo), bust-length crop
- Right side: circular Brazilian flag + vertical "BRA" text in white
- Bottom dark band (#001840):
  - Player name in large bold white caps: ${nome.toUpperCase()}
  - Stats line: ${birthDate} | ${altura} | ${peso} kg
  - Club tag in yellow small text: ${clube.toUpperCase()} (BRA)
  - "PANINI" logo bottom-right

Style: clean, professional, official FIFA Panini sticker aesthetic. No watermarks.`
}

async function buildFallback(
  photoBuffer: Buffer,
  nome: string,
  birthDate: string,
  altura: string,
  peso: string,
  clube: string,
): Promise<string> {
  const bg = await sharp({
    create: { width: 400, height: 560, channels: 4, background: { r: 0, g: 196, b: 200, alpha: 1 } },
  }).png().toBuffer()

  const photo = await sharp(photoBuffer)
    .resize(260, 300, { fit: 'cover', position: 'top' })
    .png()
    .toBuffer()

  const bottomBar = await sharp({
    create: { width: 400, height: 130, channels: 4, background: { r: 0, g: 24, b: 64, alpha: 1 } },
  }).png().toBuffer()

  // SVG text overlay for name + stats
  const textSvg = `<svg width="400" height="130" xmlns="http://www.w3.org/2000/svg">
    <text x="200" y="36" text-anchor="middle" font-family="Arial Black,sans-serif"
      font-weight="900" font-size="28" fill="white" letter-spacing="2">${nome.toUpperCase()}</text>
    <text x="200" y="60" text-anchor="middle" font-family="Arial,sans-serif"
      font-size="12" fill="rgba(255,255,255,0.75)">${birthDate} | ${altura} | ${peso} kg</text>
    <rect x="140" y="68" width="120" height="20" rx="4" fill="rgba(255,223,0,0.15)" stroke="rgba(255,223,0,0.35)" stroke-width="1"/>
    <text x="200" y="82" text-anchor="middle" font-family="Arial,sans-serif"
      font-size="11" font-weight="700" fill="#FFDF00">${clube.toUpperCase()}</text>
    <text x="384" y="118" text-anchor="end" font-family="Georgia,serif"
      font-size="10" font-weight="900" fill="rgba(255,255,255,0.4)">PANINI®</text>
  </svg>`

  // "26" decoration
  const numSvg = `<svg width="120" height="560" xmlns="http://www.w3.org/2000/svg">
    <text x="-20" y="420" font-family="Arial Black,sans-serif" font-weight="900"
      font-size="320" fill="rgba(0,95,0,0.15)">2</text>
    <text x="20" y="700" font-family="Arial Black,sans-serif" font-weight="900"
      font-size="320" fill="rgba(0,95,0,0.15)">6</text>
  </svg>`

  const result = await sharp(bg)
    .composite([
      { input: Buffer.from(numSvg), top: 0, left: 0 },
      { input: photo, top: 38, left: 70 },
      { input: bottomBar, top: 430, left: 0 },
      { input: Buffer.from(textSvg), top: 430, left: 0 },
    ])
    .png()
    .toBuffer()

  return result.toString('base64')
}

async function addWatermark(imageBuffer: Buffer): Promise<Buffer> {
  const { width = 400, height = 560 } = await sharp(imageBuffer).metadata()
  const rows = 10
  const lines = Array.from({ length: rows }, (_, i) =>
    `<text x="200" y="${-60 + i * 75}" fill="white" font-family="Arial" font-weight="900"
      font-size="16" opacity="0.45" letter-spacing="3">MINHA FIGURINHA 2026 • MINHA FIGURINHA 2026</text>`
  ).join('\n')

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <g transform="rotate(-35, ${width / 2}, ${height / 2})">${lines}</g>
  </svg>`

  return sharp(imageBuffer)
    .composite([{ input: Buffer.from(svg), blend: 'over' }])
    .png()
    .toBuffer()
}
