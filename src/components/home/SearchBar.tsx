'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const cities = ['Todas', 'Salvador', 'Feira de Santana', 'Alagoinhas'] as const
const types = ['Todos', 'Apartamento', 'Casa', 'Cobertura', 'Terreno'] as const
const transactions = ['Compra', 'Aluguel'] as const
const bedrooms = ['Qualquer', '1+', '2+', '3+', '4+'] as const

export default function SearchBar() {
  const router = useRouter()
  const [filters, setFilters] = useState({
    cidade: 'Todas',
    tipo: 'Todos',
    transacao: 'Compra',
    quartos: 'Qualquer',
  })

  function handleChange(key: string, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function handleSearch() {
    const params = new URLSearchParams()

    if (filters.cidade !== 'Todas') {
      params.set('cidade', filters.cidade)
    }
    if (filters.tipo !== 'Todos') {
      params.set('tipo', filters.tipo.toLowerCase())
    }
    params.set('transacao', filters.transacao === 'Compra' ? 'venda' : 'aluguel')
    if (filters.quartos !== 'Qualquer') {
      params.set('quartos', filters.quartos.replace('+', ''))
    }

    router.push(`/imoveis?${params.toString()}`)
  }

  const selectClasses =
    'w-full appearance-none bg-white border border-sand-200 rounded-lg px-4 py-3 text-charcoal-700 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition-colors cursor-pointer'

  return (
    <section className="relative z-20 -mt-12 md:-mt-10 px-5 md:px-10 max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] p-6 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* Cidade */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Cidade
            </label>
            <div className="relative">
              <select
                value={filters.cidade}
                onChange={(e) => handleChange('cidade', e.target.value)}
                className={selectClasses}
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Tipo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Tipo
            </label>
            <div className="relative">
              <select
                value={filters.tipo}
                onChange={(e) => handleChange('tipo', e.target.value)}
                className={selectClasses}
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Transacao */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Transa&ccedil;&atilde;o
            </label>
            <div className="relative">
              <select
                value={filters.transacao}
                onChange={(e) => handleChange('transacao', e.target.value)}
                className={selectClasses}
              >
                {transactions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Quartos */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Quartos
            </label>
            <div className="relative">
              <select
                value={filters.quartos}
                onChange={(e) => handleChange('quartos', e.target.value)}
                className={selectClasses}
              >
                {bedrooms.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            className="w-full bg-gold-400 hover:bg-gold-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-[0_4px_20px_rgba(46,158,166,0.4)] flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            Buscar
          </button>
        </div>
      </div>
    </section>
  )
}
