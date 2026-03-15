'use client'

import { useState, useCallback } from 'react'

interface ImageCarouselProps {
  images: string[]
  title: string
  className?: string
}

export default function ImageCarousel({ images, title, className = 'h-56' }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const prev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1))
    },
    [images.length]
  )

  const next = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1))
    },
    [images.length]
  )

  if (images.length === 0) return null

  return (
    <div className={`relative bg-charcoal-200 overflow-hidden group/carousel ${className}`}>
      {/* Images */}
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`${title} - Foto ${index + 1}`}
            className="object-cover w-full h-full shrink-0"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-charcoal-700 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-white shadow-md"
            aria-label="Foto anterior"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-charcoal-700 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-white shadow-md"
            aria-label="Proxima foto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                goTo(index)
              }}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-5 h-1.5 bg-white'
                  : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Ver foto ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Photo count */}
      {images.length > 1 && (
        <div className="absolute top-3 right-3 bg-charcoal-900/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-full">
          {currentIndex + 1}/{images.length}
        </div>
      )}
    </div>
  )
}
