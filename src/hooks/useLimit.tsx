import { useSearchParams } from 'next/navigation'

type Key = 'app-setting' | 'notification' | 'highlight' | 'news'

export default function useLimit(key: Key): number {
  const limit = useSearchParams().get('limit')

  if (typeof window === 'undefined') return 10

  const limitMap = localStorage.getItem('limit') ? JSON.parse(localStorage.getItem('limit') as string) : {}

  if (limit) {
    limitMap[key] = limit
    localStorage.setItem('limit', JSON.stringify(limitMap))
  }

  return Number(limitMap[key]) || 10
}
