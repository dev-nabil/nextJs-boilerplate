'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AppLogo() {
  const pathname = usePathname()

  const getHomePage = () => {
    if (pathname.includes('buyer')) {
      return '/buyer'
    } else if (pathname.includes('seller')) {
      return '/seller/find-work'
    } else if (pathname.includes('admin')) {
      return '/admin'
    } else {
      return '/'
    }
  }

  return (
    <div className="text-primary text-2xl font-bold">
      <Link href={getHomePage()}>
        <span className="text-secondary">Yaha</span> Chha
      </Link>
    </div>
  )
}
