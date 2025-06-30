'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

const formatSegment = (segment: string) => segment.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())

export default function AppBreadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  const isAdminRoute = segments[0] === 'admin'

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {!isAdminRoute && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {segments.length > 0 && <BreadcrumbSeparator />}
          </>
        )}

        {segments.map((segment, index) => {
          const href = '/' + segments.slice(0, index + 1).join('/')
          const isLast = index === segments.length - 1

          return (
            <React.Fragment key={href}>
              {index > 0 || isAdminRoute ? <BreadcrumbSeparator /> : null}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{formatSegment(segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{formatSegment(segment)}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
