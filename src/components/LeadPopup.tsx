'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'lead_popup_shown'

export default function LeadPopup() {
  const [show, setShow] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [form, setForm] = useState({ nome: '', telefone: '', email: '' })

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return
    const timer = setTimeout(() => setShow(true), 10000)
    return () => clearTimeout(timer)
  }, [])

  const fechar = () => {
    setShow(false)
    localStorage.setItem(STORAGE_KEY, '1')
  }

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nome.trim() || !form.telefone.trim()) return
    setEnviando(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setEnviado(true)
      localStorage.setItem(STORAGE_KEY, '1')
      setTimeout(() => setShow(false), 3000)
    } catch {
      alert('Erro ao enviar. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={fechar}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-md pointer-events-auto overflow-hidden rounded-2xl shadow-2xl">
              {/* Top accent bar */}
              <div className="h-1.5 bg-gradient-to-r from-olive-500 via-olive-400 to-gold-400" />

              <div className="bg-white p-6 sm:p-8">
                {/* Close button */}
                <button
                  onClick={fechar}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {!enviado ? (
                  <>
                    {/* Header */}
                    <div className="text-center mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
                        className="w-16 h-16 mx-auto mb-4 rounded-full bg-olive-50 flex items-center justify-center"
                      >
                        <svg className="w-8 h-8 text-olive-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                        </svg>
                      </motion.div>
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="font-heading text-2xl font-bold text-charcoal-800"
                      >
                        Encontre seu imovel ideal
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-charcoal-500 mt-2 text-sm"
                      >
                        Deixe seus dados e um consultor entrara em contato com as melhores opcoes para voce.
                      </motion.p>
                    </div>

                    {/* Form */}
                    <motion.form
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      onSubmit={enviar}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-semibold text-charcoal-600 uppercase tracking-wider mb-1.5">
                          Nome *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.nome}
                          onChange={(e) => setForm({ ...form, nome: e.target.value })}
                          placeholder="Seu nome completo"
                          className="w-full px-4 py-3 rounded-lg border border-sand-300 bg-sand-50/50 text-charcoal-800 placeholder:text-charcoal-300 focus:outline-none focus:ring-2 focus:ring-olive-400 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-charcoal-600 uppercase tracking-wider mb-1.5">
                          Telefone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={form.telefone}
                          onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                          placeholder="(71) 99999-9999"
                          className="w-full px-4 py-3 rounded-lg border border-sand-300 bg-sand-50/50 text-charcoal-800 placeholder:text-charcoal-300 focus:outline-none focus:ring-2 focus:ring-olive-400 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-charcoal-600 uppercase tracking-wider mb-1.5">
                          Email <span className="text-charcoal-300 normal-case">(opcional)</span>
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="seu@email.com"
                          className="w-full px-4 py-3 rounded-lg border border-sand-300 bg-sand-50/50 text-charcoal-800 placeholder:text-charcoal-300 focus:outline-none focus:ring-2 focus:ring-olive-400 focus:border-transparent transition-all"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={enviando}
                        className="w-full py-3.5 rounded-lg bg-gradient-to-r from-olive-500 to-olive-600 hover:from-olive-600 hover:to-olive-700 text-white font-semibold text-sm tracking-wide transition-all duration-300 shadow-lg shadow-olive-500/25 hover:shadow-olive-500/40 disabled:opacity-60"
                      >
                        {enviando ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Enviando...
                          </span>
                        ) : (
                          'Quero ser contactado'
                        )}
                      </button>

                      <p className="text-center text-[11px] text-charcoal-400">
                        Seus dados estao seguros conosco.
                      </p>
                    </motion.form>
                  </>
                ) : (
                  /* Success state */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                      className="w-20 h-20 mx-auto mb-5 rounded-full bg-olive-50 flex items-center justify-center"
                    >
                      <svg className="w-10 h-10 text-olive-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </motion.div>
                    <h3 className="font-heading text-2xl font-bold text-charcoal-800 mb-2">
                      Recebemos seus dados!
                    </h3>
                    <p className="text-charcoal-500 text-sm">
                      Em breve um consultor entrara em contato.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
