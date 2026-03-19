'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { openWhatsApp } from '@/utils/whatsapp'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts'

/* ── Color tokens (matching site palette) ── */
const C = {
  olive50: '#F0FAFB', olive100: '#D6F1F3', olive200: '#ADE3E7',
  olive300: '#7ACFD5', olive400: '#4CB8BF', olive500: '#2E9EA6',
  olive600: '#258389', olive700: '#1E6A6F', olive800: '#1A5357', olive900: '#133B3E',
  gold400: '#D4A843', gold500: '#C09533', gold50: '#FDF8EC', gold100: '#FAF0D4',
  charcoal800: '#24282A', charcoal900: '#141617',
  sand50: '#FAFBF9', sand100: '#F2F4F0', sand200: '#E8ECE4', sand300: '#D8DED2',
}

const BANKS = [
  { name: 'Caixa (SFH)', rate: 8.99, maxTerm: 420, maxFinancing: 0.80, color: '#005CA9' },
  { name: 'Banco do Brasil', rate: 9.39, maxTerm: 420, maxFinancing: 0.80, color: '#FFCC00' },
  { name: 'Itau', rate: 9.99, maxTerm: 360, maxFinancing: 0.82, color: '#FF6600' },
  { name: 'Bradesco', rate: 10.24, maxTerm: 360, maxFinancing: 0.80, color: '#CC092F' },
  { name: 'Santander', rate: 10.49, maxTerm: 420, maxFinancing: 0.80, color: '#EA1D25' },
]

