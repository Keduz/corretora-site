'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { properties, formatPrice, type Property } from '@/data/properties'

const STORAGE_KEY = 'corretora-admin-properties'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const typeLabels: Record<string, string> = {
  apartamento: 'Apartamento',
  casa: 'Casa',
  cobertura: 'Cobertura',
  terreno: 'Terreno',
  comercial: 'Comercial',
}

const statusLabels: Record<string, string> = {
  ativo: 'Ativo',
  vendido: 'Vendido',
  alugado: 'Alugado',
  inativo: 'Inativo',
}

const statusColors: Record<string, string> = {
  ativo: 'bg-olive-100 text-olive-700',
  vendido: 'bg-gold-100 text-gold-700',
  alugado: 'bg-blue-100 text-blue-700',
  inativo: 'bg-charcoal-100 text-charcoal-600',
}

type NavSection = 'dashboard' | 'imoveis' | 'configuracoes'

/* ─────────── Toast Component (standalone, no framer-motion) ─────────── */
function AdminToast({
  message,
  type,
  onClose,
}: {
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200)
    return () => clearTimeout(t)
  }, [onClose])

  const bg =
    type === 'success'
      ? 'bg-olive-600 text-white'
      : type === 'error'
      ? 'bg-red-600 text-white'
      : 'bg-charcoal-800 text-sand-100'

  return (
    <div
      className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-medium max-w-sm animate-[slideIn_0.3s_ease-out] ${bg}`}
    >
      {type === 'success' && (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      )}
      {type === 'error' && (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {type === 'info' && (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
      )}
      {message}
    </div>
  )
}

/* ─────────── Login Screen ─────────── */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'admin123') {
      sessionStorage.setItem('admin_auth', 'true')
      onLogin()
    } else {
      setError(true)
      setTimeout(() => setError(false), 2500)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-olive-500 mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
                />
              </svg>
            </div>
            <h1 className="font-heading text-2xl font-bold text-charcoal-800">Painel Administrativo</h1>
            <p className="text-charcoal-400 mt-2 text-sm">Insira sua senha para acessar o painel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal-600 mb-1.5">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors duration-200 bg-sand-50 outline-none text-charcoal-800 placeholder:text-charcoal-300 ${
                  error ? 'border-red-400 bg-red-50' : 'border-sand-200 focus:border-olive-400'
                }`}
                placeholder="Digite sua senha"
                autoFocus
              />
              {error && <p className="text-red-500 text-xs mt-2">Senha incorreta. Tente novamente.</p>}
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #6B7F4A, #94A76B)',
                boxShadow: '0 4px 20px rgba(107,127,74,0.3)',
              }}
            >
              Entrar
            </button>
          </form>
        </div>
        <p className="text-center text-charcoal-300 text-xs mt-6">
          Acesso restrito a administradores
        </p>
      </div>
    </div>
  )
}

/* ─────────── Sidebar ─────────── */
function Sidebar({
  active,
  onNavigate,
  mobileOpen,
  onCloseMobile,
}: {
  active: NavSection
  onNavigate: (s: NavSection) => void
  mobileOpen: boolean
  onCloseMobile: () => void
}) {
  const navItems: { key: NavSection; label: string; icon: React.ReactNode }[] = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
          />
        </svg>
      ),
    },
    {
      key: 'imoveis',
      label: 'Imoveis',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
          />
        </svg>
      ),
    },
    {
      key: 'configuracoes',
      label: 'Configuracoes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ]

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-6 border-b border-sand-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-olive-500 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
              />
            </svg>
          </div>
          <div>
            <h2 className="font-heading font-bold text-charcoal-800 text-sm leading-tight">Corretora</h2>
            <p className="text-xs text-charcoal-400">Administracao</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              onNavigate(item.key)
              onCloseMobile()
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              active === item.key
                ? 'bg-olive-500 text-white shadow-md'
                : 'text-charcoal-500 hover:bg-sand-100 hover:text-charcoal-700'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sand-200">
        <a
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-charcoal-400 hover:bg-sand-100 hover:text-charcoal-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          Voltar ao Site
        </a>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-sand-200 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-charcoal-900/50" onClick={onCloseMobile} />
          <aside className="relative w-72 max-w-[85vw] h-full bg-white shadow-2xl">{sidebarContent}</aside>
        </div>
      )}
    </>
  )
}

