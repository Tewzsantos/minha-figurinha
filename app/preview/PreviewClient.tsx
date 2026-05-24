'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

interface FigurinhaData {
  id: string
  watermarkUrl: string
  name: string
  paid: boolean
}

const loadingMessages = [
  'Analisando sua foto... 📸',
  'Aplicando o estilo Panini... 🎨',
  'Adicionando nome e estatísticas... ✍️',
  'Finalizando sua figurinha... ✨',
]

export default function PreviewClient() {
  const params = useSearchParams()
  const router = useRouter()
  const id = params.get('id')

  const [data, setData] = useState<FigurinhaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [loadStep, setLoadStep] = useState(0)

  useEffect(() => {
    if (!id) { router.push('/'); return }

    const interval = setInterval(() => {
      setLoadStep((s) => Math.min(s + 1, loadingMessages.length - 1))
    }, 1200)

    fetch(`/api/generate?id=${id}`)
      .then((r) => r.json())
      .then((d) => {
        clearInterval(interval)
        if (d.error) { setError(d.error); setLoading(false); return }
        setData(d)
        setLoading(false)
      })
      .catch(() => {
        clearInterval(interval)
        setError('Erro ao carregar sua figurinha.')
        setLoading(false)
      })

    return () => clearInterval(interval)
  }, [id])

  const handleCheckout = async () => {
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ figurinhaId: id }),
      })
      const json = await res.json()
      if (json.url) window.location.href = json.url
      else throw new Error('No checkout URL')
    } catch {
      setError('Erro ao processar pagamento. Tente novamente.')
      setCheckoutLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#F9F9F9] pb-20">
        <div className="max-w-lg mx-auto px-5 pt-10">

          {/* ── Loading ── */}
          {loading && (
            <div className="text-center py-20 anim-fade-up">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-azul mb-6 mx-auto">
                <span className="text-3xl animate-bounce">🎴</span>
              </div>
              <h2 className="font-bebas text-3xl text-azul tracking-wide mb-2">
                Estamos criando sua figurinha... ✨
              </h2>
              <p className="text-gray-400 text-sm mb-10">Isso pode levar alguns segundos</p>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
                <div
                  className="h-full bg-verde rounded-full transition-all duration-700"
                  style={{ width: `${((loadStep + 1) / loadingMessages.length) * 100}%` }}
                />
              </div>

              <p className="text-azul font-semibold text-sm animate-pulse">
                {loadingMessages[loadStep]}
              </p>

              <div className="mt-10 mx-auto w-48 h-64 rounded-2xl shimmer" />
            </div>
          )}

          {/* ── Error ── */}
          {!loading && error && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">😢</div>
              <h2 className="font-bebas text-3xl text-red-500 mb-3">Ops! Algo deu errado</h2>
              <p className="text-gray-500 mb-8">{error}</p>
              <button
                onClick={() => router.push('/criar')}
                className="btn-primary"
                style={{ maxWidth: 260, margin: '0 auto', borderRadius: 50 }}
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* ── Preview ── */}
          {!loading && data && (
            <div className="anim-fade-up">
              <div className="text-center mb-6">
                <span className="inline-block bg-verde/10 text-verde text-xs font-black px-4 py-1.5 rounded-full tracking-widest uppercase mb-3">
                  Sua figurinha está pronta! 🎉
                </span>
                <h2 className="font-bebas text-3xl text-azul tracking-wide">
                  Veja como ficou, {data.name.split(' ')[0]}!
                </h2>
              </div>

              {/* Figurinha com marca d'água */}
              <div className="flex justify-center mb-4">
                <div className="relative figurinha-shadow">
                  <img
                    src={data.watermarkUrl}
                    alt="Sua figurinha"
                    className="rounded-2xl"
                    style={{ maxWidth: 280, width: '100%' }}
                  />
                </div>
              </div>

              <p className="text-center text-gray-400 text-xs mb-8">
                ☝️ Marca d&apos;água removida após pagamento
              </p>

              {/* CTA */}
              <div className="bg-white rounded-2xl border-2 border-verde p-6 shadow-lg">
                <div className="text-center mb-5">
                  <p className="font-bold text-gray-800 text-lg mb-1">
                    Gostou? Remova a marca d&apos;água por apenas
                  </p>
                  <div className="font-bebas text-5xl text-verde tracking-wider">
                    <sup className="text-xl align-top mt-2 inline-block font-poppins font-black">R$</sup>
                    9<span className="text-3xl">,90</span>
                  </div>
                </div>

                <button
                  className="btn-primary text-lg mb-4"
                  style={{ borderRadius: 50, fontSize: 18 }}
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? (
                    <>
                      <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Redirecionando...
                    </>
                  ) : (
                    '💳 Pagar R$9,90 e baixar'
                  )}
                </button>

                <p className="text-center text-gray-400 text-xs">
                  🔒 Pagamento seguro via Stripe · Acesso imediato após confirmação
                </p>

                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                  {['Alta resolução', 'Download imediato', 'Sem marca d\'água'].map((f) => (
                    <div key={f} className="text-xs text-gray-500">
                      <div className="text-verde text-lg mb-1">✅</div>
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={() => router.push('/criar')}
                  className="text-gray-400 hover:text-azul text-sm transition-colors"
                >
                  ← Criar uma nova figurinha
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
