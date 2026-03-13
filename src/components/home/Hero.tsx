'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const WHATSAPP_URL = 'https://wa.me/5571999999999'

function LuxuryPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.07]"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1200 800"
      aria-hidden="true"
    >
      {/* Geometric gold grid lines */}
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4A843" />
          <stop offset="100%" stopColor="#FFD166" />
        </linearGradient>
      </defs>

      {/* Diagonal grid pattern */}
      <line x1="0" y1="0" x2="400" y2="800" stroke="url(#goldGrad)" strokeWidth="1" />
      <line x1="200" y1="0" x2="600" y2="800" stroke="url(#goldGrad)" strokeWidth="1" />
      <line x1="400" y1="0" x2="800" y2="800" stroke="url(#goldGrad)" strokeWidth="1" />
      <line x1="600" y1="0" x2="1000" y2="800" stroke="url(#goldGrad)" strokeWidth="1" />
      <line x1="800" y1="0" x2="1200" y2="800" stroke="url(#goldGrad)" strokeWidth="1" />
      <line x1="1000" y1="0" x2="1200" y2="400" stroke="url(#goldGrad)" strokeWidth="1" />

      <line x1="400" y1="0" x2="0" y2="800" stroke="url(#goldGrad)" strokeWidth="1" />
      <line x1="600" y1="0" x2="200" y2="800" stroke="url(#goldGrad)" strokeWidth="1" />
      <line x1="800" y1="0" x2="400" y2="800" stroke="url(#goldGrad)" strokeWidth="1" />
      <line x1="1000" y1="0" x2="600" y2="800" stroke="url(#goldGrad)" strokeWidth="1" />
      <line x1="1200" y1="0" x2="800" y2="800" stroke="url(#goldGrad)" strokeWidth="1" />

      {/* Abstract house silhouette */}
      <g transform="translate(750, 200)" stroke="url(#goldGrad)" strokeWidth="1.5" fill="none">
        {/* Roof */}
        <polyline points="0,120 100,40 200,120" />
        {/* Chimney */}
        <line x1="155" y1="68" x2="155" y2="40" />
        <line x1="155" y1="40" x2="175" y2="40" />
        <line x1="175" y1="40" x2="175" y2="85" />
        {/* Body */}
        <rect x="20" y="120" width="160" height="120" />
        {/* Door */}
        <rect x="80" y="170" width="40" height="70" />
        <circle cx="112" cy="208" r="3" />
        {/* Windows */}
        <rect x="35" y="140" width="35" height="30" />
        <line x1="52.5" y1="140" x2="52.5" y2="170" />
        <line x1="35" y1="155" x2="70" y2="155" />
        <rect x="130" y="140" width="35" height="30" />
        <line x1="147.5" y1="140" x2="147.5" y2="170" />
        <line x1="130" y1="155" x2="165" y2="155" />
      </g>

      {/* Architectural detail: columns */}
      <g transform="translate(100, 350)" stroke="url(#goldGrad)" strokeWidth="1" fill="none">
        <rect x="0" y="0" width="30" height="150" />
        <rect x="-5" y="-8" width="40" height="8" rx="2" />
        <rect x="-5" y="150" width="40" height="8" rx="2" />
        <rect x="70" y="0" width="30" height="150" />
        <rect x="65" y="-8" width="40" height="8" rx="2" />
        <rect x="65" y="150" width="40" height="8" rx="2" />
        <line x1="-5" y1="-16" x2="105" y2="-16" />
        <line x1="-5" y1="-20" x2="105" y2="-20" />
      </g>

      {/* Diamond accents */}
      <g stroke="url(#goldGrad)" strokeWidth="1" fill="none">
        <polygon points="1050,100 1070,120 1050,140 1030,120" />
        <polygon points="150,150 165,165 150,180 135,165" />
        <polygon points="950,500 965,515 950,530 935,515" />
        <polygon points="300,600 315,615 300,630 285,615" />
      </g>

      {/* Circular ornaments */}
      <circle cx="500" cy="100" r="40" stroke="url(#goldGrad)" strokeWidth="1" fill="none" />
      <circle cx="500" cy="100" r="30" stroke="url(#goldGrad)" strokeWidth="0.5" fill="none" />
      <circle cx="1100" cy="650" r="50" stroke="url(#goldGrad)" strokeWidth="1" fill="none" />
      <circle cx="1100" cy="650" r="35" stroke="url(#goldGrad)" strokeWidth="0.5" fill="none" />
    </svg>
  )
}

function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1 }}
    >
      <span className="text-sand-300 text-xs tracking-[0.2em] uppercase">Scroll</span>
      <motion.div
        className="w-[1px] h-8 bg-gradient-to-b from-gold-400 to-transparent"
        animate={{ scaleY: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3 + i * 0.2,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal-900">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900 via-charcoal-800/90 to-charcoal-900" />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,67,0.08)_0%,transparent_70%)]" />

      {/* Decorative SVG pattern */}
      <LuxuryPattern />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-10 text-center">
        {/* Gold accent line */}
        <motion.div
          className="mx-auto w-16 h-[2px] rounded-full mb-8"
          style={{ background: 'linear-gradient(90deg, #D4A843, #FFD166)' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Headline */}
        <motion.h1
          className="font-heading text-4xl md:text-6xl lg:text-7xl text-white leading-tight tracking-tight"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          Encontre o im&oacute;vel dos seus
          <span className="block mt-2 bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
            sonhos na Bahia
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mt-6 text-sand-200 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          Compra, venda e aluguel com atendimento personalizado em Salvador,
          Feira de Santana e Alagoinhas
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Falar no WhatsApp
          </a>
          <Link
            href="/imoveis"
            className="btn-outline !border-white !text-white hover:!bg-white hover:!text-charcoal-900"
          >
            Ver Im&oacute;veis
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  )
}
