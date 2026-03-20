'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { properties, formatPrice, type Property } from '@/data/properties'
import { portais, type Portal } from '@/data/portais'
import { type BlogPost, defaultPosts, blogCategories, BLOG_STORAGE_KEY, BLOG_VERSION_KEY, BLOG_CURRENT_VERSION, formatDate } from '@/data/blog'
import dynamic from 'next/dynamic'

const BlogEditor = dynamic(() => import('@/components/BlogEditor'), {
  ssr: false,
  loading: () => (
    <div className="border-2 border-sand-200 rounded-xl bg-sand-50 flex items-center justify-center h-[300px]">
      <div className="flex items-center gap-2 text-charcoal-400 text-sm">
        <div className="w-5 h-5 border-2 border-olive-500 border-t-transparent rounded-full animate-spin" />
        Carregando editor...
      </div>
    </div>
  ),
})

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

const PORTAIS_STORAGE_KEY = 'corretora-admin-portais'

type NavSection = 'dashboard' | 'imoveis' | 'blog' | 'portais' | 'leads' | 'configuracoes'

type PortalConfig = {
  apiKey: string
  apiSecret: string
  feedUrl: string
  status: 'conectado' | 'desconectado' | 'pendente'
  autoSync: boolean
  lastSync: string | null
}

