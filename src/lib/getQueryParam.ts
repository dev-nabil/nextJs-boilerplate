'use client'

export function getQueryParam(key: string): string | null {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    return params.get(key)
  }
  console.warn('getQueryParam called on server without query context')
  return null
}
