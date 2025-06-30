'use client'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu'
import useCheckActiveNav from '@/hooks/useCheckActiveNav'
import { cn } from '@/lib/utils'
import { BarChart, ChevronDown, FileText, HelpCircle, Inbox, Settings, ShoppingCart, Users, type LucideIcon } from 'lucide-react'
import Link from 'next/link'

// Map of icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  FileText,
  Settings,
  Users,
  ShoppingCart,
  BarChart,
  HelpCircle,
  Inbox
}

export default function NavMenu({ links }: { links: any }) {
  const { checkActiveNav } = useCheckActiveNav()

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList className="space-x-6">
        {links.map((link: any) => {
          // If the link has sublinks, render a dropdown
          if (link.sub && Array.isArray(link.sub) && link.sub.length > 0) {
            return (
              <NavigationMenuItem key={link.title}>
                <NavigationMenuTrigger
                  className={cn(
                    'group px-0 py-1 transition-colors',
                    checkActiveNav(link.href as string)
                      ? 'text-primary border-primary border-b-2 font-semibold'
                      : 'hover:text-primary hover:border-primary text-black hover:border-b-2'
                  )}
                >
                  <Link href={link.href as string} className="flex items-center gap-1">
                    {link.title}
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[240px] rounded-lg">
                    <div className="grid gap-3">
                      {link.sub.map((subLink: any) => {
                        // Get the icon component or default to FileText
                        const IconComponent = subLink.icon && iconMap[subLink.icon] ? iconMap[subLink.icon] : FileText

                        return (
                          <Link
                            key={subLink.title}
                            href={subLink.href as string}
                            className={cn(
                              'flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-gray-100',
                              checkActiveNav(subLink.href as string) ? 'text-primary bg-primary/5 font-semibold' : 'text-gray-700'
                            )}
                          >
                            {/* <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-md">
                              <IconComponent className="h-4 w-4" />
                            </div> */}
                            <div>
                              <div className="text-sm font-medium">{subLink.title}</div>
                              {subLink.description && <div className="line-clamp-1 text-xs text-gray-500">{subLink.description}</div>}
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )
          }

          // If the link has no sublinks, render a simple link
          return (
            <NavigationMenuItem key={link.title}>
              <Link
                href={link.href as string}
                className={cn(
                  'px-0 py-1 transition-colors',
                  checkActiveNav(link.href as string)
                    ? 'text-primary border-primary border-b-2 font-semibold'
                    : 'hover:text-primary hover:border-primary text-black hover:border-b-2'
                )}
              >
                {link.title}
              </Link>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
