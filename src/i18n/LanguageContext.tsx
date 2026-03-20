'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { type Locale, type TranslationKey, getTranslation } from './translations'

type LanguageContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'pt',
  setLocale: () => {},
  t: (key) => key,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('lang') as Locale) || 'pt'
    }
    return 'pt'
  })

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('lang', l)
    document.documentElement.lang = l === 'pt' ? 'pt-BR' : l
  }, [])

  const t = useCallback(
    (key: TranslationKey) => getTranslation(locale, key),
    [locale]
  )

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