/* ── Helpers ── */
function formatBRL(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
function parseBRL(str: string) {
  return parseFloat(str.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '')) || 0
}
function formatInput(v: string) {
  const n = parseInt(String(v).replace(/\D/g, ''), 10) || 0
  return (n / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/* ── Financial calculations ── */
function calcSAC(principal: number, monthlyRate: number, months: number) {
  const amort = principal / months
  const firstPayment = amort + principal * monthlyRate
  const lastPayment = amort + amort * monthlyRate
  let totalPaid = 0
  const schedule: { month: number; payment: number }[] = []
  let balance = principal
  for (let i = 1; i <= months; i++) {
    const interest = balance * monthlyRate
    const payment = amort + interest
    totalPaid += payment
    balance -= amort
    if (i % 12 === 1 || i === 1 || i === months) {
      schedule.push({ month: i, payment })
    }
  }
  return { firstPayment, lastPayment, totalPaid, totalInterest: totalPaid - principal, schedule }
}

function calcPRICE(principal: number, monthlyRate: number, months: number) {
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
  const totalPaid = payment * months
  const schedule: { month: number; payment: number }[] = []
  let balance = principal
  for (let i = 1; i <= months; i++) {
    const interest = balance * monthlyRate
    const amortVal = payment - interest
    balance -= amortVal
    if (i % 12 === 1 || i === 1 || i === months) {
      schedule.push({ month: i, payment })
    }
  }
  return { firstPayment: payment, lastPayment: payment, totalPaid, totalInterest: totalPaid - principal, schedule }
}

/* ── Input components ── */
function MoneyInput({ label, value, onChange, helper }: {
  label: string; value: string; onChange: (v: string) => void; helper?: string
}) {
  return (
    <div className="mb-5">
      <label className="block text-xs font-semibold text-charcoal-500 mb-1.5 tracking-wide">{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-charcoal-300 font-semibold">R$</span>
        <input
          type="text"
          value={value}
          onChange={e => onChange(formatInput(e.target.value))}
          className="w-full pl-10 pr-4 py-3.5 text-base font-semibold border-2 border-sand-200 rounded-xl bg-sand-50 text-charcoal-800 outline-none transition-all focus:border-olive-500 focus:bg-white"
        />
      </div>
      {helper && <span className="text-[11px] text-charcoal-300 mt-1 block">{helper}</span>}
    </div>
  )
}

function SliderInput({ label, value, onChange, min, max, step, suffix, helper }: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; suffix: string; helper?: string
}) {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-baseline mb-1.5">
        <label className="text-xs font-semibold text-charcoal-500 tracking-wide">{label}</label>
        <span className="text-xl font-bold" style={{ color: C.olive500 }}>{value}{suffix}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 cursor-pointer"
        style={{ accentColor: C.olive500 }}
      />
      <div className="flex justify-between text-[11px] text-charcoal-300 mt-0.5">
        <span>{min}{suffix}</span><span>{max}{suffix}</span>
      </div>
      {helper && <span className="text-[11px] text-charcoal-300 block">{helper}</span>}
    </div>
  )
}

/* ── Bank card ── */
function BankCard({ bank, principal, months, income, isSelected, onClick }: {
  bank: typeof BANKS[0]; principal: number; months: number; income: number; isSelected: boolean; onClick: () => void
}) {
  const monthlyRate = bank.rate / 100 / 12
  const sac = calcSAC(principal, monthlyRate, Math.min(months, bank.maxTerm))
  const price = calcPRICE(principal, monthlyRate, Math.min(months, bank.maxTerm))
  const maxPayment = Math.max(sac.firstPayment, price.firstPayment)
  const incomeOk = income > 0 ? maxPayment <= income * 0.3 : true
  const pct = income > 0 ? ((maxPayment / income) * 100).toFixed(1) : null

  return (
    <div onClick={onClick} className="cursor-pointer transition-all duration-200 relative overflow-hidden rounded-2xl" style={{
      background: isSelected ? `linear-gradient(135deg, ${C.olive50} 0%, ${C.olive100} 100%)` : '#fff',
      border: isSelected ? `2px solid ${C.olive500}` : `2px solid ${C.sand200}`,
      padding: 20,
      boxShadow: isSelected ? `0 4px 20px rgba(46,158,166,.15)` : '0 1px 4px rgba(0,0,0,.04)',
    }}>
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: bank.color }} />
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold text-[15px] text-charcoal-800">{bank.name}</span>
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full" style={{
          background: incomeOk ? '#dcfce7' : '#fee2e2',
          color: incomeOk ? '#166534' : '#991b1b',
        }}>
          {pct ? `${pct}% da renda` : '\u2014'}
        </span>
      </div>
      <div className="text-xs text-charcoal-400 mb-2.5">
        Taxa: <strong className="text-charcoal-800">{bank.rate}% a.a.</strong> &nbsp;|&nbsp; Max: {bank.maxTerm / 12} anos &nbsp;|&nbsp; Ate {(bank.maxFinancing * 100).toFixed(0)}%
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-lg p-2.5" style={{ background: C.sand100 }}>
          <div className="text-[10px] font-semibold mb-0.5" style={{ color: C.olive600 }}>SAC &mdash; 1a parcela</div>
          <div className="text-base font-bold text-charcoal-900">{formatBRL(sac.firstPayment)}</div>
          <div className="text-[10px] text-charcoal-300">Ultima: {formatBRL(sac.lastPayment)}</div>
        </div>
        <div className="rounded-lg p-2.5" style={{ background: C.gold50 }}>
          <div className="text-[10px] font-semibold mb-0.5" style={{ color: C.gold500 }}>PRICE &mdash; Parcela fixa</div>
          <div className="text-base font-bold text-charcoal-900">{formatBRL(price.firstPayment)}</div>
          <div className="text-[10px] text-charcoal-300">Total juros: {formatBRL(price.totalInterest)}</div>
        </div>
      </div>
      <div className="mt-2.5 text-[11px] text-charcoal-400 flex justify-between">
        <span>Total SAC: {formatBRL(sac.totalPaid)}</span>
        <span>Total PRICE: {formatBRL(price.totalPaid)}</span>
      </div>
    </div>
  )
}

/* ── Custom tooltip ── */
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number }>; label?: string }) {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg px-3.5 py-2.5 shadow-lg" style={{ background: C.charcoal800 }}>
        <div className="text-[11px] mb-1" style={{ color: C.sand300 }}>Mes {label}</div>
        {payload.map((p, i) => (
          <div key={i} className="text-[13px] font-semibold" style={{ color: p.color }}>
            {p.name}: {formatBRL(p.value)}
          </div>
        ))}
      </div>
    )
  }
  return null
}

