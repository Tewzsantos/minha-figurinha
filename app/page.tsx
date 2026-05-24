import Link from 'next/link'
import Navbar from '@/components/Navbar'
import FigurinhaCard from '@/components/FigurinhaCard'
import AnimatedCounter from '@/components/AnimatedCounter'

export default function HomePage() {
  const examples = [
    {
      name: 'Helena',
      birthDate: '15-3-2018',
      height: '1,32m',
      weight: '28',
      club: 'Flamengo (BRA)',
      number: 10,
      country: 'BRA',
      countryFlag: '🇧🇷',
      bgClass: 'anim-float-1',
    },
    {
      name: 'Miguel',
      birthDate: '8-7-2016',
      height: '1,45m',
      weight: '35',
      club: 'Corinthians (BRA)',
      number: 7,
      country: 'BRA',
      countryFlag: '🇧🇷',
      bgClass: 'anim-float-2',
    },
    {
      name: 'Arthur',
      birthDate: '22-1-2019',
      height: '1,28m',
      weight: '25',
      club: 'Palmeiras (BRA)',
      number: 9,
      country: 'BRA',
      countryFlag: '🇧🇷',
      bgClass: 'anim-float-3',
    },
  ]

  const steps = [
    {
      emoji: '📸',
      step: '01',
      title: 'Envie sua foto e dados',
      desc: 'Preencha nome, data de nascimento, altura, peso e time do coração.',
    },
    {
      emoji: '🎨',
      step: '02',
      title: 'Veja sua figurinha',
      desc: 'A IA gera sua figurinha personalizada na hora, no estilo Panini oficial.',
    },
    {
      emoji: '💳',
      step: '03',
      title: 'Pague e baixe',
      desc: "Por apenas R$9,90 você baixa sem marca d'água, em alta resolução.",
    },
  ]

  return (
    <>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="bg-azul relative overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amarelo/5 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-verde/10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-5 py-16 md:py-24 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 bg-amarelo text-azul text-xs font-black px-4 py-1.5 rounded-full tracking-widest uppercase mb-6 anim-fade-up">
            ⚽ Copa do Mundo 2026
          </span>

          <h1 className="font-bebas text-5xl sm:text-6xl md:text-7xl text-white leading-tight tracking-wide mb-5 anim-fade-up-1">
            Transforme você (ou seu filho)<br />
            em uma{' '}
            <span className="text-amarelo">figurinha</span>
            <br />da Copa do Mundo 2026!
          </h1>

          <p className="text-white/75 text-lg md:text-xl max-w-xl mb-10 anim-fade-up-2 leading-relaxed">
            Crie uma figurinha exclusiva e personalizada no estilo Panini.
            Veja o resultado antes de pagar.
          </p>

          <div className="anim-fade-up-3">
            <Link
              href="/criar"
              className="btn-primary inline-flex items-center gap-2 px-10 text-xl"
              style={{ minWidth: 280, minHeight: 60, borderRadius: 50 }}
            >
              Criar minha figurinha agora →
            </Link>
            <p className="text-white/55 text-sm mt-4">
              ✅ Mais de{' '}
              <span className="text-amarelo font-bold">2.500 figurinhas</span>{' '}
              já criadas!
            </p>
          </div>
        </div>
      </section>

      {/* ── EXAMPLE CARDS ────────────────────────────── */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-verde font-bold text-xs tracking-widest uppercase mb-2">
            Exemplos reais
          </p>
          <h2 className="font-bebas text-4xl md:text-5xl text-azul mb-14 tracking-wide">
            Veja como fica incrível!
          </h2>

          <div className="flex items-end justify-center gap-6 md:gap-10 flex-wrap">
            {examples.map((ex, i) => (
              <div key={ex.name} className={ex.bgClass}>
                <FigurinhaCard
                  name={ex.name}
                  birthDate={ex.birthDate}
                  height={ex.height}
                  weight={ex.weight}
                  club={ex.club}
                  number={ex.number}
                  country={ex.country}
                  countryFlag={ex.countryFlag}
                />
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/criar"
              className="btn-primary inline-flex items-center gap-2 px-10"
              style={{ maxWidth: 340, borderRadius: 50, fontSize: 17 }}
            >
              Quero a minha! ⚽
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section className="bg-azul py-20 px-5">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-amarelo font-bold text-xs tracking-widest uppercase mb-2">
            Simples e rápido
          </p>
          <h2 className="font-bebas text-4xl md:text-5xl text-white mb-14 tracking-wide">
            Como funciona?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div
                key={s.step}
                className="bg-white/8 border border-white/12 rounded-2xl p-8 text-center hover:bg-white/13 transition-colors"
              >
                <div className="text-5xl mb-4">{s.emoji}</div>
                <div className="text-amarelo font-black text-xs tracking-widest uppercase mb-3">
                  Passo {s.step}
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{s.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/criar"
              className="btn-primary inline-flex items-center gap-2 px-10"
              style={{ maxWidth: 340, borderRadius: 50, fontSize: 17 }}
            >
              Começar agora →
            </Link>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ─────────────────────────────── */}
      <section className="bg-white py-20 px-5 border-y border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-azul rounded-2xl px-16 py-10 mb-8">
            <AnimatedCounter
              target={2500}
              className="font-bebas text-7xl text-amarelo block tracking-widest"
            />
            <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mt-1">
              figurinhas já criadas 🏆
            </p>
          </div>

          <p className="text-gray-500 text-sm mb-6">
            Crianças e adultos do Brasil e do mundo todo já têm a sua!
          </p>

          <div className="flex justify-center items-center gap-3 flex-wrap text-4xl">
            {['🇧🇷', '🇦🇷', '🇫🇷', '🇩🇪', '🇪🇸', '🇵🇹', '🇺🇸', '🇲🇽', '🇯🇵'].map((f) => (
              <span key={f} className="hover:scale-125 transition-transform cursor-default">{f}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────── */}
      <section className="py-20 px-5 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-verde font-bold text-xs tracking-widest uppercase mb-2">
            Oferta especial
          </p>
          <h2 className="font-bebas text-4xl md:text-5xl text-azul mb-10 tracking-wide">
            Preço único
          </h2>

          <div className="bg-white border-2 border-verde rounded-2xl px-8 py-10 relative shadow-xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amarelo text-azul text-xs font-black px-5 py-1.5 rounded-full whitespace-nowrap tracking-wide">
              🔥 Mais popular
            </div>

            <div className="font-bebas text-8xl text-verde tracking-wider leading-none mt-2">
              <sup className="text-3xl align-top mt-6 inline-block font-poppins font-black">R$</sup>
              9
              <span className="text-5xl">,90</span>
            </div>
            <p className="text-gray-400 text-sm mb-8 mt-1">Pagamento único · Acesso imediato</p>

            <ul className="text-left space-y-3 mb-8">
              {[
                'Figurinha em alta resolução (300 dpi)',
                'Sem marca d\'água',
                'Download imediato em PNG e PDF',
                'Pronto para imprimir e colar',
                'Suporte por WhatsApp',
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-gray-700 text-sm">
                  <span className="text-verde text-lg">✅</span>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/criar"
              className="btn-primary"
              style={{ borderRadius: 50, fontSize: 17 }}
            >
              Criar minha figurinha agora →
            </Link>
            <p className="text-gray-400 text-xs mt-4">
              Veja o resultado antes de pagar 🔒
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section className="py-16 px-5 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-bebas text-3xl text-azul text-center mb-10 tracking-wide">
            Perguntas frequentes
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Quanto tempo leva para gerar a figurinha?',
                a: 'Em geral menos de 30 segundos. Nossa IA processa sua foto instantaneamente.',
              },
              {
                q: 'Posso ver antes de pagar?',
                a: 'Sim! Você vê a figurinha com marca d\'água antes de qualquer cobrança.',
              },
              {
                q: 'Qual tamanho de arquivo vou receber?',
                a: 'Um PNG em alta resolução (400×560px, 300dpi), pronto para impressão.',
              },
              {
                q: 'Posso fazer para adultos também?',
                a: 'Claro! Qualquer pessoa pode ter sua figurinha da Copa 2026.',
              },
            ].map((item) => (
              <details key={item.q} className="border border-gray-200 rounded-xl p-4 group cursor-pointer">
                <summary className="font-semibold text-gray-800 flex justify-between items-center">
                  {item.q}
                  <span className="text-verde group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="bg-azul py-8 px-5 text-center">
        <p className="text-white/50 text-sm mb-3">
          © 2026 Minha Figurinha. Todos os direitos reservados.
        </p>
        <div className="flex justify-center gap-6 flex-wrap">
          {['Termos de Uso', 'Política de Privacidade', 'Contato'].map((l) => (
            <a key={l} href="#" className="text-white/45 hover:text-amarelo text-sm transition-colors">
              {l}
            </a>
          ))}
        </div>
      </footer>
      <div className="stripe-br" />
    </>
  )
}
