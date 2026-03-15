'use client'

import { type ReactNode } from 'react'
import { ToastProvider } from './Toast'
import { FavoritesProvider } from './FavoritesContext'
import { CompareProvider } from './CompareContext'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <FavoritesProvider>
        <CompareProvider>
          {children}
        </CompareProvider>
      </FavoritesProvider>
    </ToastProvider>
  )
}
