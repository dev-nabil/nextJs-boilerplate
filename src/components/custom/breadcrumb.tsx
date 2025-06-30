'use client'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

import { usePathname } from 'next/navigation'
import { Fragment } from 'react'

export type BreadcrumbItem = { title: string; link?: string }

export default function BreadcrumbWrapper({ items }: { items: BreadcrumbItem[] }) {
  const pathname = usePathname()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/admin/dashboard`}>Dashboard</BreadcrumbLink>
        </BreadcrumbItem>

        {items.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={item.link ? `/admin/${item.link}` : pathname}>{item.title}</BreadcrumbLink>
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
