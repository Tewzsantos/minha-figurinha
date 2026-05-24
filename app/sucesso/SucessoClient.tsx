'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface SuccessData {
  name: string
  cleanUrl: string
  paid: boolean
}

export default function SucessoClient() {
  const params = useSearchParams()
  const router = useRouter()
  const sessionId = params.get('session_id')

  const [data, setData] = useState<SuccessData | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (!sessionId) { router.replace('/'); return }

    fetch(`/api/checkout?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.paid) { router.replace('/'); return }
        setData(d)
        setLoading(false)
      })
      .catch(() => router.replace('/'))
  }, [sessionId])

  const handleDownload = async () => {
    if (!data?.cleanUrl) return
    setDownloading(true)
    try {
      const res = await fetch(data.cleanUrl)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `minha-figurinha-${data.name.replace(/\s+/g, '-').toLowerCase()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F9F9F9] pb-20">
        <div className="max-w-lg mx-auto px-5 pt-10">

          {/* ── Loading ── */}
          {loading && (
            <div className="text-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-verde border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-500">Verificando seu pagamento...</p>
            </div>
          )}

          {/* ── Success ── */}
          {!loading && data && (
            <div className="anim-fade-up text-center">
              <div className="text-7xl mb-4">🎉</div>
              <span className="inline-block bg-verde/10 text-verde text-xs font-black px-4 py-1.5 rounded-full tracking-widest uppercase mb-4">
                Pagamento confirmado!
              </span>
              <h1 className="font-bebas text-4xl text-azul tracking-wide mb-2">
                Sua figurinha está pronta!
              </h1>
              <p className="text-gray-500 text-sm mb-10">
                Parabéns, {data.name.split(' ')[0]}! Aqui está sua figurinha sem marca d&apos;água.
              </p>

              {/* Figurinha limpa */}
              <div className="flex justify-center mb-8">
                <div className="figurinha-shadow rounded-2xl overflow-hidden">
                  <img
                    src={data.cleanUrl}
                    alt="Sua figurinha"
                    style={{ maxWidth: 280, width: '100%', display: 'block' }}
                  />
                </div>
              </div>

              {/* Download */}
              <button
                className="btn-primary text-xl mb-4"
                style={{ borderRadius: 50, maxWidth: 380, margin: '0 auto 12px' }}
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading ? (
                  <>
                    <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    Baixando...
                  </>
                ) : (
                  '⬇️ Baixar minha figurinha (PNG)'
                )}
              </button>
              <p className="text-gray-400 text-xs mb-10">
                Resolução 400×560px · Pronto para impressão
              </p>

              {/* Share prompt */}
              <div className="bg-azul/5 border border-azul/10 rounded-2xl p-6 mb-8">
                <p className="text-azul font-bold mb-2">Compartilhe com seus amigos! 🇧🇷</p>
                <p className="text-gray-500 text-sm">
                  Mostre sua figurinha da Copa e indique{' '}
                  <span className="text-verde font-bold">minhafigurinha.com.br</span> para eles também criarem!
                </p>
              </div>

              <Link
                href="/criar"
                className="text-verde hover:text-verde-escuro font-semibold text-sm transition-colors"
              >
                Criar outra figurinha →
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
