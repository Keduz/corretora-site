'use client'

import { type ReactNode } from 'react'
import { ToastProvider } from './Toast'
import { FavoritesProvider } from './FavoritesContext'
import { CompareProvider } from './CompareContext'
import { LanguageProvider } from '@/i18n/LanguageContext'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <ToastProvider>
        <FavoritesProvider>
          <CompareProvider>
            {children}
          </CompareProvider>
        </FavoritesProvider>
      </ToastProvider>
    </LanguageProvider>
  )
}
