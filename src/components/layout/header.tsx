import Search from '@/components/pages/shared/search'
import type { NavItem } from '@/types'
import AppLogo from './app-logo'
import AuthNav from './auth-nav'
import MobileTabBar from './mobile-tab'
import NavMenu from './nav-menu'

interface HeaderProps {
  links: NavItem[]
  showSearch?: boolean
  mobileLinks?: any[] // Using any[] since we don't have the exact type from your code
}

export default function Header({ links, showSearch = false }: HeaderProps) {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-2 md:p-4">
          {/* Logo */}
          <AppLogo />
          {/* Navigation - hidden on mobile */}
          <div className="hidden md:block">
            <NavMenu links={links} />
          </div>
          {/* Search (conditionally rendered) */}
          {showSearch && <Search />}
          {/* Auth Nav */}
          <AuthNav />
        </div>
      </header>

      {/* Mobile Tab Bar - only shown on mobile */}
      {links && <MobileTabBar links={links as []} />}
    </>
  )
}
