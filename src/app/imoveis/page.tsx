'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { properties, formatPrice } from '@/data/properties'

const typeLabels: Record<string, string> = {
  apartamento: 'Apartamento',
  casa: 'Casa',
  cobertura: 'Cobertura',
  terreno: 'Terreno',
  comercial: 'Comercial',
}

export default function ImoveisPage() {
  const [cityFilter, setCityFilter] = useState('Todas')
  const [typeFilter, setTypeFilter] = useState('Todos')
  const [transactionFilter, setTransactionFilter] = useState('Todos')
  const [bedroomsFilter, setBedroomsFilter] = useState('Qualquer')

  const filtered = properties.filter((p) => {
    if (cityFilter !== 'Todas' && p.city !== cityFilter) return false
    if (typeFilter !== 'Todos' && p.type !== typeFilter.toLowerCase()) return false
    if (transactionFilter !== 'Todos') {
      const t = transactionFilter === 'Venda' ? 'venda' : 'aluguel'
      if (p.transaction !== t) return false
    }
    if (bedroomsFilter !== 'Qualquer') {
      const min = parseInt(bedroomsFilter.replace('+', ''))
      if (p.bedrooms < min) return false
    }
    return true
  })

  const selectClasses =
    'w-full appearance-none bg-white border border-sand-200 rounded-lg px-4 py-3 text-charcoal-700 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition-colors cursor-pointer'

  return (
    <main>
      {/* Hero Banner */}
      <section className="relative bg-charcoal-800 pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,168,67,0.08)_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 text-center">
          <motion.div
            className="gold-divider mx-auto mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.h1
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Nossos Imoveis
          </motion.h1>
          <motion.p
            className="mt-4 text-sand-300 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Encontre o imovel ideal em Salvador, Feira de Santana e Alagoinhas
          </motion.p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="relative z-20 -mt-8 px-5 md:px-10 max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] p-6 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* City */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">Cidade</label>
              <div className="relative">
                <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className={selectClasses}>
                  <option value="Todas">Todas</option>
                  <option value="Salvador">Salvador</option>
                  <option value="Feira de Santana">Feira de Santana</option>
                  <option value="Alagoinhas">Alagoinhas</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">Tipo</label>
              <div className="relative">
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={selectClasses}>
                  <option value="Todos">Todos</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Casa">Casa</option>
                  <option value="Cobertura">Cobertura</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Comercial">Comercial</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Transaction */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">Transacao</label>
              <div className="relative">
                <select value={transactionFilter} onChange={(e) => setTransactionFilter(e.target.value)} className={selectClasses}>
                  <option value="Todos">Todos</option>
                  <option value="Venda">Venda</option>
                  <option value="Aluguel">Aluguel</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Bedrooms */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">Quartos</label>
              <div className="relative">
                <select value={bedroomsFilter} onChange={(e) => setBedroomsFilter(e.target.value)} className={selectClasses}>
                  <option value="Qualquer">Qualquer</option>
                  <option value="1+">1+</option>
                  <option value="2+">2+</option>
                  <option value="3+">3+</option>
                  <option value="4+">4+</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="section-padding bg-sand-50">
        <div className="max-w-7xl mx-auto">
          {/* Results count */}
          <p className="text-charcoal-500 text-sm mb-8">
            {filtered.length} {filtered.length === 1 ? 'imovel encontrado' : 'imoveis encontrados'}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-charcoal-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <h3 className="font-heading text-xl text-charcoal-700">Nenhum imovel encontrado</h3>
              <p className="text-charcoal-500 mt-2">Tente ajustar os filtros para ver mais resultados</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((property, index) => (
                <motion.div
                  key={property.id}
                  className="card-property group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  {/* Image */}
                  <div className="relative h-56 bg-charcoal-200 overflow-hidden">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />

                    <span className="absolute top-4 left-4 bg-olive-600 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                      {typeLabels[property.type] || property.type}
                    </span>
                    <span className="absolute top-4 right-4 bg-charcoal-800/80 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                      {property.transaction === 'venda' ? 'Venda' : 'Aluguel'}
                    </span>

                    <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/20 transition-colors duration-500" />
                  </div>

                  {/* Card body */}
                  <div className="p-6">
                    <p className="text-gold-500 font-heading text-2xl font-bold">
                      {formatPrice(property.price, property.transaction)}
                    </p>

                    <h3 className="mt-2 font-heading text-lg text-charcoal-800 group-hover:text-olive-600 transition-colors">
                      {property.title}
                    </h3>

                    <div className="mt-2 flex items-center gap-1.5 text-charcoal-400 text-sm">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                      </svg>
                      {property.neighborhood}, {property.city}
                    </div>

                    <div className="mt-4 pt-4 border-t border-sand-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-charcoal-500 text-sm">
                          {property.bedrooms > 0 && (
                            <div className="flex items-center gap-1" title="Quartos">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6m-6 3.75h6M9 14.25h6" />
                              </svg>
                              <span>{property.bedrooms}</span>
                            </div>
                          )}
                          {property.bathrooms > 0 && (
                            <div className="flex items-center gap-1" title="Banheiros">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              <span>{property.bathrooms}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1" title="Area">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                            </svg>
                            <span>{property.area}m&sup2;</span>
                          </div>
                        </div>

                        <Link
                          href={`/imoveis/${property.slug}`}
                          className="text-olive-600 text-sm font-medium hover:text-olive-700 transition-colors flex items-center gap-1"
                        >
                          Ver Detalhes
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
