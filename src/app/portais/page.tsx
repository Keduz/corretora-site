'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { portais, type Portal } from '@/data/portais'
import { getWhatsAppUrl } from '@/utils/whatsapp'

type Filter = 'todos' | 'pago' | 'gratuito'

const filters: { value: Filter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'pago', label: 'Pagos' },
  { value: 'gratuito', label: 'Gratuitos' },
]

function PortalCard({ portal, index }: { portal: Portal; index: number }) {
  const [imgError, setImgError] = useState(false)

  return (
    <motion.a
      href={portal.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-2xl shadow-sm border border-sand-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
    >
      {/* Logo banner */}
      <div className="h-20 bg-gradient-to-br from-sand-50 to-sand-100 flex items-center justify-center border-b border-sand-100 group-hover:from-olive-50 group-hover:to-olive-100 transition-colors duration-300">
        {!imgError ? (
          <img
            src={portal.logo}
            alt={portal.name}
            className="h-12 w-12 object-contain rounded-xl shadow-sm"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center">
            <span className="text-2xl font-heading font-bold text-olive-500">
              {portal.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-heading text-lg font-semibold text-charcoal-800 group-hover:text-olive-600 transition-colors">
              {portal.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  portal.category === 'pago'
                    ? 'bg-gold-100 text-gold-700'
                    : 'bg-olive-100 text-olive-700'
                }`}
              >
                {portal.category === 'pago' ? 'Pago' : 'Gratuito'}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  portal.status === 'ativo'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-sand-200 text-charcoal-500'
                }`}
              >
                {portal.status === 'ativo' ? 'Ativo' : 'Em breve'}
              </span>
            </div>
          </div>

          <svg
            className="w-5 h-5 text-charcoal-300 group-hover:text-olive-500 transition-colors shrink-0 mt-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 pb-4">
        <p className="text-charcoal-500 text-sm leading-relaxed line-clamp-2">
          {portal.description}
        </p>
      </div>

      {/* Footer */}
      <div className="px-6 pb-5 pt-2 border-t border-sand-50">
        <div className="flex items-center justify-between text-xs text-charcoal-400">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <span>{portal.cobertura}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{portal.automacao}</span>
          </div>
        </div>
      </div>
    </motion.a>
  )
}

export default function PortaisPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('todos')
  const gridRef = useRef(null)
  const gridInView = useInView(gridRef, { once: true, margin: '-60px' })

  const filtered = activeFilter === 'todos'
    ? portais
    : portais.filter((p) => p.category === activeFilter)

  const totalAtivos = portais.filter((p) => p.status === 'ativo').length
  const totalPagos = portais.filter((p) => p.category === 'pago').length
  const totalGratuitos = portais.filter((p) => p.category === 'gratuito').length

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-charcoal-800 pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(46,158,166,0.08),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-5 md:px-10 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <svg className="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.302a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.25 8.047" />
              </svg>
              <span className="text-sand-300 text-xs font-medium tracking-wide uppercase">Integracoes</span>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
              Portais <span className="text-gold-400">Integrados</span>
            </h1>
            <div className="gold-divider mx-auto mt-6" />
            <p className="mt-6 text-sand-300 text-lg leading-relaxed max-w-2xl mx-auto">
              Seus imoveis anunciados automaticamente nos maiores portais imobiliarios do Brasil.
              Mais visibilidade, mais leads, mais vendas.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 md:gap-12 mt-10">
              <div className="text-center">
                <p className="font-heading text-3xl md:text-4xl font-bold text-gold-400">{portais.length}</p>
                <p className="text-sand-400 text-xs mt-1 uppercase tracking-wide">Portais</p>
              </div>
              <div className="w-px h-10 bg-charcoal-600" />
              <div className="text-center">
                <p className="font-heading text-3xl md:text-4xl font-bold text-gold-400">{totalAtivos}</p>
                <p className="text-sand-400 text-xs mt-1 uppercase tracking-wide">Ativos</p>
              </div>
              <div className="w-px h-10 bg-charcoal-600" />
              <div className="text-center">
                <p className="font-heading text-3xl md:text-4xl font-bold text-gold-400">100%</p>
                <p className="text-sand-400 text-xs mt-1 uppercase tracking-wide">Automatico</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white border-b border-sand-100">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-heading text-2xl md:text-3xl text-charcoal-800">Como Funciona</h2>
            <div className="gold-divider mx-auto mt-4" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Cadastre o Imovel',
                desc: 'Cadastre o imovel uma unica vez no nosso painel administrativo com fotos, descricao e detalhes.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Publicacao Automatica',
                desc: 'O sistema distribui automaticamente seu anuncio para todos os portais integrados simultaneamente.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Receba os Leads',
                desc: 'Centralize todos os contatos e leads dos portais em um unico painel e feche mais negocios.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="text-center p-8 rounded-2xl bg-sand-50 border border-sand-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-olive-50 text-olive-600 flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <span className="text-gold-400 font-heading text-sm font-bold">{item.step}</span>
                <h3 className="font-heading text-xl text-charcoal-800 mt-2 mb-3">{item.title}</h3>
                <p className="text-charcoal-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portals Grid */}
      <section className="section-padding bg-sand-50" ref={gridRef}>
        <div className="max-w-7xl mx-auto">
          {/* Filter Tabs */}
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={gridInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2 className="font-heading text-2xl md:text-3xl text-charcoal-800">Nossos Portais</h2>
              <p className="text-charcoal-500 text-sm mt-1">
                {filtered.length} {filtered.length === 1 ? 'portal' : 'portais'} encontrados
              </p>
            </div>

            <div className="flex items-center bg-white rounded-xl border border-sand-200 p-1">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === f.value
                      ? 'bg-olive-600 text-white shadow-sm'
                      : 'text-charcoal-500 hover:text-charcoal-700'
                  }`}
                >
                  {f.label}
                  <span className={`ml-1.5 text-xs ${activeFilter === f.value ? 'text-white/70' : 'text-charcoal-300'}`}>
                    {f.value === 'todos' ? portais.length : f.value === 'pago' ? totalPagos : totalGratuitos}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((portal, i) => (
              <PortalCard key={portal.id} portal={portal} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-charcoal-800">
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl text-white">
              Quer anunciar em <span className="text-gold-400">todos os portais</span>?
            </h2>
            <p className="mt-4 text-sand-300 text-lg max-w-2xl mx-auto">
              Entre em contato conosco e comece a divulgar seus imoveis nos maiores portais do Brasil de forma automatica.
            </p>
            <a
              href={getWhatsAppUrl('/portais')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-8 inline-flex"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Falar com Especialista
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
