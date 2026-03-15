'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCompare } from '@/components/CompareContext'
import { formatPrice, type Property } from '@/data/properties'
import { useProperties } from '@/hooks/useProperties'

const typeLabels: Record<Property['type'], string> = {
  apartamento: 'Apartamento',
  casa: 'Casa',
  cobertura: 'Cobertura',
  terreno: 'Terreno',
  comercial: 'Comercial',
}

const rows: { label: string; render: (p: Property) => React.ReactNode }[] = [
  {
    label: 'Preco',
    render: (p) => (
      <span className="font-heading text-lg font-bold text-gold-500">
        {formatPrice(p.price, p.transaction)}
      </span>
    ),
  },
  {
    label: 'Condominio',
    render: (p) =>
      p.condoFee
        ? `R$ ${p.condoFee.toLocaleString('pt-BR')}/mes`
        : 'N/A',
  },
  {
    label: 'Tipo',
    render: (p) => typeLabels[p.type],
  },
  {
    label: 'Transacao',
    render: (p) => (p.transaction === 'venda' ? 'Venda' : 'Aluguel'),
  },
  {
    label: 'Cidade',
    render: (p) => p.city,
  },
  {
    label: 'Bairro',
    render: (p) => p.neighborhood,
  },
  {
    label: 'Quartos',
    render: (p) => p.bedrooms,
  },
  {
    label: 'Banheiros',
    render: (p) => p.bathrooms,
  },
  {
    label: 'Area (m²)',
    render: (p) => `${p.area} m²`,
  },
  {
    label: 'Vagas',
    render: (p) => p.parking,
  },
  {
    label: 'Caracteristicas',
    render: (p) => (
      <ul className="space-y-1">
        {p.features.map((f) => (
          <li key={f} className="flex items-start gap-1.5 text-sm text-charcoal-600">
            <svg
              className="w-4 h-4 text-olive-500 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
    ),
  },
]

export default function CompararPage() {
  const properties = useProperties()
  const { compareIds, toggleCompare } = useCompare()

  const selected = compareIds
    .map((id) => properties.find((p) => p.id === id))
    .filter((p): p is Property => Boolean(p))

  const isEmpty = selected.length === 0

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
            Comparar Imoveis
          </motion.h1>
          <motion.p
            className="mt-4 text-sand-300 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Analise lado a lado os imoveis selecionados
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-sand-50">
        <div className="max-w-7xl mx-auto">
          {isEmpty ? (
            /* ---- Empty State ---- */
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-charcoal-100 text-charcoal-400 mb-6">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                  />
                </svg>
              </div>
              <h2 className="font-heading text-2xl md:text-3xl text-charcoal-800">
                Nenhum imovel selecionado
              </h2>
              <p className="mt-3 text-charcoal-500 max-w-md mx-auto">
                Selecione pelo menos 2 imoveis na pagina de listagem para comparar suas
                caracteristicas lado a lado.
              </p>
              <Link
                href="/imoveis"
                className="inline-flex items-center gap-2 mt-8 bg-gold-400 hover:bg-gold-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
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
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                Ver Imoveis
              </Link>
            </motion.div>
          ) : (
            <>
              {/* ---- Desktop / Tablet: Side-by-side Table ---- */}
              <motion.div
                className="hidden md:block overflow-x-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {/* Label column header */}
                      <th className="w-44 lg:w-52" />
                      {selected.map((p) => (
                        <th key={p.id} className="p-4 align-top">
                          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={p.images[0]}
                                alt={p.title}
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute top-3 left-3 bg-olive-600 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                                {p.transaction === 'venda' ? 'Venda' : 'Aluguel'}
                              </span>
                            </div>
                            <div className="p-4 text-center">
                              <h3 className="font-heading text-lg text-charcoal-800 font-semibold leading-tight">
                                {p.title}
                              </h3>
                              <p className="text-charcoal-500 text-sm mt-1">
                                {p.neighborhood}, {p.city}
                              </p>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-sand-50'}>
                        <td className="px-5 py-4 font-medium text-charcoal-700 text-sm whitespace-nowrap align-top">
                          {row.label}
                        </td>
                        {selected.map((p) => (
                          <td
                            key={p.id}
                            className="px-5 py-4 text-charcoal-600 text-sm align-top"
                          >
                            {row.render(p)}
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* Actions row */}
                    <tr className="bg-white">
                      <td className="px-5 py-6" />
                      {selected.map((p) => (
                        <td key={p.id} className="px-5 py-6 align-top">
                          <div className="flex flex-col items-center gap-3">
                            <Link
                              href={`/imoveis/${p.slug}`}
                              className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                            >
                              Ver Detalhes
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
                                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                />
                              </svg>
                            </Link>
                            <button
                              onClick={() => toggleCompare(p.id)}
                              className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                            >
                              Remover
                            </button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </motion.div>

              {/* ---- Mobile: Stacked Cards ---- */}
              <div className="md:hidden space-y-8">
                {selected.map((p, cardIndex) => (
                  <motion.div
                    key={p.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: cardIndex * 0.15 }}
                  >
                    {/* Card image */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-olive-600 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                        {p.transaction === 'venda' ? 'Venda' : 'Aluguel'}
                      </span>
                    </div>

                    {/* Card title */}
                    <div className="p-5 border-b border-sand-100">
                      <h3 className="font-heading text-xl text-charcoal-800 font-semibold">
                        {p.title}
                      </h3>
                      <p className="text-charcoal-500 text-sm mt-1">
                        {p.neighborhood}, {p.city}
                      </p>
                    </div>

                    {/* Card rows */}
                    <div className="divide-y divide-sand-100">
                      {rows.map((row, i) => (
                        <div
                          key={row.label}
                          className={`flex gap-4 px-5 py-3.5 ${
                            i % 2 === 0 ? 'bg-white' : 'bg-sand-50'
                          }`}
                        >
                          <span className="w-32 shrink-0 font-medium text-charcoal-700 text-sm">
                            {row.label}
                          </span>
                          <span className="text-charcoal-600 text-sm">{row.render(p)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Card actions */}
                    <div className="flex items-center justify-between p-5 border-t border-sand-100">
                      <button
                        onClick={() => toggleCompare(p.id)}
                        className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                      >
                        Remover
                      </button>
                      <Link
                        href={`/imoveis/${p.slug}`}
                        className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                      >
                        Ver Detalhes
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
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </Link>
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
