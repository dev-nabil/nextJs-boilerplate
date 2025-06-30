'use client'

import { cn } from '@/lib/utils'
import { Box, ContactRound, TextSearch } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface NavLink {
  title: string
  href: string
  icon: string
  sub?: NavLink[]
}

interface MobileTabBarProps {
  links: NavLink[]
}

export default function MobileTabBar({ links }: MobileTabBarProps) {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  // Function to get the appropriate icon based on the icon string
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'TextSearch':
        return <TextSearch className="h-5 w-5" />
      case 'ContactRound':
        return <ContactRound className="h-5 w-5" />
      case 'Box':
        return <Box className="h-5 w-5" />
      default:
        return <></>
    }
  }

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white md:hidden">
      <div className="flex h-16 items-center justify-around">
        {links.map(link => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
          const hasSubmenu = link.sub && link.sub.length > 0

          return (
            <div key={link.title} className="relative flex flex-col items-center">
              <Link
                href={link.href}
                className={cn(
                  'flex flex-col items-center justify-center px-3 py-2',
                  isActive ? 'text-primary' : 'hover:text-primary text-gray-500'
                )}
              >
                {getIcon(link.icon)}
                <span className="mt-1 text-xs font-medium">{link.title}</span>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
