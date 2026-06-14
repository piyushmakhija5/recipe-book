'use client'

import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T) => void] {
  const [stored, setStored] = useState<T>(initialValue)

  // Read from localStorage after mount (SSR guard)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item !== null) setStored(JSON.parse(item) as T)
    } catch {
      // ignore
    }
  }, [key])

  const setValue = (val: T) => {
    try {
      setStored(val)
      window.localStorage.setItem(key, JSON.stringify(val))
    } catch {
      // ignore
    }
  }

  return [stored, setValue]
}
