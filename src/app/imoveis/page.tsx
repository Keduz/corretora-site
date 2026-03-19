'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { formatPrice } from '@/data/properties'
import { useProperties } from '@/hooks/useProperties'
import ImageCarousel from '@/components/ImageCarousel'
import YouTubePreview, { VirtualTourBadge } from '@/components/YouTubePreview'
import FavoriteButton from '@/components/FavoriteButton'
import { useCompare } from '@/components/CompareContext'
import { useToast } from '@/components/Toast'

const typeLabels: Record<string, string> = {
  apartamento: 'Apartamento',
  casa: 'Casa',
  cobertura: 'Cobertura',
  terreno: 'Terreno',
  comercial: 'Comercial',
}

const priceRangesVenda = [
  { label: 'Qualquer', min: 0, max: Infinity },
  { label: 'Ate R$ 300 mil', min: 0, max: 300000 },
  { label: 'R$ 300 mil - R$ 600 mil', min: 300000, max: 600000 },
  { label: 'R$ 600 mil - R$ 1 milhao', min: 600000, max: 1000000 },
  { label: 'R$ 1 milhao - R$ 2 milhoes', min: 1000000, max: 2000000 },
  { label: 'Acima de R$ 2 milhoes', min: 2000000, max: Infinity },
]

const priceRangesAluguel = [
  { label: 'Qualquer', min: 0, max: Infinity },
  { label: 'Ate R$ 2.000', min: 0, max: 2000 },
  { label: 'R$ 2.000 - R$ 4.000', min: 2000, max: 4000 },
  { label: 'R$ 4.000 - R$ 6.000', min: 4000, max: 6000 },
  { label: 'Acima de R$ 6.000', min: 6000, max: Infinity },
]

const areaRanges = [
  { label: 'Qualquer', min: 0, max: Infinity },
  { label: 'Ate 60m\u00B2', min: 0, max: 60 },
  { label: '60m\u00B2 - 100m\u00B2', min: 60, max: 100 },
  { label: '100m\u00B2 - 200m\u00B2', min: 100, max: 200 },
  { label: '200m\u00B2 - 400m\u00B2', min: 200, max: 400 },
  { label: 'Acima de 400m\u00B2', min: 400, max: Infinity },
]

const sortOptions = [
  { label: 'Mais relevantes', value: 'relevance' },
  { label: 'Menor preco', value: 'price_asc' },
  { label: 'Maior preco', value: 'price_desc' },
  { label: 'Maior area', value: 'area_desc' },
]

