'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { properties, formatPrice } from '@/data/properties'

const featured = properties.filter((p) => p.featured && p.status === 'ativo')

export default function Modelo2() {
  const [idx, setIdx] = useState(0)

  const next = useCallback(() => setIdx((i) => (i + 1) % featured.length), [])

  useEffect(() => {
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [next])

  const p = featured[idx]

  return (
    <div className="min-h-screen bg-charcoal-900 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        {/* Header with logo + CRECI */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={48} height={48} className="h-12 w-auto brightness-0 invert" />
            <div>
              <span className="font-heading text-lg font-bold text-white">Jeova Guedes</span>
              <span className="block text-[10px] uppercase tracking-[0.15em] text-olive-400 font-medium">Corretor de Imoveis</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-olive-500/30 bg-olive-500/10">
            <svg className="w-4 h-4 text-olive-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span className="text-xs font-semibold text-olive-400 tracking-wider">CRECI-BA 022-670</span>
          </div>
        </div>

        {/* Banner - Split layout: image left, info right */}
        <div className="relative h-[500px] rounded-2xl overflow-hidden bg-charcoal-800 flex">
          {/* Image side (60%) */}
          <div className="relative w-[60%] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={idx}
                src={p.images[0]}
                alt={p.title}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-charcoal-800" />
          </div>

          {/* Info side (40%) */}
          <div className="relative w-[40%] flex flex-col justify-center p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gold-400/20 text-gold-400 mb-4">
                  {p.type} • {p.transaction}
                </span>
                <h2 className="font-heading text-3xl font-bold text-white mb-3 leading-tight">
                  {p.title}
                </h2>
                <p className="text-white/50 text-sm mb-6">
                  {p.neighborhood}, {p.city}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: 'Quartos', value: p.bedrooms },
                    { label: 'Banheiros', value: p.bathrooms },
                    { label: 'Area', value: `${p.area}m²` },
                    { label: 'Vagas', value: p.parking },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/5 rounded-xl p-3">
                      <span className="block text-white/40 text-[10px] uppercase tracking-wider">{item.label}</span>
                      <span className="text-white font-bold text-lg">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gold-400 font-heading text-2xl font-bold">
                    {formatPrice(p.price, p.transaction)}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation dots */}
            <div className="absolute bottom-6 right-10 flex gap-2">
              {featured.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-8 bg-olive-400' : 'w-4 bg-white/20'}`}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-charcoal-500 text-xs mt-4">Modelo 2 — Split Layout com detalhes laterais</p>
      </div>
    </div>
  )
}
