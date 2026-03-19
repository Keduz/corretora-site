'use client'

import { useEffect, useRef } from 'react'

interface PropertyMapProps {
  lat: number
  lng: number
  title: string
  neighborhood: string
  city: string
}

export default function PropertyMap({ lat, lng, title, neighborhood, city }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)

  useEffect(() => {
    if (!mapRef.current) return

    let cancelled = false

    const initMap = async () => {
      const L = (await import('leaflet')).default

      if (cancelled || !mapRef.current) return

      // Clean up any existing map on this container
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove()
        mapInstanceRef.current = null
      }

      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })

      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 15,
        scrollWheelZoom: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:sans-serif;text-align:center;padding:4px;">
            <strong style="font-size:14px;">${title}</strong><br/>
            <span style="color:#666;font-size:12px;">${neighborhood}, ${city} - BA</span>
          </div>`
        )
        .openPopup()

      mapInstanceRef.current = map
    }

    initMap()

    return () => {
      cancelled = true
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove()
        mapInstanceRef.current = null
      }
    }
  }, [lat, lng, title, neighborhood, city])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <div
        ref={mapRef}
        className="h-72 md:h-80 rounded-2xl overflow-hidden z-0"
        style={{ position: 'relative' }}
      />
    </>
  )
}