export default function ImoveisPage() {
  const properties = useProperties()
  const [cityFilter, setCityFilter] = useState('Todas')
  const [typeFilter, setTypeFilter] = useState('Todos')
  const [transactionFilter, setTransactionFilter] = useState('Todos')
  const [bedroomsFilter, setBedroomsFilter] = useState('Qualquer')
  const [priceRange, setPriceRange] = useState('Qualquer')
  const [areaRange, setAreaRange] = useState('Qualquer')
  const [neighborhoodFilter, setNeighborhoodFilter] = useState('Todos')
  const [sortBy, setSortBy] = useState('relevance')
  const [showFilters, setShowFilters] = useState(false)
  const { toggleCompare, isComparing, count: compareCount } = useCompare()
  const { showToast } = useToast()
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null)

  const neighborhoods = useMemo(() => {
    const list: string[] = []
    properties.forEach((p) => {
      if (!list.includes(p.neighborhood)) list.push(p.neighborhood)
    })
    return list.sort()
  }, [properties])

  const priceRanges = transactionFilter === 'Aluguel' ? priceRangesAluguel : priceRangesVenda

  const filtered = useMemo(() => {
    let results = properties.filter((p) => p.status === 'ativo')

    if (cityFilter !== 'Todas') results = results.filter((p) => p.city === cityFilter)
    if (typeFilter !== 'Todos') results = results.filter((p) => p.type === typeFilter.toLowerCase())
    if (transactionFilter !== 'Todos') {
      const t = transactionFilter === 'Venda' ? 'venda' : 'aluguel'
      results = results.filter((p) => p.transaction === t)
    }
    if (bedroomsFilter !== 'Qualquer') {
      const min = parseInt(bedroomsFilter.replace('+', ''))
      results = results.filter((p) => p.bedrooms >= min)
    }
    if (priceRange !== 'Qualquer') {
      const range = priceRanges.find((r) => r.label === priceRange)
      if (range) results = results.filter((p) => p.price >= range.min && p.price <= range.max)
    }
    if (areaRange !== 'Qualquer') {
      const range = areaRanges.find((r) => r.label === areaRange)
      if (range) results = results.filter((p) => p.area >= range.min && p.area <= range.max)
    }
    if (neighborhoodFilter !== 'Todos') {
      results = results.filter((p) => p.neighborhood === neighborhoodFilter)
    }

    // Sort
    switch (sortBy) {
      case 'price_asc':
        results.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        results.sort((a, b) => b.price - a.price)
        break
      case 'area_desc':
        results.sort((a, b) => b.area - a.area)
        break
    }

    return results
  }, [cityFilter, typeFilter, transactionFilter, bedroomsFilter, priceRange, areaRange, neighborhoodFilter, sortBy, priceRanges])

  function clearFilters() {
    setCityFilter('Todas')
    setTypeFilter('Todos')
    setTransactionFilter('Todos')
    setBedroomsFilter('Qualquer')
    setPriceRange('Qualquer')
    setAreaRange('Qualquer')
    setNeighborhoodFilter('Todos')
    setSortBy('relevance')
  }

  const hasActiveFilters = cityFilter !== 'Todas' || typeFilter !== 'Todos' || transactionFilter !== 'Todos' ||
    bedroomsFilter !== 'Qualquer' || priceRange !== 'Qualquer' || areaRange !== 'Qualquer' || neighborhoodFilter !== 'Todos'

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
          {/* Primary filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FilterSelect label="Cidade" value={cityFilter} onChange={setCityFilter}
              options={['Todas', 'Salvador', 'Feira de Santana', 'Alagoinhas']} className={selectClasses} />
            <FilterSelect label="Tipo" value={typeFilter} onChange={setTypeFilter}
              options={['Todos', 'Apartamento', 'Casa', 'Cobertura', 'Terreno', 'Comercial']} className={selectClasses} />
            <FilterSelect label="Transacao" value={transactionFilter} onChange={setTransactionFilter}
              options={['Todos', 'Venda', 'Aluguel']} className={selectClasses} />
            <FilterSelect label="Quartos" value={bedroomsFilter} onChange={setBedroomsFilter}
              options={['Qualquer', '1+', '2+', '3+', '4+']} className={selectClasses} />
          </div>

          {/* Toggle advanced filters */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-olive-600 text-sm font-medium hover:text-olive-700 transition-colors flex items-center gap-1.5"
            >
              <svg className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
              {showFilters ? 'Menos filtros' : 'Mais filtros'}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-charcoal-400 text-sm hover:text-charcoal-600 transition-colors"
              >
                Limpar filtros
              </button>
            )}
          </div>

          {/* Advanced filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-sand-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <FilterSelect label="Faixa de preco" value={priceRange} onChange={setPriceRange}
                options={priceRanges.map((r) => r.label)} className={selectClasses} />
              <FilterSelect label="Area" value={areaRange} onChange={setAreaRange}
                options={areaRanges.map((r) => r.label)} className={selectClasses} />
              <FilterSelect label="Bairro" value={neighborhoodFilter} onChange={setNeighborhoodFilter}
                options={['Todos', ...neighborhoods]} className={selectClasses} />
            </motion.div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="section-padding bg-sand-50">
        <div className="max-w-7xl mx-auto">
          {/* Results header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <p className="text-charcoal-500 text-sm">
              {filtered.length} {filtered.length === 1 ? 'imovel encontrado' : 'imoveis encontrados'}
            </p>
            <div className="flex items-center gap-2">
              <label className="text-charcoal-400 text-xs">Ordenar:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-sand-200 rounded-lg px-3 py-2 text-charcoal-700 text-xs focus:outline-none focus:ring-2 focus:ring-gold-400/50 cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-charcoal-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <h3 className="font-heading text-xl text-charcoal-700">Nenhum imovel encontrado</h3>
              <p className="text-charcoal-500 mt-2">Tente ajustar os filtros para ver mais resultados</p>
              <button
                onClick={clearFilters}
                className="mt-6 btn-outline !px-6 !py-3 text-sm"
              >
                Limpar todos os filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((property, index) => (
                <motion.div
                  key={property.id}
                  className="card-property group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                >
                  {/* Image Carousel with YouTube Preview */}
                  <div
                    className="relative"
                    onMouseEnter={() => {
                      if (property.youtubeVideoId) setHoveredCardId(property.id)
                    }}
                    onMouseLeave={() => setHoveredCardId(null)}
                  >
                    <ImageCarousel images={property.images} title={property.title} />

                    {/* YouTube Video Overlay */}
                    {property.youtubeVideoId && (
                      <YouTubePreview
                        videoId={property.youtubeVideoId}
                        isHovered={hoveredCardId === property.id}
                      />
                    )}

                    {/* Badges */}
                    <span className="absolute top-4 left-4 z-10 bg-olive-600 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                      {typeLabels[property.type] || property.type}
                    </span>
                    <span className="absolute top-4 right-14 z-10 bg-charcoal-800/80 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                      {property.transaction === 'venda' ? 'Venda' : 'Aluguel'}
                    </span>

                    {/* Virtual Tour Badge */}
                    {property.youtubeVideoId && hoveredCardId !== property.id && (
                      <VirtualTourBadge />
                    )}

                    {/* Favorite */}
                    <div className="absolute top-3 right-3 z-10">
                      <FavoriteButton propertyId={property.id} propertyTitle={property.title} />
                    </div>

                    <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/10 transition-colors duration-500 pointer-events-none" />
                  </div>

                  {/* Card body */}
                  <div className="p-6">
                    <p className="text-gold-500 font-heading text-2xl font-bold">
                      {formatPrice(property.price, property.transaction)}
                    </p>
                    {property.condoFee && (
                      <p className="text-charcoal-400 text-xs mt-0.5">+ cond. R$ {property.condoFee.toLocaleString('pt-BR')}/mes</p>
                    )}

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

                        <div className="flex items-center gap-2">
                          {/* Compare button */}
                          <button
                            onClick={() => {
                              if (!isComparing(property.id) && compareCount >= 3) {
                                showToast('Maximo de 3 imoveis para comparar', 'error')
                                return
                              }
                              toggleCompare(property.id)
                              if (isComparing(property.id)) {
                                showToast('Removido da comparacao', 'info')
                              } else {
                                showToast('Adicionado para comparacao', 'success')
                              }
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all text-xs ${
                              isComparing(property.id)
                                ? 'bg-gold-400 text-white'
                                : 'bg-sand-100 text-charcoal-400 hover:bg-sand-200 hover:text-charcoal-600'
                            }`}
                            title="Comparar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                            </svg>
                          </button>

                          <Link
                            href={`/imoveis/${property.slug}`}
                            className="inline-flex items-center gap-1.5 px-5 py-2 bg-olive-600 text-white text-sm font-semibold rounded-lg hover:bg-olive-700 shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            Ver Imovel
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                          </Link>
                        </div>
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

function FilterSelect({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string
  value: string
  onChange: (val: string) => void
  options: string[]
  className: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">{label}</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className={className}>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}
