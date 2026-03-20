'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { properties, formatPrice } from '@/data/properties'

const featured = properties.filter((p) => p.featured && p.status === 'ativo')

export default function Modelo3() {
  const [idx, setIdx] = useState(0)

  const next = useCallback(() => setIdx((i) => (i + 1) % featured.length), [])
  const prev = useCallback(() => setIdx((i) => (i - 1 + featured.length) % featured.length), [])

  useEffect(() => {
    const t = setInterval(next, 7000)
    return () => clearInterval(t)
  }, [next])

  const p = featured[idx]

  return (
    <div className="min-h-screen bg-charcoal-900 flex flex-col">
      {/* Top bar with logo + CRECI */}
      <div className="bg-charcoal-800/50 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="h-10 w-auto brightness-0 invert" />
            <div>
              <span className="font-heading text-base font-bold text-white">Jeova Guedes</span>
              <span className="block text-[9px] uppercase tracking-[0.2em] text-white/40">Corretor de Imoveis</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[11px] font-medium text-olive-400 tracking-wider">CRECI-BA 022-670</span>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-[11px] text-white/40">Verificado</span>
          </div>
        </div>
      </div>

      {/* Full-screen hero with stacked cards effect */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-5xl relative">
          {/* Background cards (stacked effect) */}
          <div className="absolute -top-3 left-6 right-6 h-full rounded-2xl bg-white/5 -z-10" />
          <div className="absolute -top-6 left-12 right-12 h-full rounded-2xl bg-white/[0.02] -z-20" />

          {/* Main card */}
          <div className="relative h-[520px] rounded-2xl overflow-hidden bg-charcoal-800 shadow-2xl shadow-black/50">
            {/* Full background image with ken burns */}
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <motion.img
                  src={p.images[0]}
                  alt={p.title}
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.08 }}
                  transition={{ duration: 7, ease: 'linear' }}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-olive-500 text-white">
                      {p.type}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-gold-400/50 text-gold-400">
                      {p.transaction}
                    </span>
                  </div>

                  <h2 className="font-heading text-4xl font-bold text-white mb-2">{p.title}</h2>
                  <p className="text-white/50 text-sm mb-5">{p.neighborhood}, {p.city}</p>

                  <div className="flex items-center gap-8">
                    <span className="text-gold-400 font-heading text-3xl font-bold">
                      {formatPrice(p.price, p.transaction)}
                    </span>
                    <div className="flex items-center gap-4 text-white/60 text-sm">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                        {p.bedrooms} quartos
                      </span>
                      <span>{p.area}m²</span>
                      <span>{p.parking} vagas</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Thumbnails + nav */}
              <div className="flex items-center justify-between mt-8">
                <div className="flex gap-2">
                  {featured.map((f, i) => (
                    <button
                      key={f.id}
                      onClick={() => setIdx(i)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                        i === idx ? 'border-olive-400 opacity-100' : 'border-transparent opacity-40 hover:opacity-70'
                      }`}
                    >
                      <img src={f.images[0]} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={prev} className="w-10 h-10 rounded-full border border-white/20 text-white/60 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                  </button>
                  <button onClick={next} className="w-10 h-10 rounded-full border border-white/20 text-white/60 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-charcoal-500 text-xs mt-6">Modelo 3 — Card empilhado com Ken Burns + thumbnails</p>
        </div>
      </div>
    </div>
  )
}
