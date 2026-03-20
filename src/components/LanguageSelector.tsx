'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/i18n/LanguageContext'
import { type Locale, localeNames, localeFlags } from '@/i18n/translations'

const locales: Locale[] = ['pt', 'en', 'es', 'fr']

export default function LanguageSelector() {
  const { locale, setLocale } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-sand-100 transition-colors text-sm"
        aria-label="Selecionar idioma"
      >
        <span className="text-base leading-none">{localeFlags[locale]}</span>
        <span className="hidden sm:inline text-xs font-medium text-charcoal-600 uppercase">{locale}</span>
        <svg className={`w-3 h-3 text-charcoal-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-sand-200 overflow-hidden min-w-[160px] z-50"
          >
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => { setLocale(l); setOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  l === locale
                    ? 'bg-olive-50 text-olive-700 font-medium'
                    : 'text-charcoal-600 hover:bg-sand-50'
                }`}
              >
                <span className="text-base">{localeFlags[l]}</span>
                <span>{localeNames[l]}</span>
                {l === locale && (
                  <svg className="w-4 h-4 ml-auto text-olive-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