const PORTAL_CONFIGS_KEY = 'corretora-portal-configs'

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
            <img
              src="/logo.png"
              alt="Jeová Guedes Imoveis"
              className="h-20 w-auto mx-auto mb-4"
            />
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
                background: 'linear-gradient(135deg, #258389, #2E9EA6)',
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
      key: 'blog' as NavSection,
      label: 'Blog',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
        </svg>
      ),
    },
    {
      key: 'portais',
      label: 'Portais',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.02a4.5 4.5 0 00-6.364-6.364L4.5 8.257m10.5-1.5l2.25 2.25M16.5 12h3m-1.5-3v6"
          />
        </svg>
      ),
    },
    {
      key: 'leads',
      label: 'Leads',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
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
          <img
            src="/logo.png"
            alt="Jeová Guedes Imoveis"
            className="h-11 w-auto shrink-0"
          />
          <div>
            <h2 className="font-heading font-bold text-charcoal-800 text-sm leading-tight">Jeová Guedes</h2>
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
    youtubeVideoId: property?.youtubeVideoId ?? '',
    lat: property ? String(property.lat) : '-12.9714',
    lng: property ? String(property.lng) : '-38.5124',
    featured: property?.featured ?? false,
    status: property?.status ?? 'ativo',
  })
  const mapPickerRef = useRef<HTMLDivElement>(null)
  const mapPickerInstanceRef = useRef<unknown>(null)
  const markerRef = useRef<unknown>(null)
  const [imageList, setImageList] = useState<string[]>(property?.images ?? [])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  // Initialize map picker
  useEffect(() => {
    if (!mapPickerRef.current || mapPickerInstanceRef.current) return
    const initPicker = async () => {
      const L = (await import('leaflet')).default
      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })
      const lat = Number(form.lat) || -12.9714
      const lng = Number(form.lng) || -38.5124
      const map = L.map(mapPickerRef.current!, { center: [lat, lng], zoom: 13 })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map)
      const marker = L.marker([lat, lng], { icon, draggable: true }).addTo(map)
      markerRef.current = marker
      mapPickerInstanceRef.current = map

      marker.on('dragend', () => {
        const pos = marker.getLatLng()
        setForm((prev) => ({ ...prev, lat: pos.lat.toFixed(4), lng: pos.lng.toFixed(4) }))
      })
      map.on('click', (e: { latlng: { lat: number; lng: number } }) => {
        marker.setLatLng(e.latlng)
        setForm((prev) => ({ ...prev, lat: e.latlng.lat.toFixed(4), lng: e.latlng.lng.toFixed(4) }))
      })
    }
    const timer = setTimeout(initPicker, 100)
    return () => {
      clearTimeout(timer)
      if (mapPickerInstanceRef.current) {
        (mapPickerInstanceRef.current as { remove: () => void }).remove()
        mapPickerInstanceRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      youtubeVideoId: form.youtubeVideoId || undefined,
      lat: Number(form.lat) || -12.9714,
      lng: Number(form.lng) || -38.5124,
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

            {/* YouTube Video ID */}
            <div>
              <label className={labelClass}>Video YouTube (ID do video)</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                  <input
                    value={form.youtubeVideoId}
                    onChange={(e) => set('youtubeVideoId', e.target.value)}
                    className={`${inputClass} pl-9`}
                    placeholder="Ex: dQw4w9WgXcQ"
                  />
                </div>
                {form.youtubeVideoId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${form.youtubeVideoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors flex items-center gap-1 shrink-0"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    Ver
                  </a>
                )}
              </div>
              <p className="text-[10px] text-charcoal-300 mt-1">Cole apenas o ID do video (parte apos v= na URL do YouTube)</p>
            </div>

            {/* Location Map Picker */}
            <div>
              <label className={labelClass}>Localizacao no Mapa</label>
              <p className="text-[10px] text-charcoal-400 mb-2">Clique no mapa ou arraste o marcador para definir a localizacao do imovel</p>
              <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                crossOrigin=""
              />
              <div
                ref={mapPickerRef}
                className="h-56 rounded-xl overflow-hidden border-2 border-sand-200 z-0"
                style={{ position: 'relative' }}
              />
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <label className={labelClass}>Latitude</label>
                  <input
                    type="text"
                    value={form.lat}
                    onChange={(e) => set('lat', e.target.value)}
                    className={inputClass}
                    placeholder="-12.9714"
                  />
                </div>
                <div>
                  <label className={labelClass}>Longitude</label>
                  <input
                    type="text"
                    value={form.lng}
                    onChange={(e) => set('lng', e.target.value)}
                    className={inputClass}
                    placeholder="-38.5124"
                  />
                </div>
              </div>
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
                background: 'linear-gradient(135deg, #258389, #2E9EA6)',
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

/* ─────────── Leads Section ─────────── */
type Lead = {
  id: number
  nome: string
  telefone: string
  email: string | null
  origem: string
  criadoEm: string
  lido: boolean
}

function LeadsSection() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch('/api/leads')
      if (res.ok) {
        const data = await res.json()
        setLeads(data)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const marcarLido = async (id: number) => {
    try {
      await fetch(`/api/leads/${id}`, { method: 'PATCH' })
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, lido: true } : l)))
    } catch {
      // silently fail
    }
  }

  const deletarLead = async (id: number) => {
    if (!confirm('Excluir este lead?')) return
    try {
      await fetch(`/api/leads/${id}`, { method: 'DELETE' })
      setLeads((prev) => prev.filter((l) => l.id !== id))
    } catch {
      // silently fail
    }
  }

  const naoLidos = leads.filter((l) => !l.lido).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-olive-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal-800">Leads</h2>
          <p className="text-charcoal-400 mt-1">
            {leads.length} lead{leads.length !== 1 ? 's' : ''} capturado{leads.length !== 1 ? 's' : ''}
            {naoLidos > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-olive-100 text-olive-700">
                {naoLidos} novo{naoLidos !== 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={fetchLeads}
          className="px-4 py-2 rounded-xl text-sm font-medium text-charcoal-600 hover:bg-sand-100 transition-colors border border-sand-200"
        >
          <svg className="w-4 h-4 inline mr-1.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
          Atualizar
        </button>
      </div>

      {leads.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-sand-100 text-center">
          <svg className="w-12 h-12 mx-auto mb-4 text-charcoal-200" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          <p className="text-charcoal-400 font-medium">Nenhum lead capturado ainda</p>
          <p className="text-charcoal-300 text-sm mt-1">Os leads do popup aparecerao aqui.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${
                lead.lido ? 'border-sand-100' : 'border-olive-200 bg-olive-50/30'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!lead.lido && (
                      <span className="w-2 h-2 rounded-full bg-olive-500 flex-shrink-0" />
                    )}
                    <h4 className="font-semibold text-charcoal-800 truncate">{lead.nome}</h4>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-charcoal-500">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                      {lead.telefone}
                    </span>
                    {lead.email && (
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        {lead.email}
                      </span>
                    )}
                    <span className="text-charcoal-300 text-xs">
                      {new Date(lead.criadoEm).toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!lead.lido && (
                    <button
                      onClick={() => marcarLido(lead.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-olive-700 bg-olive-100 hover:bg-olive-200 transition-colors"
                    >
                      Marcar lido
                    </button>
                  )}
                  <button
                    onClick={() => deletarLead(lead.id)}
                    className="p-1.5 rounded-lg text-charcoal-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
  const [portalStatuses, setPortalStatuses] = useState<Record<number, Portal['status']>>({})
  const [portalSearch, setPortalSearch] = useState('')
  const [portalFilter, setPortalFilter] = useState<'todos' | 'pago' | 'gratuito'>('todos')
  const [portalSubTab, setPortalSubTab] = useState<'overview' | 'portais' | 'feed' | 'guia'>('overview')
  const [portalConfigs, setPortalConfigs] = useState<Record<number, PortalConfig>>({})
  const [configuringPortal, setConfiguringPortal] = useState<number | null>(null)
  const [testingConnection, setTestingConnection] = useState<number | null>(null)
  // Blog state
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(defaultPosts)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null)

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

  useEffect(() => {
    const stored = localStorage.getItem(PORTAIS_STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed && typeof parsed === 'object') setPortalStatuses(parsed)
      } catch { /* ignore */ }
    }
  }, [])

  const togglePortalStatus = useCallback((portalId: number) => {
    setPortalStatuses((prev) => {
      const portal = portais.find((p) => p.id === portalId)
      if (!portal) return prev
      const currentStatus = prev[portalId] ?? portal.status
      const newStatus: Portal['status'] = currentStatus === 'ativo' ? 'em-breve' : 'ativo'
      const updated = { ...prev, [portalId]: newStatus }
      localStorage.setItem(PORTAIS_STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const getPortalStatus = useCallback((portal: Portal): Portal['status'] => {
    return portalStatuses[portal.id] ?? portal.status
  }, [portalStatuses])

  // Load portal configs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(PORTAL_CONFIGS_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed && typeof parsed === 'object') setPortalConfigs(parsed)
      } catch { /* ignore */ }
    }
  }, [])

  const savePortalConfig = useCallback((portalId: number, config: PortalConfig) => {
    setPortalConfigs((prev) => {
      const updated = { ...prev, [portalId]: config }
      localStorage.setItem(PORTAL_CONFIGS_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  // Load blog posts from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(BLOG_STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) setBlogPosts(parsed)
      } catch { /* ignore */ }
    }
  }, [])

  const saveBlogPosts = useCallback((posts: BlogPost[]) => {
    setBlogPosts(posts)
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts))
    localStorage.setItem(BLOG_VERSION_KEY, String(BLOG_CURRENT_VERSION))
  }, [])

  const handleSavePost = useCallback((post: BlogPost) => {
    const isNew = !blogPosts.find(p => p.id === post.id)
    const updated = isNew ? [post, ...blogPosts] : blogPosts.map(p => p.id === post.id ? post : p)
    saveBlogPosts(updated)
    setEditingPost(null)
    setIsCreatingPost(false)
    setToast({ message: isNew ? 'Artigo criado com sucesso!' : 'Artigo atualizado!', type: 'success' })
  }, [blogPosts, saveBlogPosts])

  const handleDeletePost = useCallback((post: BlogPost) => {
    saveBlogPosts(blogPosts.filter(p => p.id !== post.id))
    setDeletingPost(null)
    setToast({ message: 'Artigo excluido!', type: 'info' })
  }, [blogPosts, saveBlogPosts])

  const handleTogglePostStatus = useCallback((post: BlogPost) => {
    const newStatus = post.status === 'publicado' ? 'rascunho' : 'publicado'
    const updated = blogPosts.map(p => p.id === post.id ? { ...p, status: newStatus } : p) as BlogPost[]
    saveBlogPosts(updated)
    setToast({ message: newStatus === 'publicado' ? 'Artigo publicado!' : 'Artigo movido para rascunho', type: 'success' })
  }, [blogPosts, saveBlogPosts])

  const handleToggleFeatured = useCallback((post: BlogPost) => {
    const updated = blogPosts.map(p => p.id === post.id ? { ...p, featured: !p.featured } : { ...p, featured: false })
    saveBlogPosts(updated)
    setToast({ message: post.featured ? 'Destaque removido' : `"${post.title}" agora e o destaque!`, type: 'success' })
  }, [blogPosts, saveBlogPosts])

  const generateXML = useCallback(() => {
    const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<imoveis>']
    localProperties.forEach((p) => {
      lines.push('  <imovel>')
      lines.push(`    <codigo>${p.slug}</codigo>`)
      lines.push(`    <titulo>${p.title}</titulo>`)
      lines.push(`    <tipo>${p.type}</tipo>`)
      lines.push(`    <transacao>${p.transaction}</transacao>`)
      lines.push('    <endereco>')
      lines.push(`      <bairro>${p.neighborhood}</bairro>`)
      lines.push(`      <cidade>${p.city}</cidade>`)
      lines.push('      <estado>BA</estado>')
      lines.push('    </endereco>')
      lines.push(`    <preco>${p.price}</preco>`)
      lines.push(`    <area>${p.area}</area>`)
      lines.push(`    <quartos>${p.bedrooms}</quartos>`)
      lines.push(`    <banheiros>${p.bathrooms}</banheiros>`)
      lines.push(`    <vagas>${p.parking}</vagas>`)
      lines.push(`    <descricao>${p.description}</descricao>`)
      lines.push('    <fotos>')
      p.images.forEach((img) => {
        lines.push(`      <foto>${img}</foto>`)
      })
      lines.push('    </fotos>')
      lines.push('    <coordenadas>')
      lines.push(`      <latitude>${p.lat}</latitude>`)
      lines.push(`      <longitude>${p.lng}</longitude>`)
      lines.push('    </coordenadas>')
      lines.push('  </imovel>')
    })
    lines.push('</imoveis>')
    return lines.join('\n')
  }, [localProperties])

  const generateCSV = useCallback(() => {
    const headers = ['Codigo', 'Titulo', 'Tipo', 'Transacao', 'Preco', 'Area', 'Quartos', 'Banheiros', 'Vagas', 'Bairro', 'Cidade', 'Estado', 'Status', 'Descricao']
    const rows = localProperties.map((p) => [
      p.slug,
      `"${p.title}"`,
      p.type,
      p.transaction,
      p.price,
      p.area,
      p.bedrooms,
      p.bathrooms,
      p.parking,
      `"${p.neighborhood}"`,
      `"${p.city}"`,
      'BA',
      p.status,
      `"${p.description.replace(/"/g, '""')}"`,
    ].join(','))
    return [headers.join(','), ...rows].join('\n')
  }, [localProperties])

  const downloadFile = useCallback((content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type })
  }, [])

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copiado para a area de transferencia!', 'success')
    }).catch(() => {
      showToast('Erro ao copiar. Tente novamente.', 'error')
    })
  }, [showToast])

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
                <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                <span className="text-xs font-medium text-charcoal-600">Jeová Guedes</span>
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
                                background: 'linear-gradient(135deg, #258389, #2E9EA6)',
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
                                background: 'linear-gradient(135deg, #258389, #2E9EA6)',
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
                    background: 'linear-gradient(135deg, #258389, #2E9EA6)',
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

          {/* ──────── Blog Section ──────── */}
          {section === 'blog' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-charcoal-800">Blog</h2>
                  <p className="text-charcoal-400 text-sm mt-1">{blogPosts.length} artigos &bull; {blogPosts.filter(p => p.status === 'publicado').length} publicados</p>
                </div>
                <button
                  onClick={() => {
                    setIsCreatingPost(true)
                    setEditingPost({
                      id: Date.now(),
                      slug: '',
                      title: '',
                      excerpt: '',
                      content: '',
                      category: blogCategories[0],
                      coverImage: '',
                      author: 'Jeová Guedes',
                      date: new Date().toISOString().split('T')[0],
                      readTime: '5 min',
                      tags: [],
                      status: 'rascunho',
                      featured: false,
                    })
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all"
                  style={{ background: 'linear-gradient(135deg, #258389, #2E9EA6)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Novo Artigo
                </button>
              </div>

              {/* Posts table */}
              <div className="bg-white rounded-2xl shadow-sm border border-sand-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-sand-200 bg-sand-50">
                        <th className="text-left px-5 py-3.5 font-semibold text-charcoal-500 text-xs tracking-wider uppercase">Artigo</th>
                        <th className="text-left px-4 py-3.5 font-semibold text-charcoal-500 text-xs tracking-wider uppercase hidden md:table-cell">Categoria</th>
                        <th className="text-left px-4 py-3.5 font-semibold text-charcoal-500 text-xs tracking-wider uppercase hidden md:table-cell">Data</th>
                        <th className="text-center px-4 py-3.5 font-semibold text-charcoal-500 text-xs tracking-wider uppercase">Status</th>
                        <th className="text-center px-3 py-3.5 font-semibold text-charcoal-500 text-xs tracking-wider uppercase hidden md:table-cell">Destaque</th>
                        <th className="text-right px-5 py-3.5 font-semibold text-charcoal-500 text-xs tracking-wider uppercase">Acoes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand-100">
                      {blogPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-sand-50/60 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {post.coverImage ? (
                                <img src={post.coverImage} alt="" className="w-14 h-10 rounded-lg object-cover shrink-0" />
                              ) : (
                                <div className="w-14 h-10 rounded-lg bg-sand-100 shrink-0 flex items-center justify-center">
                                  <svg className="w-5 h-5 text-charcoal-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 3h18" />
                                  </svg>
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="font-semibold text-charcoal-800 truncate max-w-[200px] md:max-w-[300px]">{post.title}</p>
                                <p className="text-charcoal-400 text-xs truncate max-w-[200px] md:max-w-[300px]">{post.excerpt}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            <span className="text-xs font-medium text-olive-600 bg-olive-50 px-2.5 py-1 rounded-full">{post.category}</span>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell text-charcoal-500 text-xs">{formatDate(post.date)}</td>
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => handleTogglePostStatus(post)}
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                                post.status === 'publicado'
                                  ? 'bg-olive-100 text-olive-700 hover:bg-olive-200'
                                  : 'bg-charcoal-100 text-charcoal-500 hover:bg-charcoal-200'
                              }`}
                            >
                              {post.status === 'publicado' ? 'Publicado' : 'Rascunho'}
                            </button>
                          </td>
                          <td className="px-3 py-4 text-center hidden md:table-cell">
                            <button
                              onClick={() => handleToggleFeatured(post)}
                              className={`p-1.5 rounded-lg transition-all ${post.featured ? 'text-gold-500 hover:text-gold-600 scale-110' : 'text-charcoal-300 hover:text-gold-400'}`}
                              title={post.featured ? 'Remover destaque' : 'Definir como destaque'}
                            >
                              <svg className="w-5 h-5" fill={post.featured ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                              </svg>
                            </button>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => { setEditingPost(post); setIsCreatingPost(false) }}
                                className="p-2 rounded-lg hover:bg-sand-100 text-charcoal-400 hover:text-olive-600 transition-colors"
                                title="Editar"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setDeletingPost(post)}
                                className="p-2 rounded-lg hover:bg-red-50 text-charcoal-400 hover:text-red-600 transition-colors"
                                title="Excluir"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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

              {/* Edit/Create Blog Post Modal */}
              {editingPost && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm p-4 md:p-8">
                  <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl my-4" onClick={e => e.stopPropagation()}>
                    <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-sand-200 bg-white rounded-t-2xl">
                      <h3 className="text-lg font-bold text-charcoal-800">
                        {isCreatingPost ? 'Novo Artigo' : 'Editar Artigo'}
                      </h3>
                      <button onClick={() => { setEditingPost(null); setIsCreatingPost(false) }} className="p-2 rounded-lg hover:bg-sand-100 text-charcoal-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                      {/* Title */}
                      <div>
                        <label className="block text-xs font-semibold text-charcoal-500 mb-1.5">TITULO</label>
                        <input
                          type="text" value={editingPost.title}
                          onChange={e => setEditingPost({ ...editingPost, title: e.target.value, slug: slugify(e.target.value) })}
                          className="w-full px-4 py-3 border-2 border-sand-200 rounded-xl bg-sand-50 text-charcoal-800 outline-none focus:border-olive-500"
                          placeholder="Titulo do artigo"
                        />
                        <span className="text-[10px] text-charcoal-300 mt-1 block">Slug: {editingPost.slug || '...'}</span>
                      </div>
                      {/* Excerpt */}
                      <div>
                        <label className="block text-xs font-semibold text-charcoal-500 mb-1.5">RESUMO</label>
                        <textarea
                          value={editingPost.excerpt}
                          onChange={e => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-sand-200 rounded-xl bg-sand-50 text-charcoal-800 outline-none focus:border-olive-500 h-20 resize-none"
                          placeholder="Breve descricao do artigo"
                        />
                      </div>
                      {/* Category + Date + ReadTime row */}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-charcoal-500 mb-1.5">CATEGORIA</label>
                          <select
                            value={editingPost.category}
                            onChange={e => setEditingPost({ ...editingPost, category: e.target.value })}
                            className="w-full px-3 py-3 border-2 border-sand-200 rounded-xl bg-sand-50 text-charcoal-800 outline-none focus:border-olive-500 text-sm"
                          >
                            {blogCategories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-charcoal-500 mb-1.5">DATA</label>
                          <input
                            type="date" value={editingPost.date}
                            onChange={e => setEditingPost({ ...editingPost, date: e.target.value })}
                            className="w-full px-3 py-3 border-2 border-sand-200 rounded-xl bg-sand-50 text-charcoal-800 outline-none focus:border-olive-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-charcoal-500 mb-1.5">TEMPO LEITURA</label>
                          <input
                            type="text" value={editingPost.readTime}
                            onChange={e => setEditingPost({ ...editingPost, readTime: e.target.value })}
                            className="w-full px-3 py-3 border-2 border-sand-200 rounded-xl bg-sand-50 text-charcoal-800 outline-none focus:border-olive-500 text-sm"
                            placeholder="5 min"
                          />
                        </div>
                      </div>
                      {/* Cover image */}
                      <div>
                        <label className="block text-xs font-semibold text-charcoal-500 mb-1.5">IMAGEM DE CAPA (URL)</label>
                        <input
                          type="text" value={editingPost.coverImage}
                          onChange={e => setEditingPost({ ...editingPost, coverImage: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-sand-200 rounded-xl bg-sand-50 text-charcoal-800 outline-none focus:border-olive-500"
                          placeholder="https://images.unsplash.com/..."
                        />
                        {editingPost.coverImage && (
                          <img src={editingPost.coverImage} alt="Preview" className="mt-2 w-full h-36 object-cover rounded-lg" />
                        )}
                      </div>
                      {/* Tags */}
                      <div>
                        <label className="block text-xs font-semibold text-charcoal-500 mb-1.5">TAGS (separadas por virgula)</label>
                        <input
                          type="text" value={editingPost.tags.join(', ')}
                          onChange={e => setEditingPost({ ...editingPost, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                          className="w-full px-4 py-3 border-2 border-sand-200 rounded-xl bg-sand-50 text-charcoal-800 outline-none focus:border-olive-500"
                          placeholder="mercado, bahia, investimento"
                        />
                      </div>
                      {/* Content - Rich Text Editor */}
                      <div>
                        <label className="block text-xs font-semibold text-charcoal-500 mb-1.5">CONTEUDO</label>
                        <BlogEditor
                          key={editingPost.id}
                          content={editingPost.content}
                          onChange={(html) => setEditingPost(prev => prev ? { ...prev, content: html } : prev)}
                        />
                      </div>
                      {/* Featured + Status */}
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox" checked={editingPost.featured}
                            onChange={e => setEditingPost({ ...editingPost, featured: e.target.checked })}
                            className="w-4 h-4 rounded accent-olive-500"
                          />
                          <span className="text-sm text-charcoal-600">Artigo destaque</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox" checked={editingPost.status === 'publicado'}
                            onChange={e => setEditingPost({ ...editingPost, status: e.target.checked ? 'publicado' : 'rascunho' })}
                            className="w-4 h-4 rounded accent-olive-500"
                          />
                          <span className="text-sm text-charcoal-600">Publicar agora</span>
                        </label>
                      </div>
                    </div>
                    {/* Footer actions */}
                    <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-sand-200 bg-white rounded-b-2xl">
                      <button onClick={() => { setEditingPost(null); setIsCreatingPost(false) }} className="px-5 py-2.5 rounded-xl text-sm font-medium text-charcoal-500 hover:bg-sand-100 transition-colors">
                        Cancelar
                      </button>
                      <button
                        onClick={() => editingPost.title && handleSavePost(editingPost)}
                        disabled={!editingPost.title}
                        className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, #258389, #2E9EA6)' }}
                      >
                        {isCreatingPost ? 'Criar Artigo' : 'Salvar Alteracoes'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Delete confirmation */}
              {deletingPost && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-900/60 backdrop-blur-sm p-4">
                  <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-charcoal-800 mb-2">Excluir artigo?</h3>
                    <p className="text-charcoal-500 text-sm mb-6">
                      &quot;{deletingPost.title}&quot; sera excluido permanentemente.
                    </p>
                    <div className="flex gap-3">
                      <button onClick={() => setDeletingPost(null)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-charcoal-500 bg-sand-100 hover:bg-sand-200 transition-colors">
                        Cancelar
                      </button>
                      <button onClick={() => handleDeletePost(deletingPost)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ──────── Portais Section ──────── */}
          {section === 'portais' && (() => {
            const enrichedPortais = portais.map((p) => ({
              ...p,
              status: getPortalStatus(p),
            }))
            const filteredPortais = enrichedPortais
              .filter((p) => p.name.toLowerCase().includes(portalSearch.toLowerCase()))
              .filter((p) => portalFilter === 'todos' ? true : p.category === portalFilter)
            const totalPortais = enrichedPortais.length
            const ativosPortais = enrichedPortais.filter((p) => p.status === 'ativo').length
            const pagosPortais = enrichedPortais.filter((p) => p.category === 'pago').length
            const gratuitosPortais = enrichedPortais.filter((p) => p.category === 'gratuito').length
            const feedUrl = 'https://jeovaimoveis.com.br/feed/imoveis.xml'

            const getConfigForPortal = (portalId: number): PortalConfig => {
              return portalConfigs[portalId] || {
                apiKey: '',
                apiSecret: '',
                feedUrl: `https://jeovaimoveis.com.br/feed/${portalId}.xml`,
                status: 'desconectado' as const,
                autoSync: false,
                lastSync: null,
              }
            }

            const handleTestConnection = (portalId: number) => {
              setTestingConnection(portalId)
              setTimeout(() => {
                const currentConfig = getConfigForPortal(portalId)
                const updatedConfig: PortalConfig = {
                  ...currentConfig,
                  status: 'conectado',
                  lastSync: new Date().toLocaleString('pt-BR'),
                }
                savePortalConfig(portalId, updatedConfig)
                setTestingConnection(null)
                showToast('Conexao testada com sucesso!', 'success')
              }, 2000)
            }

            return (
              <div>
                {/* Header */}
                <div className="mb-8">
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal-800">
                    Gerenciamento de Integracoes
                  </h2>
                  <p className="text-charcoal-400 mt-1">
                    {totalPortais} portais configurados &middot; {ativosPortais} ativos &middot; {localProperties.length} imoveis no feed
                  </p>
                </div>

                {/* Subtabs */}
                <div className="flex items-center gap-1 p-1 bg-sand-100 rounded-xl mb-8 overflow-x-auto">
                  {([
                    { key: 'overview' as const, label: 'Visao Geral', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
                    { key: 'portais' as const, label: 'Portais', icon: 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.02a4.5 4.5 0 00-6.364-6.364L4.5 8.257' },
                    { key: 'feed' as const, label: 'Feed XML', icon: 'M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67' },
                    { key: 'guia' as const, label: 'Guia de Integracao', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' },
                  ]).map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setPortalSubTab(tab.key)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        portalSubTab === tab.key
                          ? 'bg-white text-charcoal-800 shadow-sm'
                          : 'text-charcoal-400 hover:text-charcoal-600'
                      }`}
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                      </svg>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* ─── Subtab: Visao Geral ─── */}
                {portalSubTab === 'overview' && (
                  <div>
                    {/* Metric cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
                      {/* Total Portais */}
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-olive-50 flex items-center justify-center">
                            <svg className="w-6 h-6 text-olive-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.02a4.5 4.5 0 00-6.364-6.364L4.5 8.257" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-olive-600 bg-olive-50 px-2.5 py-1 rounded-full">Total</span>
                        </div>
                        <p className="text-3xl font-bold text-charcoal-800">{totalPortais}</p>
                        <p className="text-sm text-charcoal-400 mt-1">Total de Portais</p>
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
                        <p className="text-3xl font-bold text-charcoal-800">{ativosPortais}</p>
                        <p className="text-sm text-charcoal-400 mt-1">Ativos</p>
                      </div>

                      {/* Pagos */}
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-gold-600 bg-gold-50 px-2.5 py-1 rounded-full">Premium</span>
                        </div>
                        <p className="text-3xl font-bold text-charcoal-800">{pagosPortais}</p>
                        <p className="text-sm text-charcoal-400 mt-1">Pagos</p>
                      </div>

                      {/* Gratuitos */}
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-charcoal-50 flex items-center justify-center">
                            <svg className="w-6 h-6 text-charcoal-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-charcoal-500 bg-charcoal-50 px-2.5 py-1 rounded-full">Free</span>
                        </div>
                        <p className="text-3xl font-bold text-charcoal-800">{gratuitosPortais}</p>
                        <p className="text-sm text-charcoal-400 mt-1">Gratuitos</p>
                      </div>
                    </div>

                    {/* Export Tools */}
                    <h3 className="font-heading font-bold text-charcoal-800 text-lg mb-4">Ferramentas de Exportacao</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                      {/* Feed XML URL */}
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-heading font-bold text-charcoal-800 text-sm">Feed XML</h4>
                            <p className="text-xs text-charcoal-400">URL do feed para portais</p>
                          </div>
                        </div>
                        <div className="bg-sand-50 rounded-lg p-3 mb-3">
                          <p className="text-xs text-charcoal-600 font-mono break-all">{feedUrl}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(feedUrl)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                          </svg>
                          Copiar URL
                        </button>
                      </div>

                      {/* Exportar CSV */}
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M10.875 12c-.621 0-1.125.504-1.125 1.125M12 12c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125m0-2.625c-.621 0-1.125.504-1.125 1.125" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-heading font-bold text-charcoal-800 text-sm">Exportar CSV</h4>
                            <p className="text-xs text-charcoal-400">{localProperties.length} imoveis</p>
                          </div>
                        </div>
                        <p className="text-sm text-charcoal-500 mb-4">Gere um arquivo CSV com todos os imoveis cadastrados para importacao em planilhas.</p>
                        <button
                          onClick={() => {
                            downloadFile(generateCSV(), 'imoveis-jeova-guedes.csv', 'text/csv;charset=utf-8')
                            showToast('CSV baixado com sucesso!', 'success')
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          Baixar CSV
                        </button>
                      </div>

                      {/* Exportar XML */}
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-heading font-bold text-charcoal-800 text-sm">Exportar XML</h4>
                            <p className="text-xs text-charcoal-400">{localProperties.length} imoveis</p>
                          </div>
                        </div>
                        <p className="text-sm text-charcoal-500 mb-4">Gere um arquivo XML no formato padrao de portais imobiliarios brasileiros.</p>
                        <button
                          onClick={() => {
                            downloadFile(generateXML(), 'imoveis-jeova-guedes.xml', 'application/xml;charset=utf-8')
                            showToast('XML baixado com sucesso!', 'success')
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          Baixar XML
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── Subtab: Portais ─── */}
                {portalSubTab === 'portais' && (
                  <div>
                    {/* Search + Filter tabs */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                      {/* Search */}
                      <div className="relative max-w-md flex-1">
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
                          placeholder="Buscar portal por nome..."
                          value={portalSearch}
                          onChange={(e) => setPortalSearch(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-sand-200 bg-white outline-none text-sm text-charcoal-700 placeholder:text-charcoal-300 focus:border-olive-400 transition-colors"
                        />
                      </div>

                      {/* Filter tabs */}
                      <div className="flex items-center gap-1 p-1 bg-sand-100 rounded-xl">
                        {([
                          { key: 'todos' as const, label: 'Todos' },
                          { key: 'pago' as const, label: 'Pagos' },
                          { key: 'gratuito' as const, label: 'Gratuitos' },
                        ]).map((tab) => (
                          <button
                            key={tab.key}
                            onClick={() => setPortalFilter(tab.key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              portalFilter === tab.key
                                ? 'bg-white text-charcoal-800 shadow-sm'
                                : 'text-charcoal-400 hover:text-charcoal-600'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Portal grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                      {filteredPortais.map((portal) => {
                        const config = getConfigForPortal(portal.id)
                        const isConfiguring = configuringPortal === portal.id

                        return (
                          <div
                            key={portal.id}
                            className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 group ${
                              isConfiguring ? 'border-olive-300 shadow-md' : 'border-sand-100 hover:shadow-md'
                            }`}
                          >
                            <div className="p-6">
                              {/* Top row: logo + name + badges */}
                              <div className="flex items-start gap-4 mb-4">
                                {/* Logo with fallback */}
                                <div className="w-12 h-12 rounded-xl bg-sand-100 flex items-center justify-center shrink-0 overflow-hidden border border-sand-200">
                                  <img
                                    src={portal.logo}
                                    alt={portal.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.currentTarget
                                      target.style.display = 'none'
                                      const fallback = target.nextElementSibling as HTMLElement
                                      if (fallback) fallback.style.display = 'flex'
                                    }}
                                  />
                                  <div
                                    className="w-full h-full items-center justify-center text-lg font-bold text-olive-600 bg-olive-50"
                                    style={{ display: 'none' }}
                                  >
                                    {portal.name.charAt(0).toUpperCase()}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-heading font-bold text-charcoal-800 text-sm truncate">{portal.name}</h3>
                                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                    {/* Category badge */}
                                    <span
                                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                                        portal.category === 'pago'
                                          ? 'bg-gold-100 text-gold-700'
                                          : 'bg-olive-100 text-olive-700'
                                      }`}
                                    >
                                      {portal.category === 'pago' ? 'Pago' : 'Gratuito'}
                                    </span>
                                    {/* Status badge */}
                                    <span
                                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                        portal.status === 'ativo'
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-charcoal-100 text-charcoal-500'
                                      }`}
                                    >
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                          portal.status === 'ativo' ? 'bg-green-500' : 'bg-charcoal-400'
                                        }`}
                                      />
                                      {portal.status === 'ativo' ? 'Ativo' : 'Em breve'}
                                    </span>
                                    {/* Connection status badge */}
                                    {config.apiKey && (
                                      <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                          config.status === 'conectado'
                                            ? 'bg-blue-100 text-blue-700'
                                            : config.status === 'pendente'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-red-100 text-red-700'
                                        }`}
                                      >
                                        {config.status === 'conectado' ? 'Conectado' : config.status === 'pendente' ? 'Pendente' : 'Desconectado'}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Description */}
                              <p className="text-sm text-charcoal-500 leading-relaxed mb-4 line-clamp-2">
                                {portal.description}
                              </p>

                              {/* Info rows */}
                              <div className="space-y-2 mb-5">
                                <div className="flex items-center gap-2 text-xs text-charcoal-400">
                                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                  </svg>
                                  <span>Cobertura: <span className="font-medium text-charcoal-600">{portal.cobertura}</span></span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-charcoal-400">
                                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87a6.52 6.52 0 01.22.128c.331.183.581.495.644.869l.213 1.28c.09.543.56.941 1.11.941h.594" />
                                  </svg>
                                  <span>Automacao: <span className="font-medium text-charcoal-600">{portal.automacao}</span></span>
                                </div>
                                {config.lastSync && (
                                  <div className="flex items-center gap-2 text-xs text-charcoal-400">
                                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Ultima Sincronizacao: <span className="font-medium text-charcoal-600">{config.lastSync}</span></span>
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2 pt-4 border-t border-sand-100">
                                <button
                                  onClick={() => {
                                    togglePortalStatus(portal.id)
                                    showToast(
                                      portal.status === 'ativo'
                                        ? `${portal.name} marcado como "Em breve"`
                                        : `${portal.name} ativado com sucesso!`,
                                      'success'
                                    )
                                  }}
                                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                                    portal.status === 'ativo'
                                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                      : 'bg-charcoal-50 text-charcoal-500 hover:bg-charcoal-100'
                                  }`}
                                >
                                  {portal.status === 'ativo' ? (
                                    <>
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                      </svg>
                                      Ativo
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      Em breve
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => setConfiguringPortal(isConfiguring ? null : portal.id)}
                                  className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                                    isConfiguring
                                      ? 'text-white bg-olive-600 hover:bg-olive-700'
                                      : 'text-olive-600 bg-olive-50 hover:bg-olive-100'
                                  }`}
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.07.04.14.078.209.118.684.396 1.521.28 2.076-.274l.928-.929a1.125 1.125 0 011.591 0l1.83 1.83a1.125 1.125 0 010 1.591l-.929.928c-.554.555-.67 1.392-.274 2.076.04.069.078.139.118.209.183.332.496.582.87.645l1.281.213c.542.09.94.56.94 1.11v2.593c0 .55-.398 1.02-.94 1.11l-1.281.213a1.456 1.456 0 00-.87.645 6.52 6.52 0 01-.118.209c-.396.684-.28 1.521.274 2.076l.929.928a1.125 1.125 0 010 1.591l-1.83 1.83a1.125 1.125 0 01-1.591 0l-.928-.929c-.555-.554-1.392-.67-2.076-.274a6.52 6.52 0 01-.209.118 1.456 1.456 0 00-.645.87l-.213 1.281c-.09.542-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281a1.456 1.456 0 00-.645-.87 6.52 6.52 0 01-.209-.118c-.684-.396-1.521-.28-2.076.274l-.928.929a1.125 1.125 0 01-1.591 0l-1.83-1.83a1.125 1.125 0 010-1.591l.929-.928c.554-.555.67-1.392.274-2.076a6.52 6.52 0 01-.118-.209 1.456 1.456 0 00-.87-.645l-1.281-.213a1.125 1.125 0 01-.94-1.11v-2.593c0-.55.398-1.02.94-1.11l1.281-.213c.374-.063.686-.313.87-.645a6.52 6.52 0 01.118-.209c.396-.684.28-1.521-.274-2.076l-.929-.928a1.125 1.125 0 010-1.591l1.83-1.83a1.125 1.125 0 011.591 0l.928.929c.555.554 1.392.67 2.076.274a6.52 6.52 0 01.209-.118c.332-.183.582-.496.645-.87l.213-1.281z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  Configurar
                                </button>
                                <a
                                  href={portal.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-charcoal-500 bg-charcoal-50 hover:bg-charcoal-100 transition-colors"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                  </svg>
                                </a>
                              </div>
                            </div>

                            {/* Configuration Panel */}
                            {isConfiguring && (
                              <div className="border-t border-sand-200 bg-sand-50/50 p-6 rounded-b-2xl">
                                <h4 className="font-heading font-bold text-charcoal-800 text-sm mb-4 flex items-center gap-2">
                                  <svg className="w-4 h-4 text-olive-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.76-3.32a.75.75 0 010-1.3l5.76-3.32a.75.75 0 01.76 0l5.76 3.32a.75.75 0 010 1.3l-5.76 3.32a.75.75 0 01-.76 0z" />
                                  </svg>
                                  Configuracao - {portal.name}
                                </h4>

                                <div className="space-y-4">
                                  {/* API Key */}
                                  <div>
                                    <label className="block text-xs font-semibold text-charcoal-600 mb-1.5">API Key</label>
                                    <input
                                      type="text"
                                      value={config.apiKey}
                                      onChange={(e) => savePortalConfig(portal.id, { ...config, apiKey: e.target.value, status: 'pendente' })}
                                      placeholder="Insira sua API Key..."
                                      className="w-full px-3 py-2.5 rounded-lg border-2 border-sand-200 bg-white outline-none text-sm text-charcoal-700 placeholder:text-charcoal-300 focus:border-olive-400 transition-colors font-mono"
                                    />
                                  </div>

                                  {/* API Secret */}
                                  <div>
                                    <label className="block text-xs font-semibold text-charcoal-600 mb-1.5">API Secret</label>
                                    <input
                                      type="password"
                                      value={config.apiSecret}
                                      onChange={(e) => savePortalConfig(portal.id, { ...config, apiSecret: e.target.value, status: 'pendente' })}
                                      placeholder="Insira sua API Secret..."
                                      className="w-full px-3 py-2.5 rounded-lg border-2 border-sand-200 bg-white outline-none text-sm text-charcoal-700 placeholder:text-charcoal-300 focus:border-olive-400 transition-colors font-mono"
                                    />
                                  </div>

                                  {/* Feed URL */}
                                  <div>
                                    <label className="block text-xs font-semibold text-charcoal-600 mb-1.5">Feed URL (auto-gerado)</label>
                                    <div className="flex gap-2">
                                      <input
                                        type="text"
                                        value={config.feedUrl || `https://jeovaimoveis.com.br/feed/${portal.id}.xml`}
                                        readOnly
                                        className="flex-1 px-3 py-2.5 rounded-lg border-2 border-sand-200 bg-sand-50 outline-none text-sm text-charcoal-500 font-mono"
                                      />
                                      <button
                                        onClick={() => copyToClipboard(config.feedUrl || `https://jeovaimoveis.com.br/feed/${portal.id}.xml`)}
                                        className="px-3 py-2.5 rounded-lg bg-olive-50 text-olive-600 hover:bg-olive-100 transition-colors"
                                        title="Copiar URL"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>

                                  {/* Connection Status */}
                                  <div className="flex items-center justify-between bg-white rounded-lg border border-sand-200 p-3">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`w-2.5 h-2.5 rounded-full ${
                                          config.status === 'conectado'
                                            ? 'bg-green-500'
                                            : config.status === 'pendente'
                                            ? 'bg-yellow-500'
                                            : 'bg-red-500'
                                        }`}
                                      />
                                      <span className="text-xs font-medium text-charcoal-600">
                                        Status: {config.status === 'conectado' ? 'Conectado' : config.status === 'pendente' ? 'Pendente' : 'Desconectado'}
                                      </span>
                                    </div>
                                    {config.lastSync && (
                                      <span className="text-[10px] text-charcoal-400">
                                        Sync: {config.lastSync}
                                      </span>
                                    )}
                                  </div>

                                  {/* Auto Sync Toggle */}
                                  <div className="flex items-center justify-between bg-white rounded-lg border border-sand-200 p-3">
                                    <div>
                                      <p className="text-xs font-semibold text-charcoal-700">Sincronizacao Automatica</p>
                                      <p className="text-[10px] text-charcoal-400 mt-0.5">Manter anuncios atualizados automaticamente</p>
                                    </div>
                                    <button
                                      onClick={() => {
                                        savePortalConfig(portal.id, { ...config, autoSync: !config.autoSync })
                                        showToast(
                                          !config.autoSync
                                            ? `Sincronizacao automatica ativada para ${portal.name}`
                                            : `Sincronizacao automatica desativada para ${portal.name}`,
                                          'info'
                                        )
                                      }}
                                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                                        config.autoSync ? 'bg-olive-500' : 'bg-charcoal-200'
                                      }`}
                                    >
                                      <span
                                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                                          config.autoSync ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                      />
                                    </button>
                                  </div>

                                  {/* Test Connection Button */}
                                  <button
                                    onClick={() => handleTestConnection(portal.id)}
                                    disabled={testingConnection === portal.id || (!config.apiKey && !config.apiSecret)}
                                    className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                                      testingConnection === portal.id
                                        ? 'bg-charcoal-100 text-charcoal-400 cursor-wait'
                                        : !config.apiKey && !config.apiSecret
                                        ? 'bg-charcoal-50 text-charcoal-300 cursor-not-allowed'
                                        : 'bg-olive-600 text-white hover:bg-olive-700'
                                    }`}
                                  >
                                    {testingConnection === portal.id ? (
                                      <>
                                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Testando Conexao...
                                      </>
                                    ) : (
                                      <>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                                        </svg>
                                        Testar Conexao
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {filteredPortais.length === 0 && (
                      <div className="text-center py-16">
                        <svg className="w-16 h-16 text-charcoal-200 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <p className="text-charcoal-400 font-medium">Nenhum portal encontrado</p>
                        <p className="text-charcoal-300 text-sm mt-1">Tente alterar os termos da busca ou filtro</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ─── Subtab: Feed XML ─── */}
                {portalSubTab === 'feed' && (
                  <div>
                    {/* Feed info header */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-100 mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h3 className="font-heading font-bold text-charcoal-800 text-lg">Preview do Feed XML</h3>
                          <p className="text-sm text-charcoal-400 mt-1">
                            {localProperties.length} imoveis serao exportados no feed
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(generateXML())}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-olive-600 bg-olive-50 hover:bg-olive-100 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                            </svg>
                            Copiar XML
                          </button>
                          <button
                            onClick={() => {
                              downloadFile(generateXML(), 'imoveis-jeova-guedes.xml', 'application/xml;charset=utf-8')
                              showToast('XML baixado com sucesso!', 'success')
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-olive-600 hover:bg-olive-700 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            Baixar XML
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* XML Preview */}
                    <div className="bg-white rounded-2xl shadow-sm border border-sand-100 overflow-hidden">
                      <div className="flex items-center justify-between px-6 py-3 bg-charcoal-800">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400" />
                          <div className="w-3 h-3 rounded-full bg-yellow-400" />
                          <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <span className="text-xs text-charcoal-400 font-mono">imoveis-jeova-guedes.xml</span>
                      </div>
                      <pre className="p-6 overflow-x-auto text-xs leading-relaxed font-mono text-charcoal-700 bg-charcoal-50 max-h-[600px] overflow-y-auto">
                        {generateXML()}
                      </pre>
                    </div>
                  </div>
                )}

                {/* ─── Subtab: Guia de Integracao ─── */}
                {portalSubTab === 'guia' && (
                  <div>
                    {/* Step by step guide */}
                    <h3 className="font-heading font-bold text-charcoal-800 text-lg mb-6">Passo a Passo para Integracao</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10">
                      {/* Passo 1 */}
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-olive-600 text-white flex items-center justify-center text-sm font-bold shrink-0">1</div>
                          <h4 className="font-heading font-bold text-charcoal-800">Feed XML</h4>
                        </div>
                        <p className="text-sm text-charcoal-500 leading-relaxed">
                          Copie a URL do feed XML e cadastre no portal desejado. O feed contem todos os seus imoveis ativos no formato padrao aceito pelos principais portais brasileiros.
                        </p>
                        <div className="mt-4 bg-sand-50 rounded-lg p-3">
                          <p className="text-xs text-charcoal-500 font-mono break-all">{feedUrl}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(feedUrl)}
                          className="mt-3 flex items-center gap-2 text-xs font-semibold text-olive-600 hover:text-olive-700 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                          </svg>
                          Copiar URL do Feed
                        </button>
                      </div>

                      {/* Passo 2 */}
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-olive-600 text-white flex items-center justify-center text-sm font-bold shrink-0">2</div>
                          <h4 className="font-heading font-bold text-charcoal-800">Credenciais</h4>
                        </div>
                        <p className="text-sm text-charcoal-500 leading-relaxed">
                          Configure suas credenciais de API de cada portal na aba Portais. Cada portal fornece uma API Key e API Secret que devem ser inseridas para autenticar a integracao.
                        </p>
                        <button
                          onClick={() => setPortalSubTab('portais')}
                          className="mt-4 flex items-center gap-2 text-xs font-semibold text-olive-600 hover:text-olive-700 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                          Ir para aba Portais
                        </button>
                      </div>

                      {/* Passo 3 */}
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-olive-600 text-white flex items-center justify-center text-sm font-bold shrink-0">3</div>
                          <h4 className="font-heading font-bold text-charcoal-800">Sincronizacao</h4>
                        </div>
                        <p className="text-sm text-charcoal-500 leading-relaxed">
                          Ative a sincronizacao automatica para manter os anuncios atualizados em todos os portais. Quando habilitada, alteracoes nos imoveis serao refletidas automaticamente.
                        </p>
                      </div>

                      {/* Passo 4 */}
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-olive-600 text-white flex items-center justify-center text-sm font-bold shrink-0">4</div>
                          <h4 className="font-heading font-bold text-charcoal-800">Verificacao</h4>
                        </div>
                        <p className="text-sm text-charcoal-500 leading-relaxed">
                          Teste a conexao e verifique se os imoveis estao aparecendo no portal. Use o botao &ldquo;Testar Conexao&rdquo; na configuracao de cada portal para validar a integracao.
                        </p>
                      </div>
                    </div>

                    {/* Formatos Suportados */}
                    <h3 className="font-heading font-bold text-charcoal-800 text-lg mb-4">Formatos Suportados</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-100 text-center">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                          </svg>
                        </div>
                        <h4 className="font-heading font-bold text-charcoal-800 text-sm mb-1">XML Feed</h4>
                        <p className="text-xs text-charcoal-400">Formato padrao para portais imobiliarios brasileiros</p>
                      </div>
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-100 text-center">
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125" />
                          </svg>
                        </div>
                        <h4 className="font-heading font-bold text-charcoal-800 text-sm mb-1">CSV</h4>
                        <p className="text-xs text-charcoal-400">Compativel com planilhas e importacao em massa</p>
                      </div>
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-100 text-center">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25" />
                          </svg>
                        </div>
                        <h4 className="font-heading font-bold text-charcoal-800 text-sm mb-1">JSON API</h4>
                        <p className="text-xs text-charcoal-400">API RESTful para integracoes customizadas</p>
                      </div>
                    </div>

                    {/* FAQ */}
                    <h3 className="font-heading font-bold text-charcoal-800 text-lg mb-4">Perguntas Frequentes</h3>
                    <div className="space-y-4">
                      {[
                        {
                          q: 'Quanto tempo leva para os imoveis aparecerem no portal?',
                          a: 'Apos configurar a integracao e ativar a sincronizacao, os imoveis geralmente aparecem no portal em ate 24 horas. Alguns portais podem levar ate 48 horas para processar o feed pela primeira vez.',
                        },
                        {
                          q: 'Preciso de uma conta paga no portal para integrar?',
                          a: 'Depende do portal. Alguns portais como OLX e Chaves na Mao oferecem integracao gratuita. Portais como ZAP Imoveis e VivaReal exigem um plano pago para publicacao via feed XML.',
                        },
                        {
                          q: 'O que acontece se eu editar um imovel apos a integracao?',
                          a: 'Se a sincronizacao automatica estiver ativada, as alteracoes serao enviadas automaticamente na proxima sincronizacao. Caso contrario, voce pode forcar uma nova sincronizacao manualmente.',
                        },
                        {
                          q: 'Posso integrar com portais que nao estao na lista?',
                          a: 'Sim! Se o portal aceita feed XML no formato padrao brasileiro, voce pode usar a URL do feed XML gerada automaticamente. Basta copiar a URL na aba Visao Geral e cadastrar no portal desejado.',
                        },
                        {
                          q: 'Como obtenho as credenciais de API?',
                          a: 'As credenciais de API (API Key e API Secret) sao fornecidas pelo proprio portal apos a criacao de uma conta profissional/corretora. Acesse o painel do portal e procure pela secao de integracoes ou API.',
                        },
                      ].map((faq, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-sand-100">
                          <h4 className="font-heading font-bold text-charcoal-800 text-sm mb-2 flex items-start gap-2">
                            <svg className="w-5 h-5 text-olive-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                            </svg>
                            {faq.q}
                          </h4>
                          <p className="text-sm text-charcoal-500 leading-relaxed pl-7">
                            {faq.a}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })()}

          {/* ──────── Leads Section ──────── */}
          {section === 'leads' && <LeadsSection />}

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
