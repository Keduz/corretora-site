import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import ConditionalShell from '@/components/ConditionalShell'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Jeova Guedes | Corretor de Imoveis - Porto de Sauipe, BA',
  description:
    'Os melhores precos e as melhores oportunidades em imoveis no litoral da Bahia. Compra, venda e aluguel com Jeova Guedes Corretor de Imoveis.',
  keywords:
    'jeova guedes, corretor de imoveis, porto de sauipe, imoveis bahia, litoral norte bahia, casa praia bahia, apartamento salvador',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Jeova Guedes | Corretor de Imoveis',
    description: 'Os melhores precos e as melhores oportunidades em imoveis no litoral da Bahia.',
    type: 'website',
    locale: 'pt_BR',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jeova Guedes - Corretor de Imoveis',
      },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        <Providers>
          <ConditionalShell>
            {children}
          </ConditionalShell>
        </Providers>
      </body>
    </html>
  )
}
