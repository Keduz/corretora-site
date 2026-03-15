'use client'

import { useState, useEffect } from 'react'
import { properties as staticProperties, type Property } from '@/data/properties'

const STORAGE_KEY = 'corretora-admin-properties'

export function useProperties(): Property[] {
  const [props, setProps] = useState(staticProperties)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) setProps(parsed)
      } catch { /* ignore */ }
    }
  }, [])

  return props
}
