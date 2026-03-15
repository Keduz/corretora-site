'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCompare } from './CompareContext'
import { useProperties } from '@/hooks/useProperties'

export default function CompareBar() {
  const properties = useProperties()
  const { compareIds, toggleCompare, clearCompare, count } = useCompare()

  if (count === 0) return null

  const selected = compareIds.map((id) => properties.find((p) => p.id === id)).filter(Boolean)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-[60] bg-charcoal-800/95 backdrop-blur-md border-t border-charcoal-700 py-3 px-4 md:px-8"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto">
            <span className="text-sand-300 text-sm font-medium whitespace-nowrap">
              Comparar ({count}/3):
            </span>
            <div className="flex gap-2">
              {selected.map((property) =>
                property ? (
                  <div
                    key={property.id}
                    className="flex items-center gap-2 bg-charcoal-700 rounded-lg px-3 py-1.5"
                  >
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-8 h-6 object-cover rounded"
                    />
                    <span className="text-sand-200 text-xs whitespace-nowrap max-w-[120px] truncate">
                      {property.title}
                    </span>
                    <button
                      onClick={() => toggleCompare(property.id)}
                      className="text-sand-400 hover:text-red-400 transition-colors"
                      aria-label="Remover da comparacao"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : null
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={clearCompare}
              className="text-sand-400 hover:text-sand-200 text-xs font-medium transition-colors"
            >
              Limpar
            </button>
            {count >= 2 && (
              <Link
                href="/comparar"
                className="bg-gold-400 hover:bg-gold-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
              >
                Comparar
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
