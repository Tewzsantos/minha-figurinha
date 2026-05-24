'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

interface FormData {
  nome: string
  sobrenome: string
  dia: string
  mes: string
  ano: string
  altura: string
  peso: string
  time: string
  fotoFile: File | null
  fotoPreview: string | null
}

const TIMES_BRASILEIROS = [
  'Flamengo', 'Corinthians', 'Palmeiras', 'São Paulo', 'Santos',
  'Grêmio', 'Internacional', 'Atlético-MG', 'Cruzeiro', 'Botafogo',
  'Vasco', 'Fluminense', 'Bahia', 'Ceará', 'Fortaleza',
  'Athletico-PR', 'Coritiba', 'Goiás', 'Sport', 'Outro',
]

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const TOTAL_STEPS = 5

export default function CriarPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [data, setData] = useState<FormData>({
    nome: '', sobrenome: '',
    dia: '', mes: '', ano: '',
    altura: '', peso: '',
    time: '',
    fotoFile: null, fotoPreview: null,
  })

  const update = (key: keyof FormData, value: string | File | null) =>
    setData((d) => ({ ...d, [key]: value }))

  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100

  const canAdvance = () => {
    if (step === 1) return data.nome.trim().length > 0 && data.sobrenome.trim().length > 0
    if (step === 2) return data.dia && data.mes && data.ano
    if (step === 3) return data.altura.trim().length > 0 && data.peso.trim().length > 0
    if (step === 4) return data.time.trim().length > 0
    if (step === 5) return data.fotoFile !== null
    return false
  }

  const handleFile = (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Formato inválido. Use JPG, PNG ou WEBP.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 10MB.')
      return
    }
    setError('')
    const reader = new FileReader()
    reader.onload = (e) => {
      update('fotoPreview', e.target?.result as string)
    }
    reader.readAsDataURL(file)
    update('fotoFile', file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const handleSubmit = async () => {
    if (!data.fotoFile) return
    setIsLoading(true)
    setError('')

    try {
      const formDataObj = new FormData()
      formDataObj.append('foto', data.fotoFile)
      formDataObj.append('nome', `${data.nome} ${data.sobrenome}`)
      formDataObj.append('birthDate', `${data.dia}-${data.mes}-${data.ano}`)
      const alturaFormatted = `${(parseInt(data.altura) / 100).toFixed(2).replace('.', ',')}m`
      formDataObj.append('altura', alturaFormatted)
      formDataObj.append('peso', data.peso)
      formDataObj.append('clube', data.time)

      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formDataObj,
      })

      if (!res.ok) throw new Error('Erro ao gerar figurinha')

      const json = await res.json()
      router.push(`/preview?id=${json.id}`)
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.')
      setIsLoading(false)
    }
  }

  const dias = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))
  const anos = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i))

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#F9F9F9] pb-20">
        <div className="max-w-lg mx-auto px-5 pt-8">

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Etapa {step} de {TOTAL_STEPS}
              </span>
              <span className="text-xs font-bold text-verde">
                {Math.round((step / TOTAL_STEPS) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-verde rounded-full progress-bar"
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              />
            </div>
          </div>

          {/* Step panels */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">

            {/* ── STEP 1: Nome ── */}
            {step === 1 && (
              <div className="anim-fade-up">
                <div className="text-4xl mb-4">🏟️</div>
                <h2 className="font-bebas text-3xl text-azul tracking-wide mb-1">
                  Qual é o nome do craque?
                </h2>
                <p className="text-gray-400 text-sm mb-8">Esse nome vai aparecer em destaque na figurinha.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Nome</label>
                    <input
                      className="input-base"
                      placeholder="Ex: Gabriel"
                      value={data.nome}
                      onChange={(e) => update('nome', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && canAdvance() && setStep(2)}
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Sobrenome</label>
                    <input
                      className="input-base"
                      placeholder="Ex: Silva"
                      value={data.sobrenome}
                      onChange={(e) => update('sobrenome', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && canAdvance() && setStep(2)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: Data ── */}
            {step === 2 && (
              <div className="anim-fade-up">
                <div className="text-4xl mb-4">🎂</div>
                <h2 className="font-bebas text-3xl text-azul tracking-wide mb-1">
                  Quando nasceu o craque?
                </h2>
                <p className="text-gray-400 text-sm mb-8">Vai aparecer nas estatísticas da figurinha.</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Dia</label>
                    <select className="input-base" value={data.dia} onChange={(e) => update('dia', e.target.value)}>
                      <option value="">--</option>
                      {dias.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Mês</label>
                    <select className="input-base" value={data.mes} onChange={(e) => update('mes', e.target.value)}>
                      <option value="">--</option>
                      {MESES.map((m, i) => <option key={m} value={String(i + 1)}>{m.slice(0, 3)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Ano</label>
                    <select className="input-base" value={data.ano} onChange={(e) => update('ano', e.target.value)}>
                      <option value="">----</option>
                      {anos.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>
                {data.dia && data.mes && data.ano && (
                  <p className="mt-4 text-verde text-sm font-semibold">
                    ✅ {data.dia}/{data.mes}/{data.ano}
                  </p>
                )}
              </div>
            )}

            {/* ── STEP 3: Altura e Peso ── */}
            {step === 3 && (
              <div className="anim-fade-up">
                <div className="text-4xl mb-4">📏</div>
                <h2 className="font-bebas text-3xl text-azul tracking-wide mb-1">
                  Qual a altura e peso?
                </h2>
                <p className="text-gray-400 text-sm mb-8">Dados que aparecem nas estatísticas da figurinha.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Altura (cm)</label>
                    <input
                      className="input-base"
                      type="number"
                      placeholder="Ex: 175"
                      value={data.altura}
                      onChange={(e) => update('altura', e.target.value)}
                      min={50} max={250}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Peso (kg)</label>
                    <input
                      className="input-base"
                      type="number"
                      placeholder="Ex: 70"
                      value={data.peso}
                      onChange={(e) => update('peso', e.target.value)}
                      min={2} max={300}
                    />
                  </div>
                </div>
                {data.altura && data.peso && (
                  <div className="mt-4 bg-green-50 border border-verde/20 rounded-xl p-3">
                    <p className="text-verde text-sm font-semibold">
                      ✅ Ficará assim na figurinha:{' '}
                      <span className="font-black">
                        {(parseInt(data.altura) / 100).toFixed(2).replace('.', ',')}m | {data.peso} kg
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 4: Time ── */}
            {step === 4 && (
              <div className="anim-fade-up">
                <div className="text-4xl mb-4">⚽</div>
                <h2 className="font-bebas text-3xl text-azul tracking-wide mb-1">
                  Qual é o time do coração?
                </h2>
                <p className="text-gray-400 text-sm mb-8">Aparece no rodapé da figurinha como "clube".</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {TIMES_BRASILEIROS.slice(0, 12).map((t) => (
                    <button
                      key={t}
                      onClick={() => update('time', t)}
                      className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                        data.time === t
                          ? 'border-verde bg-verde text-white'
                          : 'border-gray-200 text-gray-600 hover:border-verde hover:text-verde bg-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Ou digite outro time</label>
                  <input
                    className="input-base"
                    placeholder="Ex: Real Madrid, PSG..."
                    value={data.time}
                    onChange={(e) => update('time', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* ── STEP 5: Foto ── */}
            {step === 5 && (
              <div className="anim-fade-up">
                <div className="text-4xl mb-4">📸</div>
                <h2 className="font-bebas text-3xl text-azul tracking-wide mb-1">
                  Agora envie a foto do craque!
                </h2>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Use uma foto de rosto, com boa iluminação, fundo limpo e sem óculos escuros.
                </p>

                {!data.fotoPreview ? (
                  <div
                    className={`upload-area ${isDragging ? 'drag-over' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                  >
                    <div className="text-5xl mb-4">🖼️</div>
                    <p className="font-bold text-gray-700 mb-1">Clique para selecionar ou arraste aqui</p>
                    <p className="text-gray-400 text-sm">JPG, PNG, WEBP · até 10MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={data.fotoPreview}
                      alt="Preview"
                      className="w-full max-h-72 object-cover rounded-2xl border-2 border-verde"
                    />
                    <button
                      onClick={() => { update('fotoFile', null); update('fotoPreview', null) }}
                      className="absolute top-3 right-3 bg-white/90 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-lg shadow hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                    <div className="mt-3 bg-green-50 border border-verde/20 rounded-xl p-3">
                      <p className="text-verde text-sm font-semibold">✅ Foto carregada com sucesso!</p>
                    </div>
                  </div>
                )}

                {error && (
                  <p className="mt-3 text-red-500 text-sm font-medium">{error}</p>
                )}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-8 flex flex-col gap-3">
              {step < 5 ? (
                <button
                  className="btn-primary"
                  style={{ borderRadius: 14, opacity: canAdvance() ? 1 : 0.5 }}
                  disabled={!canAdvance()}
                  onClick={() => setStep((s) => s + 1)}
                >
                  Continuar →
                </button>
              ) : (
                <button
                  className="btn-primary"
                  style={{
                    borderRadius: 14,
                    opacity: canAdvance() && !isLoading ? 1 : 0.5,
                    fontSize: 18,
                  }}
                  disabled={!canAdvance() || isLoading}
                  onClick={handleSubmit}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Gerando sua figurinha...
                    </>
                  ) : (
                    'Gerar minha figurinha! 🎴'
                  )}
                </button>
              )}

              {step > 1 && (
                <button
                  className="text-gray-400 hover:text-gray-600 text-sm py-2 transition-colors"
                  onClick={() => setStep((s) => s - 1)}
                >
                  ← Voltar
                </button>
              )}
            </div>
          </div>

          {/* Summary preview */}
          {(data.nome || data.time) && (
            <div className="mt-6 bg-white rounded-xl border border-gray-100 p-4 text-sm text-gray-500 shadow-sm">
              <p className="font-bold text-gray-700 mb-2 text-xs uppercase tracking-wide">Sua figurinha até agora:</p>
              <div className="flex flex-wrap gap-2">
                {data.nome && (
                  <span className="bg-azul/10 text-azul px-2 py-1 rounded-lg text-xs font-semibold">
                    👤 {data.nome} {data.sobrenome}
                  </span>
                )}
                {data.dia && (
                  <span className="bg-verde/10 text-verde-escuro px-2 py-1 rounded-lg text-xs font-semibold">
                    🎂 {data.dia}/{data.mes}/{data.ano}
                  </span>
                )}
                {data.altura && (
                  <span className="bg-amarelo/20 text-yellow-800 px-2 py-1 rounded-lg text-xs font-semibold">
                    📏 {data.altura}cm / {data.peso}kg
                  </span>
                )}
                {data.time && (
                  <span className="bg-verde/10 text-verde-escuro px-2 py-1 rounded-lg text-xs font-semibold">
                    ⚽ {data.time}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
