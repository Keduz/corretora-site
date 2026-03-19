'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { openWhatsApp } from '@/utils/whatsapp'

const quickLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Imoveis', href: '/imoveis' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Servicos', href: '/servicos' },
  { label: 'Portais', href: '/portais' },
  { label: 'Contato', href: '/contato' },
]

const cities = [
  { label: 'Porto de Sauipe', href: '/imoveis?cidade=porto-de-sauipe' },
  { label: 'Salvador', href: '/imoveis?cidade=salvador' },
  { label: 'Feira de Santana', href: '/imoveis?cidade=feira-de-santana' },
  { label: 'Alagoinhas', href: '/imoveis?cidade=alagoinhas' },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
}

export default function Footer() {
  const pathname = usePathname()

  return (
    <footer className="bg-charcoal-900 text-sand-200">
      {/* Gold accent line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 md:px-10 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            custom={0}
            variants={fadeInUp}
            className="lg:col-span-1"
          >
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Jeová Guedes Imoveis"
                width={56}
                height={56}
                className="h-14 w-auto brightness-0 invert"
              />
              <span className="font-heading text-2xl font-bold text-gold-400 tracking-wide">
                Jeová Guedes
              </span>
            </Link>
            <p className="mt-4 text-sand-300 text-sm leading-relaxed max-w-xs">
              Corretor de Imoveis - Porto de Sauipe, BA
            </p>
            <div className="gold-divider mt-4" />
            <p className="mt-4 text-sand-400 text-xs leading-relaxed max-w-xs">
              Os melhores precos e as melhores oportunidades em imoveis no litoral da Bahia.
              Atendimento personalizado e exclusivo.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              {/* Instagram */}
              <a
                href="https://instagram.com/jeovacorretor"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-charcoal-600 flex items-center justify-center text-sand-300 hover:border-gold-400 hover:text-gold-400 transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-charcoal-600 flex items-center justify-center text-sand-300 hover:border-gold-400 hover:text-gold-400 transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <button
                type="button"
                onClick={() => openWhatsApp(pathname)}
                className="w-10 h-10 rounded-full border border-charcoal-600 flex items-center justify-center text-sand-300 hover:border-[#25D366] hover:text-[#25D366] transition-all duration-300 hover:scale-110"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            custom={1}
            variants={fadeInUp}
          >
            <h3 className="font-heading text-lg font-semibold text-gold-400 mb-6">
              Links Rapidos
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sand-300 text-sm hover:text-gold-400 transition-colors duration-300 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-charcoal-600 group-hover:bg-gold-400 transition-colors duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Cities */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            custom={2}
            variants={fadeInUp}
          >
            <h3 className="font-heading text-lg font-semibold text-gold-400 mb-6">
              Cidades
            </h3>
            <ul className="space-y-3">
              {cities.map((city) => (
                <li key={city.href}>
                  <Link
                    href={city.href}
                    className="text-sand-300 text-sm hover:text-gold-400 transition-colors duration-300 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-charcoal-600 group-hover:bg-gold-400 transition-colors duration-300" />
                    {city.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            custom={3}
            variants={fadeInUp}
          >
            <h3 className="font-heading text-lg font-semibold text-gold-400 mb-6">
              Contato
            </h3>
            <ul className="space-y-4">
              {/* Phone */}
              <li>
                <a
                  href="tel:+5571997106376"
                  className="text-sand-300 text-sm hover:text-gold-400 transition-colors duration-300 inline-flex items-start gap-3 group"
                >
                  <svg
                    className="w-4 h-4 mt-0.5 flex-shrink-0 text-charcoal-400 group-hover:text-gold-400 transition-colors duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                  <span>(71) 99710-6376</span>
                </a>
              </li>

              {/* Email */}
              <li>
                <a
                  href="mailto:contato@jeovaimoveis.com.br"
                  className="text-sand-300 text-sm hover:text-gold-400 transition-colors duration-300 inline-flex items-start gap-3 group"
                >
                  <svg
                    className="w-4 h-4 mt-0.5 flex-shrink-0 text-charcoal-400 group-hover:text-gold-400 transition-colors duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                  <span>contato@jeovaimoveis.com.br</span>
                </a>
              </li>

              {/* Instagram */}
              <li>
                <a
                  href="https://instagram.com/jeovacorretor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sand-300 text-sm hover:text-gold-400 transition-colors duration-300 inline-flex items-start gap-3 group"
                >
                  <svg
                    className="w-4 h-4 mt-0.5 flex-shrink-0 text-charcoal-400 group-hover:text-gold-400 transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  <span>@jeovacorretor</span>
                </a>
              </li>

              {/* Address */}
              <li className="text-sand-300 text-sm inline-flex items-start gap-3">
                <svg
                  className="w-4 h-4 mt-0.5 flex-shrink-0 text-charcoal-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z"
                  />
                </svg>
                <span>Rua Dois, Novo Porto, Porto de Sauipe<br />CEP 48190-800 - Entre Rios, BA</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-16 pt-8 border-t border-charcoal-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sand-400 text-xs text-center md:text-left">
              &copy; 2026 Jeová Guedes Corretor de Imoveis &bull; CRECI-BA 022-670. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacidade"
                className="text-sand-500 text-xs hover:text-gold-400 transition-colors duration-300"
              >
                Politica de Privacidade
              </Link>
              <Link
                href="/termos"
                className="text-sand-500 text-xs hover:text-gold-400 transition-colors duration-300"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
