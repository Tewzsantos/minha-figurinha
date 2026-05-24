'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <>
      <div className="stripe-br" />
      <nav className="bg-azul sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-amarelo font-bebas text-2xl tracking-wide">
              Minha <span className="text-white">Figurinha</span>
            </span>
            <span className="bg-amarelo text-azul text-[10px] font-black px-2 py-0.5 rounded-full tracking-wider">
              2026
            </span>
          </Link>
          <Link
            href="/criar"
            className="bg-verde hover:bg-verde-escuro text-white font-bold text-sm px-5 py-2.5 rounded-full transition-all duration-200 hidden sm:block"
            style={{ minHeight: 40 }}
          >
            Criar agora →
          </Link>
        </div>
      </nav>
    </>
  )
}
