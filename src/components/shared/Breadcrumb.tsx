import { cn } from '@/lib/utils'
import { ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export type BreadCrumbType = {
  title: string
  link?: string
}

type Props = {
  items: BreadCrumbType[]
  className?: string
}

export default function BreadCrumb({ items, className }: Props) {
  return (
    <div className={cn('text-muted-foreground mb-4 flex items-center space-x-1 text-sm', className)}>
      <Link href={'/admin/dashboard'} className="overflow-hidden text-ellipsis whitespace-nowrap">
        Dashboard
      </Link>
      {items?.map((item: BreadCrumbType, index: number) => (
        <React.Fragment key={item.title}>
          <ChevronRightIcon className="h-4 w-4" />
          {item.link ? (
            <Link
              href={item.link}
              className={cn('font-medium', index === items.length - 1 ? 'text-foreground pointer-events-none' : 'text-muted-foreground')}
            >
              {item.title}
            </Link>
          ) : (
            <p className={cn('font-medium', index === items.length - 1 ? 'text-foreground pointer-events-none' : 'text-muted-foreground')}>
              {item.title}
            </p>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
