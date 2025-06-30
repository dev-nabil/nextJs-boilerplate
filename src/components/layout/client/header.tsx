'use client'

import { clientNavLinks } from '@/routes'
import AppLogo from '../app-logo'
import AuthNav from '../auth-nav'
import NavMenu from '../nav-menu'

export default function ClientHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-4 lg:px-0">
        {/* Logo */}
        <AppLogo />
        <div className="flex items-center gap-5">
          {/* Navigation */}
          <NavMenu links={clientNavLinks} />
          {/* Auth Nav */}
          <AuthNav />
        </div>
      </div>
    </header>
  )
}
