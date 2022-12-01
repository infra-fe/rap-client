import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
      return () => {
        clearTimeout(handler)
      }
    },
    [value]
  )
  if (['number', 'string', 'boolean'].indexOf(typeof value) === -1) {
    throw new Error(`useDebounce method doesn't support type = ${typeof value}`)
  }
  return debouncedValue
}
