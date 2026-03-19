'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import type { Property } from '@/data/properties'
import { formatPrice } from '@/data/properties'
import ImageGallery from '@/components/ImageGallery'
import FavoriteButton from '@/components/FavoriteButton'
import PropertyMap from '@/components/PropertyMap'
import { getWhatsAppUrl } from '@/utils/whatsapp'

const typeLabels: Record<string, string> = {
  apartamento: 'Apartamento',
  casa: 'Casa',
  cobertura: 'Cobertura',
  terreno: 'Terreno',
  comercial: 'Comercial',
}

export default function PropertyDetailClient({
  property,
  formattedPrice,
  similarProperties,
}: {
  property: Property
  formattedPrice: string
  similarProperties: Property[]
}) {
  const detailsRef = useRef(null)
  const detailsInView = useInView(detailsRef, { once: true, margin: '-80px' })
  const featuresRef = useRef(null)
  const featuresInView = useInView(featuresRef, { once: true, margin: '-80px' })
  const similarRef = useRef(null)
  const similarInView = useInView(similarRef, { once: true, margin: '-80px' })

  const whatsappUrl = getWhatsAppUrl(`/imoveis/${property.slug}`, `${property.title} (${formattedPrice})`)

  return (
    <main>
      {/* Hero / Image Area */}
      <section className="relative bg-charcoal-800 pt-28 pb-6 md:pt-32 md:pb-8">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          {/* Breadcrumb */}
          <motion.nav
            className="flex items-center gap-2 text-sm text-sand-400 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/" className="hover:text-gold-400 transition-colors">Inicio</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <Link href="/imoveis" className="hover:text-gold-400 transition-colors">Imoveis</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-sand-300">{property.title}</span>
          </motion.nav>

          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <span className="bg-olive-600 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                {typeLabels[property.type] || property.type}
              </span>
              <span className="bg-charcoal-800/80 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                {property.transaction === 'venda' ? 'Venda' : 'Aluguel'}
              </span>
            </div>

            {/* Favorite Button */}
            <div className="absolute top-4 right-4 z-10">
              <FavoriteButton propertyId={property.id} propertyTitle={property.title} size="md" />
            </div>

            <ImageGallery images={property.images} title={property.title} />
          </motion.div>
        </div>
      </section>

      {/* Property Details */}
      <section className="section-padding bg-sand-50" ref={detailsRef}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={detailsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                {/* Title and Price */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="font-heading text-3xl md:text-4xl text-charcoal-800">
                      {property.title}
                    </h1>
                    <div className="mt-2 flex items-center gap-1.5 text-charcoal-500">
                      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                      </svg>
                      <span>{property.neighborhood}, {property.city} - BA</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gold-500 font-heading text-3xl md:text-4xl font-bold">
                      {formattedPrice}
                    </p>
                    {property.condoFee && (
                      <p className="text-charcoal-400 text-sm mt-1">
                        Condominio: R$ {property.condoFee.toLocaleString('pt-BR')}/mes
                      </p>
                    )}
                  </div>
                </div>

                <div className="gold-divider mt-6" />

                {/* Details Grid */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.bedrooms > 0 && (
                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-olive-50 flex items-center justify-center text-olive-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6m-6 3.75h6M9 14.25h6" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-charcoal-800 font-semibold">{property.bedrooms}</p>
                        <p className="text-charcoal-400 text-xs">Quartos</p>
                      </div>
                    </div>
                  )}

                  {property.bathrooms > 0 && (
                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-olive-50 flex items-center justify-center text-olive-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-charcoal-800 font-semibold">{property.bathrooms}</p>
                        <p className="text-charcoal-400 text-xs">Banheiros</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-4 bg-white rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-olive-50 flex items-center justify-center text-olive-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-charcoal-800 font-semibold">{property.area}m&sup2;</p>
                      <p className="text-charcoal-400 text-xs">Area</p>
                    </div>
                  </div>

                  {property.parking > 0 && (
                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-olive-50 flex items-center justify-center text-olive-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-charcoal-800 font-semibold">{property.parking}</p>
                        <p className="text-charcoal-400 text-xs">Vagas</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mt-10">
                  <h2 className="font-heading text-2xl text-charcoal-800 mb-4">Descricao</h2>
                  <p className="text-charcoal-600 leading-relaxed">{property.description}</p>
                </div>

                {/* YouTube Video Tour */}
                {property.youtubeVideoId && (
                  <div className="mt-10">
                    <h2 className="font-heading text-2xl text-charcoal-800 mb-4 flex items-center gap-3">
                      <svg className="w-7 h-7 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      Tour Virtual
                    </h2>
                    <div className="relative w-full rounded-2xl overflow-hidden bg-charcoal-900 shadow-lg" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${property.youtubeVideoId}?rel=0&modestbranding=1`}
                        title={`Tour virtual - ${property.title}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="mt-10" ref={featuresRef}>
                  <h2 className="font-heading text-2xl text-charcoal-800 mb-4">Caracteristicas</h2>
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    initial={{ opacity: 0 }}
                    animate={featuresInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6 }}
                  >
                    {property.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <svg className="w-5 h-5 text-olive-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span className="text-charcoal-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Location Map */}
                <div className="mt-10">
                  <h2 className="font-heading text-2xl text-charcoal-800 mb-4 flex items-center gap-3">
                    <svg className="w-6 h-6 text-olive-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                    </svg>
                    Localizacao
                  </h2>
                  <PropertyMap
                    lat={property.lat}
                    lng={property.lng}
                    title={property.title}
                    neighborhood={property.neighborhood}
                    city={property.city}
                  />
                  <p className="mt-3 text-charcoal-500 text-sm flex items-center gap-1.5">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                    </svg>
                    {property.neighborhood}, {property.city} - BA
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                className="sticky top-28 space-y-6"
                initial={{ opacity: 0, x: 40 }}
                animate={detailsInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                {/* Schedule Visit Card */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-heading text-xl text-charcoal-800 mb-2">Agendar Visita</h3>
                  <p className="text-charcoal-500 text-sm mb-6">
                    Fale com nossa especialista e agende uma visita presencial ao imovel.
                  </p>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp w-full justify-center"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Agendar Visita
                  </a>

                  <div className="mt-4 flex items-center gap-2 text-charcoal-400 text-xs">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Resposta em ate 30 minutos em horario comercial
                  </div>
                </div>

                {/* Property Summary Card */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-heading text-lg text-charcoal-800 mb-4">Resumo do Imovel</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-charcoal-500">Tipo</span>
                      <span className="text-charcoal-800 font-medium">{typeLabels[property.type]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal-500">Transacao</span>
                      <span className="text-charcoal-800 font-medium">{property.transaction === 'venda' ? 'Venda' : 'Aluguel'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal-500">Area</span>
                      <span className="text-charcoal-800 font-medium">{property.area}m&sup2;</span>
                    </div>
                    {property.bedrooms > 0 && (
                      <div className="flex justify-between">
                        <span className="text-charcoal-500">Quartos</span>
                        <span className="text-charcoal-800 font-medium">{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms > 0 && (
                      <div className="flex justify-between">
                        <span className="text-charcoal-500">Banheiros</span>
                        <span className="text-charcoal-800 font-medium">{property.bathrooms}</span>
                      </div>
                    )}
                    {property.parking > 0 && (
                      <div className="flex justify-between">
                        <span className="text-charcoal-500">Vagas</span>
                        <span className="text-charcoal-800 font-medium">{property.parking}</span>
                      </div>
                    )}
                    {property.condoFee && (
                      <div className="flex justify-between">
                        <span className="text-charcoal-500">Condominio</span>
                        <span className="text-charcoal-800 font-medium">R$ {property.condoFee.toLocaleString('pt-BR')}/mes</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-charcoal-500">Cidade</span>
                      <span className="text-charcoal-800 font-medium">{property.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal-500">Bairro</span>
                      <span className="text-charcoal-800 font-medium">{property.neighborhood}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-heading text-lg text-charcoal-800 mb-4">Informacoes de Contato</h3>
                  <div className="space-y-3">
                    <a href="tel:+5571997106376" className="flex items-center gap-3 text-charcoal-600 hover:text-gold-500 transition-colors text-sm">
                      <svg className="w-5 h-5 text-olive-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                      (71) 99710-6376
                    </a>
                    <a href="mailto:contato@jeovaimoveis.com.br" className="flex items-center gap-3 text-charcoal-600 hover:text-gold-500 transition-colors text-sm">
                      <svg className="w-5 h-5 text-olive-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      contato@jeovaimoveis.com.br
                    </a>
                  </div>
                </div>

                {/* Back to Listings */}
                <Link
                  href="/imoveis"
                  className="flex items-center gap-2 text-charcoal-500 hover:text-olive-600 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  Voltar para Imoveis
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <section className="section-padding bg-white" ref={similarRef}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={similarInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-3xl text-charcoal-800">Imoveis Similares</h2>
              <div className="gold-divider mt-4" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarProperties.map((p, index) => (
                <motion.div
                  key={p.id}
                  className="card-property group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={similarInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                >
                  <div className="relative h-56 bg-charcoal-200 overflow-hidden">
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute top-4 left-4 bg-olive-600 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                      {typeLabels[p.type] || p.type}
                    </span>
                    <div className="absolute top-4 right-4">
                      <FavoriteButton propertyId={p.id} propertyTitle={p.title} />
                    </div>
                    <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/20 transition-colors duration-500" />
                  </div>
                  <div className="p-6">
                    <p className="text-gold-500 font-heading text-2xl font-bold">
                      {formatPrice(p.price, p.transaction)}
                    </p>
                    <h3 className="mt-2 font-heading text-lg text-charcoal-800 group-hover:text-olive-600 transition-colors">
                      {p.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-1.5 text-charcoal-400 text-sm">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                      </svg>
                      {p.neighborhood}, {p.city}
                    </div>
                    <div className="mt-4 pt-4 border-t border-sand-100">
                      <Link
                        href={`/imoveis/${p.slug}`}
                        className="text-olive-600 text-sm font-medium hover:text-olive-700 transition-colors flex items-center gap-1"
                      >
                        Ver Detalhes
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
