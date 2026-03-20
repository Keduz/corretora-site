'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { properties, formatPrice } from '@/data/properties'

const featured = properties.filter((p) => p.featured && p.status === 'ativo')

export default function Modelo5() {
  const [idx, setIdx] = useState(0)

  const next = useCallback(() => setIdx((i) => (i + 1) % featured.length), [])

  useEffect(() => {
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [next])

  const p = featured[idx]
  const nextP = featured[(idx + 1) % featured.length]
  const prevP = featured[(idx - 1 + featured.length) % featured.length]

  return (
    <div className="min-h-screen bg-charcoal-900 overflow-hidden">
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={44} height={44} className="h-11 w-auto brightness-0 invert drop-shadow-lg" />
            <div>
              <span className="font-heading text-lg font-bold text-white drop-shadow-lg">Jeova Guedes</span>
              <span className="block text-[9px] uppercase tracking-[0.2em] text-white/60">Imoveis Premium</span>
            </div>
          </div>
          <div className="bg-black/30 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-3">
            <svg className="w-3.5 h-3.5 text-olive-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span className="text-[11px] font-bold text-white tracking-wider">CRECI-BA 022-670</span>
          </div>
        </div>
      </div>

      {/* Full screen image gallery */}
      <div className="relative h-screen">
        {/* Background - full bleed image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

        {/* Side preview cards */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.05, x: -4 }}
            onClick={() => setIdx((idx - 1 + featured.length) % featured.length)}
            className="w-20 h-14 rounded-xl overflow-hidden border-2 border-white/20 opacity-50 hover:opacity-90 transition-opacity shadow-lg"
          >
            <img src={prevP.images[0]} alt="" className="w-full h-full object-cover" />
          </motion.button>
          <div className="w-20 h-14 rounded-xl overflow-hidden border-2 border-olive-400 shadow-lg shadow-olive-500/20">
            <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
          </div>
          <motion.button
            whileHover={{ scale: 1.05, x: -4 }}
            onClick={() => setIdx((idx + 1) % featured.length)}
            className="w-20 h-14 rounded-xl overflow-hidden border-2 border-white/20 opacity-50 hover:opacity-90 transition-opacity shadow-lg"
          >
            <img src={nextP.images[0]} alt="" className="w-full h-full object-cover" />
          </motion.button>
        </div>

        {/* Content - bottom left */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-10 pb-16">
          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 40 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="h-0.5 bg-olive-400"
                  />
                  <span className="text-olive-400 text-xs font-bold uppercase tracking-[0.3em]">
                    {p.type}
                  </span>
                </div>

                <h1 className="font-heading text-5xl lg:text-6xl font-bold text-white mb-3 leading-[1.05]">
                  {p.title}
                </h1>

                <p className="text-white/50 text-base mb-6">{p.neighborhood}, {p.city}</p>

                <div className="flex items-center gap-8 mb-6">
                  <span className="text-gold-400 font-heading text-3xl font-bold">
                    {formatPrice(p.price, p.transaction)}
                  </span>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="flex items-center gap-5 text-white/50 text-sm">
                    <span>{p.bedrooms} Quartos</span>
                    <span>{p.bathrooms} Banheiros</span>
                    <span>{p.area}m²</span>
                    <span>{p.parking} Vagas</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  {featured.map((_, i) => (
                    <button key={i} onClick={() => setIdx(i)} className="flex-1 h-0.5 rounded-full overflow-hidden bg-white/10">
                      {i === idx && (
                        <motion.div
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 5, ease: 'linear' }}
                          className="h-full bg-olive-400 rounded-full"
                        />
                      )}
                      {i < idx && <div className="h-full w-full bg-olive-400/40 rounded-full" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <p className="absolute bottom-2 right-4 text-charcoal-600 text-xs z-30">Modelo 5 — Fullscreen cinematic com side previews</p>
    </div>
  )
}
