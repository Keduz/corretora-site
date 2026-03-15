'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { formatPrice } from '@/data/properties'
import { useProperties } from '@/hooks/useProperties'
import { useFavorites } from '@/components/FavoritesContext'
import ImageCarousel from '@/components/ImageCarousel'
import FavoriteButton from '@/components/FavoriteButton'

const typeLabels: Record<string, string> = {
  apartamento: 'Apartamento',
  casa: 'Casa',
  cobertura: 'Cobertura',
  terreno: 'Terreno',
  comercial: 'Comercial',
}

export default function FavoritosPage() {
  const properties = useProperties()
  const { favorites } = useFavorites()

  const favoriteProperties = useMemo(() => {
    return properties.filter((p) => favorites.includes(p.id))
  }, [favorites, properties])

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
            Meus Favoritos
          </motion.h1>
          <motion.p
            className="mt-4 text-sand-300 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {favoriteProperties.length > 0
              ? 'Os imoveis que voce selecionou como favoritos'
              : 'Salve seus imoveis preferidos para acessar facilmente'}
          </motion.p>
        </div>
      </section>

      {/* Results */}
      <section className="section-padding bg-sand-50">
        <div className="max-w-7xl mx-auto">
          {favoriteProperties.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Heart icon */}
              <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-sand-100 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-charcoal-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>
              <h3 className="font-heading text-2xl text-charcoal-700">
                Nenhum favorito ainda
              </h3>
              <p className="text-charcoal-500 mt-3 max-w-md mx-auto">
                Explore nossos imoveis e clique no coracao para salvar seus
                preferidos. Eles aparecerão aqui para voce acessar a qualquer
                momento.
              </p>
              <Link
                href="/imoveis"
                className="mt-8 inline-flex items-center gap-2 bg-olive-600 text-white font-medium px-8 py-3.5 rounded-lg hover:bg-olive-700 transition-colors"
              >
                Explorar Imoveis
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Results header */}
              <div className="flex items-center justify-between mb-8">
                <p className="text-charcoal-500 text-sm">
                  {favoriteProperties.length}{' '}
                  {favoriteProperties.length === 1
                    ? 'imovel favorito'
                    : 'imoveis favoritos'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {favoriteProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    className="card-property group"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                  >
                    {/* Image Carousel */}
                    <div className="relative">
                      <ImageCarousel
                        images={property.images}
                        title={property.title}
                      />

                      {/* Badges */}
                      <span className="absolute top-4 left-4 z-10 bg-olive-600 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                        {typeLabels[property.type] || property.type}
                      </span>
                      <span className="absolute top-4 right-14 z-10 bg-charcoal-800/80 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                        {property.transaction === 'venda'
                          ? 'Venda'
                          : 'Aluguel'}
                      </span>

                      {/* Favorite */}
                      <div className="absolute top-3 right-3 z-10">
                        <FavoriteButton
                          propertyId={property.id}
                          propertyTitle={property.title}
                        />
                      </div>

                      <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/10 transition-colors duration-500 pointer-events-none" />
                    </div>

                    {/* Card body */}
                    <div className="p-6">
                      <p className="text-gold-500 font-heading text-2xl font-bold">
                        {formatPrice(property.price, property.transaction)}
                      </p>
                      {property.condoFee && (
                        <p className="text-charcoal-400 text-xs mt-0.5">
                          + cond. R${' '}
                          {property.condoFee.toLocaleString('pt-BR')}/mes
                        </p>
                      )}

                      <h3 className="mt-2 font-heading text-lg text-charcoal-800 group-hover:text-olive-600 transition-colors">
                        {property.title}
                      </h3>

                      <div className="mt-2 flex items-center gap-1.5 text-charcoal-400 text-sm">
                        <svg
                          className="w-4 h-4 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z"
                          />
                        </svg>
                        {property.neighborhood}, {property.city}
                      </div>

                      <div className="mt-4 pt-4 border-t border-sand-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-charcoal-500 text-sm">
                            {property.bedrooms > 0 && (
                              <div
                                className="flex items-center gap-1"
                                title="Quartos"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6m-6 3.75h6M9 14.25h6"
                                  />
                                </svg>
                                <span>{property.bedrooms}</span>
                              </div>
                            )}
                            {property.bathrooms > 0 && (
                              <div
                                className="flex items-center gap-1"
                                title="Banheiros"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                                <span>{property.bathrooms}</span>
                              </div>
                            )}
                            <div
                              className="flex items-center gap-1"
                              title="Area"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                                />
                              </svg>
                              <span>{property.area}m&sup2;</span>
                            </div>
                          </div>

                          <Link
                            href={`/imoveis/${property.slug}`}
                            className="text-olive-600 text-sm font-medium hover:text-olive-700 transition-colors flex items-center gap-1"
                          >
                            Ver
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 4.5l7.5 7.5-7.5 7.5"
                              />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
