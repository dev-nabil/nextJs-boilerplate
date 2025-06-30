'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'
import UserNav from './user-nav'

export default function AuthNav() {
  const { isAuthenticated } = useAuth()
  return (
    <>
      {!isAuthenticated ? (
        <div className="flex items-center space-x-4">
          <Link href={'/auth/register'}>
            <Button variant="secondary">Register</Button>
          </Link>
          <Link href={'/auth/login'}>
            <Button variant="default">Login</Button>
          </Link>
        </div>
      ) : (
        <UserNav />
      )}
    </>
  )
}
