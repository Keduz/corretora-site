'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface CompareContextType {
  compareIds: number[]
  toggleCompare: (id: number) => void
  isComparing: (id: number) => boolean
  clearCompare: () => void
  count: number
}

const CompareContext = createContext<CompareContextType>({
  compareIds: [],
  toggleCompare: () => {},
  isComparing: () => false,
  clearCompare: () => {},
  count: 0,
})

export function useCompare() {
  return useContext(CompareContext)
}

const MAX_COMPARE = 3

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareIds, setCompareIds] = useState<number[]>([])

  const toggleCompare = useCallback((id: number) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((c) => c !== id)
      }
      if (prev.length >= MAX_COMPARE) {
        return prev
      }
      return [...prev, id]
    })
  }, [])

  const isComparing = useCallback(
    (id: number) => compareIds.includes(id),
    [compareIds]
  )

  const clearCompare = useCallback(() => {
    setCompareIds([])
  }, [])

  return (
    <CompareContext.Provider value={{ compareIds, toggleCompare, isComparing, clearCompare, count: compareIds.length }}>
      {children}
    </CompareContext.Provider>
  )
}
