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
  title: 'Corretora de Imoveis | Salvador, Feira de Santana e Alagoinhas - BA',
  description:
    'Encontre o imovel dos seus sonhos na Bahia. Compra, venda e aluguel com atendimento personalizado em Salvador, Feira de Santana e Alagoinhas.',
  keywords:
    'imoveis bahia, corretora salvador, apartamento feira de santana, casa alagoinhas, aluguel bahia, comprar imovel salvador',
  openGraph: {
    title: 'Corretora de Imoveis | Bahia',
    description: 'Compra, venda e aluguel com atendimento personalizado na Bahia.',
    type: 'website',
    locale: 'pt_BR',
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
