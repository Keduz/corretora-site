'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { properties, formatPrice } from '@/data/properties'

const featured = properties.filter((p) => p.featured && p.status === 'ativo')

export default function Modelo4() {
  const [idx, setIdx] = useState(0)
  const [progress, setProgress] = useState(0)

  const next = useCallback(() => {
    setIdx((i) => (i + 1) % featured.length)
    setProgress(0)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { next(); return 0 }
        return p + 1.67 // ~60 steps in 6s
      })
    }, 100)
    return () => clearInterval(interval)
  }, [next])

  const p = featured[idx]

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 flex flex-col">
      {/* Floating header */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Image src="/logo.png" alt="Logo" width={44} height={44} className="h-11 w-auto brightness-0 invert" />
              <motion.div
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-olive-400 border-2 border-charcoal-900"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>
            <div>
              <span className="font-heading text-lg font-bold text-white">Jeova Guedes</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] uppercase tracking-[0.2em] text-gold-400 font-semibold">Corretor de Imoveis</span>
                <span className="text-white/20">|</span>
                <span className="text-[9px] uppercase tracking-[0.15em] text-olive-400 font-medium">CRECI-BA 022-670</span>
              </div>
            </div>
          </div>

          {/* Counter */}
          <div className="flex items-center gap-3 text-white/40 text-sm">
            <span className="text-white font-bold text-lg">{String(idx + 1).padStart(2, '0')}</span>
            <div className="w-12 h-0.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-olive-400 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <span>{String(featured.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Main content - vertical split with diagonal clip */}
      <div className="flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-8 grid grid-cols-2 gap-0 items-center min-h-[600px]">
          {/* Left side - info */}
          <div className="pr-12 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 60 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="h-1 bg-gold-400 rounded-full mb-6"
                />

                <span className="text-olive-400 text-xs font-bold uppercase tracking-[0.3em] block mb-3">
                  {p.type} para {p.transaction}
                </span>

                <h2 className="font-heading text-5xl font-bold text-white mb-4 leading-[1.1]">
                  {p.title}
                </h2>

                <p className="text-white/40 text-sm mb-8 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  {p.neighborhood}, {p.city}
                </p>

                <div className="flex items-center gap-6 mb-8">
                  {[
                    { icon: 'M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75', val: `${p.bedrooms} qts` },
                    { icon: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21', val: `${p.area}m²` },
                    { icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12', val: `${p.parking} vagas` },
                  ].map((item) => (
                    <div key={item.val} className="flex items-center gap-2 text-white/60">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
                      <span className="text-sm">{item.val}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-gold-400 font-heading text-3xl font-bold">
                    {formatPrice(p.price, p.transaction)}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right side - image with creative shape */}
          <div className="relative h-[520px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.05, rotate: -1 }}
                transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl shadow-black/40"
              >
                <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem]" />
              </motion.div>
            </AnimatePresence>

            {/* Floating image count */}
            <div className="absolute -bottom-3 -left-3 px-4 py-2 rounded-xl bg-charcoal-800 border border-white/10 shadow-xl">
              <span className="text-white/60 text-xs">{p.images.length} fotos</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-charcoal-500 text-xs pb-6">Modelo 4 — Split diagonal com progress bar e rotacao</p>
    </div>
  )
}
