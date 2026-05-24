import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { figurinhaStore } from '../generate/store'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

// ─────────────────────────────────────────────
// POST — create Stripe Checkout Session
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { figurinhaId } = await req.json()
    if (!figurinhaId) {
      return NextResponse.json({ error: 'figurinhaId required' }, { status: 400 })
    }

    const origin =
      req.headers.get('origin') ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      locale: 'pt-BR',
      line_items: [
        {
          price_data: {
            currency: 'brl',
            unit_amount: 990, // R$9,90
            product_data: {
              name: "Figurinha Personalizada Copa 2026 — sem marca d'água",
              description:
                'Figurinha no estilo Panini, alta resolução (400×560px), download imediato em PNG.',
            },
          },
          quantity: 1,
        },
      ],
      metadata: { figurinhaId },
      success_url: `${origin}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}/preview?id=${figurinhaId}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ─────────────────────────────────────────────
// GET — verify session and return figurinha data
// ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const sessionId = new URL(req.url).searchParams.get('session_id')
  if (!sessionId) {
    return NextResponse.json({ error: 'session_id required' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ paid: false })
    }

    const figurinhaId = session.metadata?.figurinhaId
    if (!figurinhaId) return NextResponse.json({ paid: false })

    const record = figurinhaStore.get(figurinhaId)
    if (!record) return NextResponse.json({ paid: false })

    // Mark as paid if webhook hasn't fired yet (race condition safety)
    if (!record.paid) {
      figurinhaStore.set(figurinhaId, { ...record, paid: true })
    }

    return NextResponse.json({
      paid:     true,
      name:     record.name,
      cleanUrl: record.cleanUrl,
    })
  } catch (err: any) {
    console.error('Verify error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
