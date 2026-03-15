'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

interface FavoritesContextType {
  favorites: number[]
  toggleFavorite: (id: number) => void
  isFavorite: (id: number) => boolean
  count: number
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
  count: 0,
})

export function useFavorites() {
  return useContext(FavoritesContext)
}

const STORAGE_KEY = 'corretora-favorites'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    }
  }, [favorites, loaded])

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }, [])

  const isFavorite = useCallback(
    (id: number) => favorites.includes(id),
    [favorites]
  )

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, count: favorites.length }}>
      {children}
    </FavoritesContext.Provider>
  )
}
