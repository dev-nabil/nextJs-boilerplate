'use client'
import { usePathname } from 'next/navigation'

export default function useType(): 'seller' | 'buyer' {
  const pathname = usePathname()

  if (pathname.includes('seller')) return 'seller'
  else if (pathname.includes('buyer')) return 'buyer'
  else return 'buyer'
}
