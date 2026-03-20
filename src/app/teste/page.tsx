'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { properties, formatPrice, type Property } from '@/data/properties'

/* ─────────── Animated Banner ─────────── */
function ImageBanner({ items }: { items: { property: Property; primaryIndex: number }[] }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((c) => (c + 1) % items.length)
  }, [items.length])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((c) => (c - 1 + items.length) % items.length)
  }, [items.length])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  if (items.length === 0) return null

  const item = items[current]
  const img = item.property.images[item.primaryIndex]

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-charcoal-900 group">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.img
          key={current}
          src={img}
          alt={item.property.title}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Property info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 p-8"
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-olive-500/90 text-white mb-3">
            {item.property.type} • {item.property.transaction}
          </span>
          <h2 className="font-heading text-3xl font-bold text-white mb-2">
            {item.property.title}
          </h2>
          <div className="flex items-center gap-4 text-white/80 text-sm">
            <span>{item.property.neighborhood}, {item.property.city}</span>
            <span className="text-gold-400 font-bold text-lg">{formatPrice(item.property.price, item.property.transaction)}</span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-white/60 text-xs">
            <span>{item.property.bedrooms} quartos</span>
            <span>{item.property.bathrooms} banheiros</span>
            <span>{item.property.area}m²</span>
            <span>{item.property.parking} vagas</span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Nav arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 right-8 flex items-center gap-1.5">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

/* ─────────── Photo Selector Modal ─────────── */
function PhotoModal({
  property,
  primaryIndex,
  onSelect,
  onClose,
}: {
  property: Property
  primaryIndex: number
  onSelect: (index: number) => void
  onClose: () => void
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="relative w-full max-w-3xl pointer-events-auto bg-white rounded-2xl overflow-hidden shadow-2xl">
          <div className="h-1.5 bg-gradient-to-r from-olive-500 via-olive-400 to-gold-400" />

          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-heading text-xl font-bold text-charcoal-800">
                  Escolher foto principal
                </h3>
                <p className="text-sm text-charcoal-400 mt-0.5">{property.title}</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Current primary - large preview */}
            <motion.div
              layoutId={`preview-${property.id}`}
              className="relative w-full h-64 rounded-xl overflow-hidden mb-4"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={primaryIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={property.images[primaryIndex]}
                  alt="Foto principal"
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-olive-500 text-white text-xs font-semibold">
                Foto Principal
              </div>
            </motion.div>

            {/* Thumbnails grid */}
            <div className="grid grid-cols-5 gap-2">
              {property.images.map((img, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelect(i)}
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                    i === primaryIndex
                      ? 'border-olive-500 ring-2 ring-olive-500/30'
                      : 'border-transparent hover:border-charcoal-200'
                  }`}
                >
                  <img src={img} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                  {i === primaryIndex && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-olive-500 flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </motion.div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] text-center py-0.5">
                    Foto {i + 1}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

/* ─────────── Property Card with Primary Photo ─────────── */
function PropertyCard({
  property,
  primaryIndex,
  onOpenModal,
}: {
  property: Property
  primaryIndex: number
  onOpenModal: () => void
}) {
  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-sand-100 hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-[4/3] overflow-hidden group cursor-pointer" onClick={onOpenModal}>
        <img
          src={property.images[primaryIndex]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 text-sm font-medium text-charcoal-800 shadow-lg"
          >
            <svg className="w-4 h-4 inline mr-1.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
            Trocar foto principal
          </motion.div>
        </div>
        {/* Photo count badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
          {property.images.length} fotos
        </div>
        <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-olive-500 text-white text-xs font-semibold">
          Foto {primaryIndex + 1}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-heading font-bold text-charcoal-800 truncate">{property.title}</h3>
        <p className="text-sm text-charcoal-400 mt-0.5">{property.neighborhood}, {property.city}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-olive-600 font-bold">{formatPrice(property.price, property.transaction)}</span>
          <div className="flex items-center gap-2 text-xs text-charcoal-400">
            <span>{property.bedrooms}q</span>
            <span>{property.area}m²</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────── Main Test Page ─────────── */
export default function TestePage() {
  const [primaryPhotos, setPrimaryPhotos] = useState<Record<number, number>>({})
  const [modalProperty, setModalProperty] = useState<Property | null>(null)

  const getPrimary = (id: number) => primaryPhotos[id] ?? 0

  const setPrimary = (propertyId: number, photoIndex: number) => {
    setPrimaryPhotos((prev) => ({ ...prev, [propertyId]: photoIndex }))
  }

  const bannerItems = properties
    .filter((p) => p.featured && p.status === 'ativo')
    .map((p) => ({ property: p, primaryIndex: getPrimary(p.id) }))

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-sand-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-charcoal-800">
              Teste - Banner de Imoveis
            </h1>
            <p className="text-sm text-charcoal-400">Sistema de foto principal + banner animado</p>
          </div>
          <a
            href="/admin"
            className="px-4 py-2 rounded-xl text-sm font-medium text-charcoal-600 hover:bg-sand-100 transition-colors border border-sand-200"
          >
            Voltar ao Admin
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {/* Banner Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 rounded-full bg-olive-500" />
            <h2 className="font-heading text-xl font-bold text-charcoal-800">Banner Animado</h2>
            <span className="text-xs text-charcoal-400">(troca automatica a cada 5s)</span>
          </div>
          <ImageBanner items={bannerItems} />
        </section>

        {/* Property Cards Grid */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 rounded-full bg-gold-400" />
            <h2 className="font-heading text-xl font-bold text-charcoal-800">Gerenciar Foto Principal</h2>
            <span className="text-xs text-charcoal-400">(clique na foto pra trocar)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {properties.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                primaryIndex={getPrimary(p.id)}
                onOpenModal={() => setModalProperty(p)}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Photo Selection Modal */}
      <AnimatePresence>
        {modalProperty && (
          <PhotoModal
            property={modalProperty}
            primaryIndex={getPrimary(modalProperty.id)}
            onSelect={(i) => setPrimary(modalProperty.id, i)}
            onClose={() => setModalProperty(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