/* ══════════════════════════════════════════════════════ */
/*  MAIN PAGE COMPONENT                                  */
/* ══════════════════════════════════════════════════════ */
export default function SimuladorPage() {
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true })

  const [propertyValue, setPropertyValue] = useState('500.000,00')
  const [downPayment, setDownPayment] = useState('100.000,00')
  const [term, setTerm] = useState(360)
  const [income, setIncome] = useState('12.000,00')
  const [selectedBank, setSelectedBank] = useState(0)
  const [useFGTS, setUseFGTS] = useState(false)
  const [fgtsValue, setFgtsValue] = useState('0,00')
  const [showResults, setShowResults] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const propVal = parseBRL(propertyValue)
  const downVal = parseBRL(downPayment)
  const incomeVal = parseBRL(income)
  const fgtsVal = useFGTS ? parseBRL(fgtsValue) : 0
  const principal = Math.max(0, propVal - downVal - fgtsVal)
  const downPct = propVal > 0 ? ((downVal + fgtsVal) / propVal * 100).toFixed(1) : '0'

  const errors = useMemo(() => {
    const e: string[] = []
    if (propVal < 20000) e.push('Valor do imovel minimo: R$ 20.000')
    if (downVal + fgtsVal < propVal * 0.2) e.push(`Entrada minima de 20% (${formatBRL(propVal * 0.2)})`)
    if (incomeVal <= 0) e.push('Informe a renda familiar')
    return e
  }, [propVal, downVal, fgtsVal, incomeVal])

  const bank = BANKS[selectedBank]
  const monthlyRate = bank.rate / 100 / 12
  const effectiveTerm = Math.min(term, bank.maxTerm)
  const sac = useMemo(() => calcSAC(principal, monthlyRate, effectiveTerm), [principal, monthlyRate, effectiveTerm])
  const price = useMemo(() => calcPRICE(principal, monthlyRate, effectiveTerm), [principal, monthlyRate, effectiveTerm])

  const chartData = useMemo(() => {
    const sacSched = calcSAC(principal, monthlyRate, effectiveTerm).schedule
    const priceSched = calcPRICE(principal, monthlyRate, effectiveTerm).schedule
    return sacSched.map((s, i) => ({
      month: `M${s.month}`,
      SAC: Math.round(s.payment),
      PRICE: Math.round(priceSched[i]?.payment || 0),
    }))
  }, [principal, monthlyRate, effectiveTerm])

  const comparisonData = useMemo(() => {
    return BANKS.map(b => {
      const mr = b.rate / 100 / 12
      const t = Math.min(term, b.maxTerm)
      const s = calcSAC(principal, mr, t)
      const p = calcPRICE(principal, mr, t)
      return { name: b.name.split(' ')[0], totalSAC: Math.round(s.totalInterest / 1000), totalPRICE: Math.round(p.totalInterest / 1000), color: b.color }
    })
  }, [principal, term])

  const handleSimulate = () => {
    if (errors.length === 0) {
      setShowResults(true)
    }
  }

  const closeModal = useCallback(() => setShowResults(false), [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showResults) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [showResults])

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [closeModal])

  return (
    <main>
      {/* Hero Banner */}
      <section className="relative bg-charcoal-800 pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden" ref={heroRef}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(46,158,166,0.08)_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 text-center">
          <motion.div
            className="inline-flex items-center gap-2.5 bg-olive-500/15 border border-olive-500/30 rounded-full px-5 py-1.5 mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="w-2 h-2 rounded-full bg-olive-500 inline-block" />
            <span className="text-olive-300 text-xs font-semibold tracking-widest">SIMULADOR GRATUITO</span>
          </motion.div>
          <motion.h1
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Financiamento{' '}
            <span className="text-olive-400">Imobiliario</span>
          </motion.h1>
          <motion.p
            className="mt-4 text-sand-300 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Compare parcelas SAC e PRICE nos principais bancos do Brasil
          </motion.p>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding bg-sand-50">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl p-7 md:p-8 shadow-lg shadow-charcoal-900/5">
            <MoneyInput label="VALOR DO IMOVEL" value={propertyValue} onChange={setPropertyValue} helper="Minimo R$ 20.000" />
            <MoneyInput label="VALOR DA ENTRADA" value={downPayment} onChange={setDownPayment} helper={`${downPct}% do imovel \u2014 minimo recomendado: 20%`} />

            {/* FGTS Toggle */}
            <div className="flex items-center gap-2.5 mb-4 py-2">
              <div
                onClick={() => setUseFGTS(!useFGTS)}
                className="w-11 h-6 rounded-full cursor-pointer relative transition-all"
                style={{ background: useFGTS ? C.olive500 : C.sand300 }}
              >
                <div
                  className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow"
                  style={{ left: useFGTS ? 22 : 2 }}
                />
              </div>
              <span className="text-sm font-semibold text-charcoal-500">Usar FGTS</span>
            </div>
            {useFGTS && <MoneyInput label="VALOR DO FGTS" value={fgtsValue} onChange={setFgtsValue} helper="Saldo disponivel para utilizacao" />}

            <SliderInput label="PRAZO" value={term / 12} onChange={v => setTerm(v * 12)} min={5} max={35} step={1} suffix=" anos" helper={`${term} meses`} />
            <MoneyInput label="RENDA FAMILIAR BRUTA" value={income} onChange={setIncome} helper="Parcela nao pode passar de 30% da renda" />

            {/* Summary bar */}
            <div className="rounded-xl p-4 mb-4 flex justify-between items-center flex-wrap gap-2" style={{ background: `linear-gradient(135deg, ${C.olive900}, ${C.olive800})` }}>
              <div>
                <div className="text-[10px] font-semibold tracking-wide" style={{ color: C.sand300 }}>VALOR A FINANCIAR</div>
                <div className="text-xl md:text-2xl font-extrabold" style={{ color: C.olive400 }}>{formatBRL(principal)}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-semibold tracking-wide" style={{ color: C.sand300 }}>PARCELA MAX. (30%)</div>
                <div className="text-lg font-bold text-white">{formatBRL(incomeVal * 0.3)}</div>
              </div>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                {errors.map((e, i) => (
                  <div key={i} className="text-red-800 text-xs font-medium">{'\u26A0'} {e}</div>
                ))}
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={handleSimulate}
              disabled={errors.length > 0}
              className="w-full py-4 text-white border-none rounded-xl text-base font-bold tracking-wide transition-all"
              style={{
                background: errors.length > 0 ? C.sand300 : `linear-gradient(135deg, ${C.olive500}, ${C.olive600})`,
                cursor: errors.length > 0 ? 'not-allowed' : 'pointer',
                boxShadow: errors.length > 0 ? 'none' : '0 4px 16px rgba(46,158,166,.4)',
              }}
            >
              SIMULAR FINANCIAMENTO
            </button>
          </div>
        </div>
      </section>

      {/* ═══ Results Modal with Overlay ═══ */}
      <AnimatePresence>
        {showResults && (
          <>
            {/* Dark overlay */}
            <motion.div
              className="fixed inset-0 z-[60] bg-charcoal-900/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeModal}
            />

            {/* Modal container */}
            <motion.div
              className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto py-6 px-3 md:py-10 md:px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
            >
              <motion.div
                ref={modalRef}
                className="relative w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl"
                style={{ background: C.charcoal800 }}
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.97 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal header with close button */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/10" style={{ background: C.olive900 }}>
                  <div>
                    <h2 className="font-heading text-xl md:text-2xl text-white">Resultado da Simulacao</h2>
                    <p className="text-olive-300 text-xs mt-0.5">
                      {formatBRL(principal)} em {effectiveTerm / 12} anos
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Modal body */}
                <div className="p-5 md:p-8 space-y-6">

                  {/* Bank comparison */}
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-1 tracking-wide uppercase">Comparativo por Banco</h3>
                    <div className="gold-divider mb-4" />
                    <div className="flex flex-col gap-3">
                      {BANKS.map((b, i) => (
                        <BankCard
                          key={i} bank={b} principal={principal} months={term}
                          income={incomeVal} isSelected={selectedBank === i}
                          onClick={() => setSelectedBank(i)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Detailed view */}
                  <div className="bg-white rounded-2xl p-5 md:p-6">
                    <div className="flex items-center gap-2.5 mb-5">
                      <div className="w-1 h-7 rounded-sm" style={{ background: bank.color }} />
                      <h3 className="text-lg font-bold text-charcoal-800">{bank.name} &mdash; Detalhamento</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {[
                        { label: 'SAC \u2014 1a Parcela', value: formatBRL(sac.firstPayment), sub: `Ultima: ${formatBRL(sac.lastPayment)}`, bg: C.olive50, color: C.olive600 },
                        { label: 'PRICE \u2014 Parcela Fixa', value: formatBRL(price.firstPayment), sub: 'Todas iguais', bg: C.gold50, color: C.gold500 },
                        { label: 'Total Juros SAC', value: formatBRL(sac.totalInterest), sub: `Total pago: ${formatBRL(sac.totalPaid)}`, bg: C.olive50, color: C.olive600 },
                        { label: 'Total Juros PRICE', value: formatBRL(price.totalInterest), sub: `Total pago: ${formatBRL(price.totalPaid)}`, bg: C.gold50, color: C.gold500 },
                      ].map((item, i) => (
                        <div key={i} className="rounded-xl p-3.5" style={{ background: item.bg }}>
                          <div className="text-[10px] font-bold tracking-wider mb-1" style={{ color: item.color }}>{item.label}</div>
                          <div className="text-lg font-extrabold text-charcoal-900">{item.value}</div>
                          <div className="text-[11px] text-charcoal-400 mt-0.5">{item.sub}</div>
                        </div>
                      ))}
                    </div>

                    {/* Savings callout */}
                    {sac.totalPaid < price.totalPaid && (
                      <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 mb-5 text-center">
                        <span className="text-sm text-emerald-800 font-semibold">
                          Com SAC voce economiza <strong>{formatBRL(price.totalPaid - sac.totalPaid)}</strong> em juros comparado ao PRICE
                        </span>
                      </div>
                    )}

                    {/* Line chart */}
                    <h4 className="text-sm font-bold text-charcoal-500 mb-2.5">Evolucao das Parcelas</h4>
                    <div className="w-full h-64">
                      <ResponsiveContainer>
                        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={C.sand200} />
                          <XAxis dataKey="month" tick={{ fontSize: 10, fill: C.sand300 }} />
                          <YAxis tick={{ fontSize: 10, fill: C.sand300 }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                          <Tooltip content={<ChartTooltip />} />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                          <Line type="monotone" dataKey="SAC" stroke={C.olive500} strokeWidth={2.5} dot={false} />
                          <Line type="monotone" dataKey="PRICE" stroke={C.gold400} strokeWidth={2.5} dot={false} strokeDasharray="6 3" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Bar chart - Interest comparison */}
                  <div className="bg-white rounded-2xl p-5 md:p-6">
                    <h4 className="text-sm font-bold text-charcoal-500 mb-1">Total de Juros por Banco (em milhares R$)</h4>
                    <p className="text-[11px] text-charcoal-300 mb-4">Compare quanto cada banco cobra de juros ao longo do financiamento</p>
                    <div className="w-full h-60">
                      <ResponsiveContainer>
                        <BarChart data={comparisonData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={C.sand200} />
                          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#7D868A' }} />
                          <YAxis tick={{ fontSize: 10, fill: C.sand300 }} tickFormatter={(v: number) => `${v}k`} />
                          <Tooltip formatter={(v) => [`R$ ${v}k`, '']} />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                          <Bar dataKey="totalSAC" name="Juros SAC" radius={[6, 6, 0, 0] as [number, number, number, number]}>
                            {comparisonData.map((entry, i) => <Cell key={i} fill={entry.color} opacity={0.7} />)}
                          </Bar>
                          <Bar dataKey="totalPRICE" name="Juros PRICE" radius={[6, 6, 0, 0] as [number, number, number, number]}>
                            {comparisonData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="rounded-xl p-4 border border-white/10 bg-white/5">
                    <p className="text-charcoal-300 text-[11px] leading-relaxed">
                      <strong className="text-sand-300">Aviso importante:</strong> Esta simulacao e apenas uma estimativa com fins informativos. Os valores reais podem variar conforme analise de credito, relacionamento com o banco, seguros obrigatorios (MIP e DFI), taxas administrativas e CET. Taxas de juros sao aproximadas e sujeitas a alteracao. Consulte a instituicao financeira para valores oficiais. A parcela nao deve comprometer mais de 30% da renda bruta familiar.
                    </p>
                  </div>

                  {/* CTA WhatsApp */}
                  <div className="text-center pt-2 pb-4">
                    <p className="text-sand-300 text-sm mb-4">Gostou da simulacao? Fale com um especialista!</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => openWhatsApp('/simulador')}
                        className="btn-whatsapp"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Falar com Especialista
                      </button>
                      <button
                        onClick={closeModal}
                        className="btn-outline !py-3"
                      >
                        Nova Simulacao
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  )
}
