'use client'

import { motion } from 'framer-motion'
import { useFavorites } from './FavoritesContext'
import { useToast } from './Toast'

interface FavoriteButtonProps {
  propertyId: number
  propertyTitle?: string
  className?: string
  size?: 'sm' | 'md'
}

export default function FavoriteButton({ propertyId, propertyTitle, className = '', size = 'sm' }: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const { showToast } = useToast()
  const active = isFavorite(propertyId)

  const iconSize = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'
  const padding = size === 'sm' ? 'w-9 h-9' : 'w-11 h-11'

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(propertyId)
        if (active) {
          showToast('Removido dos favoritos', 'info')
        } else {
          showToast(propertyTitle ? `${propertyTitle} adicionado aos favoritos` : 'Adicionado aos favoritos', 'success')
        }
      }}
      className={`${padding} rounded-full flex items-center justify-center transition-all duration-300 ${
        active
          ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
          : 'bg-white/90 backdrop-blur-sm text-charcoal-500 hover:text-red-500 hover:bg-white shadow-md'
      } ${className}`}
      aria-label={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <svg
        className={iconSize}
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </motion.button>
  )
}
