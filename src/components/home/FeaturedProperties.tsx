'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { formatPrice } from '@/data/properties'
import { useProperties } from '@/hooks/useProperties'
import ImageCarousel from '@/components/ImageCarousel'
import FavoriteButton from '@/components/FavoriteButton'

const typeLabels: Record<string, string> = {
  apartamento: 'Apartamento',
  casa: 'Casa',
  cobertura: 'Cobertura',
  terreno: 'Terreno',
  comercial: 'Comercial',
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
}

export default function FeaturedProperties() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const allProperties = useProperties()
  const properties = allProperties.filter((p) => p.featured && p.status === 'ativo')

  return (
    <section className="section-padding bg-sand-50" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-3xl md:text-4xl text-charcoal-800">
            Im&oacute;veis em Destaque
          </h2>
          <div className="gold-divider mx-auto mt-4" />
          <p className="mt-4 text-charcoal-500 max-w-lg mx-auto">
            Sele&ccedil;&atilde;o exclusiva dos melhores im&oacute;veis dispon&iacute;veis nas principais cidades da Bahia
          </p>
        </motion.div>

        {/* Property grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              className="card-property group"
              custom={index}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={cardVariants}
            >
              {/* Image Carousel */}
              <div className="relative">
                <ImageCarousel images={property.images} title={property.title} />

                {/* Type badge */}
                <span className="absolute top-4 left-4 z-10 bg-olive-600 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                  {typeLabels[property.type] || property.type}
                </span>

                {/* Transaction badge */}
                <span className="absolute top-4 right-14 z-10 bg-charcoal-800/80 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                  {property.transaction === 'venda' ? 'Venda' : 'Aluguel'}
                </span>

                {/* Favorite button */}
                <div className="absolute top-3 right-3 z-10">
                  <FavoriteButton propertyId={property.id} propertyTitle={property.title} />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/10 transition-colors duration-500 pointer-events-none" />
              </div>

              {/* Card body */}
              <div className="p-6">
                {/* Price */}
                <p className="text-gold-500 font-heading text-2xl font-bold">
                  {formatPrice(property.price, property.transaction)}
                </p>
                {property.condoFee && (
                  <p className="text-charcoal-400 text-xs mt-0.5">+ cond. R$ {property.condoFee.toLocaleString('pt-BR')}/mes</p>
                )}

                {/* Title */}
                <h3 className="mt-2 font-heading text-lg text-charcoal-800 group-hover:text-olive-600 transition-colors">
                  {property.title}
                </h3>

                {/* Location */}
                <div className="mt-2 flex items-center gap-1.5 text-charcoal-400 text-sm">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                  </svg>
                  {property.neighborhood}, {property.city}
                </div>

                {/* Divider */}
                <div className="mt-4 pt-4 border-t border-sand-100">
                  <div className="flex items-center justify-between">
                    {/* Property details */}
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

                    {/* Link */}
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
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Link href="/imoveis" className="btn-outline">
            Ver Todos os Im&oacute;veis
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