/* ─────────── Property Modal (Create / Edit) ─────────── */
function PropertyModal({
  property,
  onSave,
  onClose,
}: {
  property: Property | null
  onSave: (data: Property) => void
  onClose: () => void
}) {
  const isEdit = property !== null
  const [form, setForm] = useState({
    title: property?.title ?? '',
    type: property?.type ?? 'apartamento',
    transaction: property?.transaction ?? 'venda',
    price: property ? String(property.price) : '',
    condoFee: property?.condoFee ? String(property.condoFee) : '',
    city: property?.city ?? 'Salvador',
    neighborhood: property?.neighborhood ?? '',
    bedrooms: property ? String(property.bedrooms) : '0',
    bathrooms: property ? String(property.bathrooms) : '0',
    area: property ? String(property.area) : '',
    parking: property ? String(property.parking) : '0',
    description: property?.description ?? '',
    features: property?.features.join(', ') ?? '',
    featured: property?.featured ?? false,
    status: property?.status ?? 'ativo',
  })
  const [imageList, setImageList] = useState<string[]>(property?.images ?? [])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const processFiles = (files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = () => {
        setImageList((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files)
  }

  const removeImage = (index: number) => {
    setImageList((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: property?.id ?? Date.now(),
      slug: property?.slug ?? slugify(form.title),
      title: form.title,
      type: form.type as Property['type'],
      transaction: form.transaction as Property['transaction'],
      price: Number(form.price) || 0,
      condoFee: Number(form.condoFee) || undefined,
      city: form.city as Property['city'],
      neighborhood: form.neighborhood,
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      area: Number(form.area) || 0,
      parking: Number(form.parking) || 0,
      description: form.description,
      features: form.features
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
      images: imageList,
      featured: form.featured,
      status: form.status as Property['status'],
    })
  }

  const inputClass =
    'w-full px-3 py-2.5 rounded-xl border-2 border-sand-200 bg-sand-50 outline-none text-sm text-charcoal-700 focus:border-olive-400 transition-colors'
  const labelClass = 'block text-xs font-semibold text-charcoal-500 uppercase tracking-wide mb-1'

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-charcoal-900/60 p-4 pt-8 pb-8">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl animate-[slideIn_0.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sand-100">
          <h2 className="font-heading text-xl font-bold text-charcoal-800">
            {isEdit ? 'Editar Imovel' : 'Novo Imovel'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-sand-100 text-charcoal-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
            {/* Title */}
            <div>
              <label className={labelClass}>Titulo</label>
              <input
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                className={inputClass}
                placeholder="Ex: Apartamento de Luxo na Pituba"
                required
              />
            </div>

            {/* Type / Transaction / Status */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Tipo</label>
                <select value={form.type} onChange={(e) => set('type', e.target.value)} className={inputClass}>
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa</option>
                  <option value="cobertura">Cobertura</option>
                  <option value="terreno">Terreno</option>
                  <option value="comercial">Comercial</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Transacao</label>
                <select
                  value={form.transaction}
                  onChange={(e) => set('transaction', e.target.value)}
                  className={inputClass}
                >
                  <option value="venda">Venda</option>
                  <option value="aluguel">Aluguel</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputClass}>
                  <option value="ativo">Ativo</option>
                  <option value="vendido">Vendido</option>
                  <option value="alugado">Alugado</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            </div>

            {/* City / Neighborhood */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Cidade</label>
                <select value={form.city} onChange={(e) => set('city', e.target.value)} className={inputClass}>
                  <option value="Salvador">Salvador</option>
                  <option value="Feira de Santana">Feira de Santana</option>
                  <option value="Alagoinhas">Alagoinhas</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Bairro</label>
                <input
                  value={form.neighborhood}
                  onChange={(e) => set('neighborhood', e.target.value)}
                  className={inputClass}
                  placeholder="Ex: Pituba"
                  required
                />
              </div>
            </div>

            {/* Price / CondoFee */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Preco (R$)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  className={inputClass}
                  min="0"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Condominio (R$)</label>
                <input
                  type="number"
                  value={form.condoFee}
                  onChange={(e) => set('condoFee', e.target.value)}
                  className={inputClass}
                  min="0"
                />
              </div>
            </div>

            {/* Bedrooms / Bathrooms / Area / Parking */}
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className={labelClass}>Quartos</label>
                <input
                  type="number"
                  value={form.bedrooms}
                  onChange={(e) => set('bedrooms', e.target.value)}
                  className={inputClass}
                  min="0"
                />
              </div>
              <div>
                <label className={labelClass}>Banheiros</label>
                <input
                  type="number"
                  value={form.bathrooms}
                  onChange={(e) => set('bathrooms', e.target.value)}
                  className={inputClass}
                  min="0"
                />
              </div>
              <div>
                <label className={labelClass}>Area (m2)</label>
                <input
                  type="number"
                  value={form.area}
                  onChange={(e) => set('area', e.target.value)}
                  className={inputClass}
                  min="0"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Vagas</label>
                <input
                  type="number"
                  value={form.parking}
                  onChange={(e) => set('parking', e.target.value)}
                  className={inputClass}
                  min="0"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>Descricao</label>
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                className={`${inputClass} resize-none`}
                rows={3}
              />
            </div>

            {/* Features */}
            <div>
              <label className={labelClass}>Caracteristicas (separadas por virgula)</label>
              <input
                value={form.features}
                onChange={(e) => set('features', e.target.value)}
                className={inputClass}
                placeholder="Piscina, Academia, Portaria 24h"
              />
            </div>

            {/* Images */}
            <div>
              <label className={labelClass}>Imagens</label>
              {imageList.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {imageList.map((img, i) => (
                    <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-sand-100">
                      <img src={img} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-olive-500 text-white px-1.5 py-0.5 rounded">
                          CAPA
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-olive-400 bg-olive-50'
                    : 'border-sand-300 hover:border-olive-300 hover:bg-sand-50'
                }`}
              >
                <svg className="w-8 h-8 mx-auto mb-2 text-charcoal-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <p className="text-sm font-medium text-charcoal-500">
                  Clique para selecionar ou arraste imagens aqui
                </p>
                <p className="text-xs text-charcoal-300 mt-1">JPG, PNG, WebP</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Featured */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set('featured', e.target.checked)}
                className="w-4 h-4 rounded border-sand-300 text-olive-500 focus:ring-olive-400"
              />
              <span className="text-sm font-medium text-charcoal-600">Destaque na pagina inicial</span>
            </label>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-sand-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-charcoal-500 hover:bg-sand-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #6B7F4A, #94A76B)',
                boxShadow: '0 4px 16px rgba(107,127,74,0.3)',
              }}
            >
              {isEdit ? 'Salvar Alteracoes' : 'Criar Imovel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ─────────── Delete Confirmation Dialog ─────────── */
function DeleteDialog({
  property,
  onConfirm,
  onCancel,
}: {
  property: Property
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-900/60 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-[slideIn_0.25s_ease-out]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-heading font-bold text-charcoal-800">Excluir Imovel</h3>
            <p className="text-sm text-charcoal-400 mt-0.5">Esta acao nao pode ser desfeita.</p>
          </div>
        </div>
        <p className="text-sm text-charcoal-600 mb-6">
          Tem certeza que deseja excluir <strong>&ldquo;{property.title}&rdquo;</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-charcoal-500 hover:bg-sand-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────── Main Admin Page ─────────── */
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [section, setSection] = useState<NavSection>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [localProperties, setLocalProperties] = useState(properties)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null)

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === 'true') {
      setAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) setLocalProperties(parsed)
      } catch { /* ignore */ }
    }
  }, [])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type })
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth')
    setAuthenticated(false)
  }

  const handleSaveProperty = (data: Property) => {
    const exists = localProperties.some((p) => p.id === data.id)
    const updated = exists
      ? localProperties.map((p) => (p.id === data.id ? data : p))
      : [...localProperties, data]
    setLocalProperties(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setEditingProperty(null)
    setIsCreating(false)
    showToast(exists ? 'Imovel atualizado com sucesso!' : 'Imovel criado com sucesso!', 'success')
  }

  const handleDeleteProperty = (id: number) => {
    const updated = localProperties.filter((p) => p.id !== id)
    setLocalProperties(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setDeletingProperty(null)
    showToast('Imovel excluido com sucesso!', 'success')
  }

  if (!authenticated) {
    return <LoginScreen onLogin={() => setAuthenticated(true)} />
  }

  /* ── Compute metrics ── */
  const total = localProperties.length
  const ativos = localProperties.filter((p) => p.status === 'ativo').length
  const emDestaque = localProperties.filter((p) => p.featured).length
  const cidades = new Set(localProperties.map((p) => p.city)).size

  const filteredProperties = searchQuery
    ? localProperties.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : localProperties

  return (
    <div className="min-h-screen bg-sand-50">
      <Sidebar
        active={section}
        onNavigate={setSection}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Top header bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-sand-200">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-3">
              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-lg text-charcoal-500 hover:bg-sand-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              <h1 className="font-heading text-lg sm:text-xl font-bold text-charcoal-800">Painel Admin</h1>
            </div>

            <div className="flex items-center gap-3">
              {/* User badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-sand-100">
                <div className="w-6 h-6 rounded-full bg-olive-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <span className="text-xs font-medium text-charcoal-600">Admin</span>
              </div>
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-charcoal-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* ──────── Dashboard Section ──────── */}
          {section === 'dashboard' && (
            <div>
              {/* Welcome */}
              <div className="mb-8">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal-800">
                  Bem-vindo ao Painel
                </h2>
                <p className="text-charcoal-400 mt-1">Gerencie seus imoveis e acompanhe as metricas.</p>
              </div>

              {/* Metric cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-10">
                {/* Total */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-olive-50 flex items-center justify-center">
                      <svg className="w-6 h-6 text-olive-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-olive-600 bg-olive-50 px-2.5 py-1 rounded-full">Total</span>
                  </div>
                  <p className="text-3xl font-bold text-charcoal-800">{total}</p>
                  <p className="text-sm text-charcoal-400 mt-1">Total de Imoveis</p>
                </div>

                {/* Ativos */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">Online</span>
                  </div>
                  <p className="text-3xl font-bold text-charcoal-800">{ativos}</p>
                  <p className="text-sm text-charcoal-400 mt-1">Ativos</p>
                </div>

                {/* Em Destaque */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-gold-600 bg-gold-50 px-2.5 py-1 rounded-full">Destaque</span>
                  </div>
                  <p className="text-3xl font-bold text-charcoal-800">{emDestaque}</p>
                  <p className="text-sm text-charcoal-400 mt-1">Em Destaque</p>
                </div>

                {/* Cidades */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-charcoal-50 flex items-center justify-center">
                      <svg className="w-6 h-6 text-charcoal-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-charcoal-500 bg-charcoal-50 px-2.5 py-1 rounded-full">Regioes</span>
                  </div>
                  <p className="text-3xl font-bold text-charcoal-800">{cidades}</p>
                  <p className="text-sm text-charcoal-400 mt-1">Cidades</p>
                </div>
              </div>

              {/* Quick summary by type */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                {/* By type */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-100">
                  <h3 className="font-heading font-bold text-charcoal-800 mb-4">Por Tipo</h3>
                  <div className="space-y-3">
                    {Object.entries(typeLabels).map(([key, label]) => {
                      const count = localProperties.filter((p) => p.type === key).length
                      const pct = total > 0 ? (count / total) * 100 : 0
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-charcoal-600">{label}</span>
                            <span className="font-semibold text-charcoal-800">{count}</span>
                          </div>
                          <div className="w-full h-2 bg-sand-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${pct}%`,
                                background: 'linear-gradient(135deg, #6B7F4A, #94A76B)',
                              }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* By city */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-100">
                  <h3 className="font-heading font-bold text-charcoal-800 mb-4">Por Cidade</h3>
                  <div className="space-y-3">
                    {Array.from(new Set(localProperties.map((p) => p.city))).map((city) => {
                      const count = localProperties.filter((p) => p.city === city).length
                      const pct = total > 0 ? (count / total) * 100 : 0
                      return (
                        <div key={city}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-charcoal-600">{city}</span>
                            <span className="font-semibold text-charcoal-800">{count}</span>
                          </div>
                          <div className="w-full h-2 bg-sand-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${pct}%`,
                                background: 'linear-gradient(135deg, #D4A843, #B8922E)',
                              }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Recent properties quick list */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-charcoal-800">Imoveis Recentes</h3>
                  <button
                    onClick={() => setSection('imoveis')}
                    className="text-sm font-medium text-olive-600 hover:text-olive-700 transition-colors"
                  >
                    Ver todos
                  </button>
                </div>
                <div className="space-y-3">
                  {localProperties.slice(0, 5).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-sand-50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-sand-100 shrink-0">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-charcoal-800 truncate">{p.title}</p>
                        <p className="text-xs text-charcoal-400">
                          {p.city} &middot; {typeLabels[p.type]}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-olive-600 whitespace-nowrap">
                        {formatPrice(p.price, p.transaction)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ──────── Imoveis Section ──────── */}
          {section === 'imoveis' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal-800">Imoveis</h2>
                  <p className="text-charcoal-400 mt-1">
                    {filteredProperties.length} imovel{filteredProperties.length !== 1 ? 'is' : ''} encontrado
                    {filteredProperties.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => setIsCreating(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white text-sm transition-all duration-300 hover:-translate-y-0.5 shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #6B7F4A, #94A76B)',
                    boxShadow: '0 4px 16px rgba(107,127,74,0.3)',
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Novo Imovel
                </button>
              </div>

              {/* Search bar */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <svg
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Buscar por titulo, cidade ou bairro..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-sand-200 bg-white outline-none text-sm text-charcoal-700 placeholder:text-charcoal-300 focus:border-olive-400 transition-colors"
                  />
                </div>
              </div>

              {/* Desktop table */}
              <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-sand-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-sand-100">
                        <th className="text-left text-xs font-semibold text-charcoal-400 uppercase tracking-wider px-6 py-4">
                          Imovel
                        </th>
                        <th className="text-left text-xs font-semibold text-charcoal-400 uppercase tracking-wider px-4 py-4">
                          Tipo
                        </th>
                        <th className="text-left text-xs font-semibold text-charcoal-400 uppercase tracking-wider px-4 py-4">
                          Cidade
                        </th>
                        <th className="text-left text-xs font-semibold text-charcoal-400 uppercase tracking-wider px-4 py-4">
                          Preco
                        </th>
                        <th className="text-left text-xs font-semibold text-charcoal-400 uppercase tracking-wider px-4 py-4">
                          Status
                        </th>
                        <th className="text-right text-xs font-semibold text-charcoal-400 uppercase tracking-wider px-6 py-4">
                          Acoes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand-50">
                      {filteredProperties.map((p) => (
                        <tr key={p.id} className="hover:bg-sand-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-sand-100 shrink-0">
                                <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-charcoal-800 truncate max-w-[200px]">{p.title}</p>
                                <p className="text-xs text-charcoal-400">{p.neighborhood}</p>
                              </div>
                              {p.featured && (
                                <svg className="w-4 h-4 text-gold-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                </svg>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-charcoal-600">{typeLabels[p.type]}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-charcoal-600">{p.city}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm font-semibold text-charcoal-800">
                              {formatPrice(p.price, p.transaction)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                statusColors[p.status]
                              }`}
                            >
                              {statusLabels[p.status]}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingProperty(p)}
                                className="p-2 rounded-lg text-charcoal-400 hover:bg-olive-50 hover:text-olive-600 transition-colors"
                                title="Editar"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => setDeletingProperty(p)}
                                className="p-2 rounded-lg text-charcoal-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                title="Excluir"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile card list */}
              <div className="md:hidden space-y-3">
                {filteredProperties.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-sand-100">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-sand-100 shrink-0">
                        <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-charcoal-800 truncate">{p.title}</p>
                          {p.featured && (
                            <svg className="w-3.5 h-3.5 text-gold-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                          )}
                        </div>
                        <p className="text-xs text-charcoal-400 mt-0.5">
                          {typeLabels[p.type]} &middot; {p.city}, {p.neighborhood}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-charcoal-800">
                          {formatPrice(p.price, p.transaction)}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            statusColors[p.status]
                          }`}
                        >
                          {statusLabels[p.status]}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingProperty(p)}
                          className="p-2 rounded-lg text-charcoal-400 hover:bg-olive-50 hover:text-olive-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeletingProperty(p)}
                          className="p-2 rounded-lg text-charcoal-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProperties.length === 0 && (
                <div className="text-center py-16">
                  <svg className="w-16 h-16 text-charcoal-200 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <p className="text-charcoal-400 font-medium">Nenhum imovel encontrado</p>
                  <p className="text-charcoal-300 text-sm mt-1">Tente alterar os termos da busca</p>
                </div>
              )}
            </div>
          )}

          {/* ──────── Configuracoes Section ──────── */}
          {section === 'configuracoes' && (
            <div>
              <div className="mb-8">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal-800">Configuracoes</h2>
                <p className="text-charcoal-400 mt-1">Gerencie as configuracoes do painel.</p>
              </div>

              <div className="max-w-2xl space-y-6">
                {/* Info card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-100">
                  <h3 className="font-heading font-bold text-charcoal-800 mb-4">Informacoes do Sistema</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-sand-50">
                      <span className="text-charcoal-400">Versao</span>
                      <span className="font-medium text-charcoal-700">1.0.0</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-sand-50">
                      <span className="text-charcoal-400">Framework</span>
                      <span className="font-medium text-charcoal-700">Next.js 14</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-sand-50">
                      <span className="text-charcoal-400">Armazenamento</span>
                      <span className="font-medium text-charcoal-700">localStorage (estatico)</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-charcoal-400">Total de Imoveis</span>
                      <span className="font-medium text-charcoal-700">{total}</span>
                    </div>
                  </div>
                </div>

                {/* Danger zone */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100">
                  <h3 className="font-heading font-bold text-red-600 mb-2">Zona de Perigo</h3>
                  <p className="text-sm text-charcoal-400 mb-4">
                    Acoes irreversiveis. Use com cuidado.
                  </p>
                  <button
                    onClick={() => {
                      localStorage.clear()
                      setLocalProperties(properties)
                      showToast('Cache local limpo com sucesso!', 'success')
                    }}
                    className="px-5 py-2.5 rounded-xl border-2 border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Limpar Cache Local
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit / Create Modal */}
      {(editingProperty || isCreating) && (
        <PropertyModal
          property={editingProperty}
          onSave={handleSaveProperty}
          onClose={() => {
            setEditingProperty(null)
            setIsCreating(false)
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deletingProperty && (
        <DeleteDialog
          property={deletingProperty}
          onConfirm={() => handleDeleteProperty(deletingProperty.id)}
          onCancel={() => setDeletingProperty(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <AdminToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Inline animation keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(80px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
      ` }} />
    </div>
  )
}
