import type { Metadata } from 'next'
import { Poppins, Bebas_Neue, Inter } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Minha Figurinha da Copa 2026 | Crie a sua agora!',
  description:
    'Crie uma figurinha exclusiva e personalizada no estilo Panini Copa do Mundo 2026. Veja o resultado antes de pagar. Mais de 2.500 figurinhas criadas!',
  openGraph: {
    title: 'Minha Figurinha da Copa 2026',
    description: 'Transforme você ou seu filho em uma figurinha da Copa!',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${bebasNeue.variable} ${inter.variable}`}>
      <body className="font-poppins bg-[#F9F9F9] text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
