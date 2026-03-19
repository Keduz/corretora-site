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
  metadataBase: new URL('https://corretora-site.vercel.app'),
  title: 'Jeov\u00e1 Guedes Im\u00f3veis | Seu Para\u00edso no Litoral da Bahia',
  description:
    'Im\u00f3veis premium em Porto de Sau\u00edpe e Costa dos Coqueiros. Assessoria exclusiva e personalizada para encontrar o im\u00f3vel dos seus sonhos no litoral norte da Bahia.',
  keywords:
    'jeov\u00e1 guedes, corretor de im\u00f3veis, porto de sau\u00edpe, im\u00f3veis bahia, litoral norte bahia, casa praia bahia, apartamento salvador, costa dos coqueiros, im\u00f3veis premium bahia',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Jeov\u00e1 Guedes | Im\u00f3veis Premium \u2022 Litoral da Bahia',
    description: 'Seu pr\u00f3ximo endere\u00e7o no para\u00edso baiano come\u00e7a aqui. Especialista em im\u00f3veis de alto padr\u00e3o em Porto de Sau\u00edpe e Costa dos Coqueiros.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Jeov\u00e1 Guedes Im\u00f3veis',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jeov\u00e1 Guedes - Im\u00f3veis Premium no Litoral da Bahia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jeov\u00e1 Guedes | Im\u00f3veis Premium \u2022 Litoral da Bahia',
    description: 'Seu pr\u00f3ximo endere\u00e7o no para\u00edso baiano come\u00e7a aqui.',
    images: ['/og-image.png'],
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
