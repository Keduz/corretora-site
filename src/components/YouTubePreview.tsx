'use client'

import { useState, useCallback } from 'react'

interface YouTubePreviewProps {
  videoId: string
  isHovered: boolean
  className?: string
}

export default function YouTubePreview({ videoId, isHovered, className = 'h-56' }: YouTubePreviewProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false)

  const handleIframeLoad = useCallback(() => {
    setIframeLoaded(true)
  }, [])

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

  return (
    <div className={`absolute inset-0 z-[5] pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'} ${className}`}>
      {/* YouTube thumbnail shown while iframe loads */}
      {isHovered && !iframeLoaded && (
        <div className="absolute inset-0">
          <img
            src={thumbnailUrl}
            alt="Video preview"
            className="w-full h-full object-cover"
          />
          {/* Loading spinner overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal-900/30">
            <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        </div>
      )}

      {/* YouTube iframe - only rendered when hovered */}
      {isHovered && (
        <iframe
          src={embedUrl}
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
          onLoad={handleIframeLoad}
          style={{ border: 'none', pointerEvents: 'none' }}
          title="Tour virtual do imovel"
        />
      )}
    </div>
  )
}

export function VirtualTourBadge() {
  return (
    <span className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 bg-charcoal-900/75 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1.5 rounded-full">
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
      Tour Virtual
    </span>
  )
}
