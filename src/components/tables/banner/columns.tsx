'use client'

import type { IBanner } from '@/types'
import type { ColumnDef } from '@tanstack/react-table'
import { Link } from 'lucide-react'
import Image from 'next/image'
import { CellAction } from './cell-action'

export const columns: ColumnDef<IBanner>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <div className="font-medium">{row.original.title || 'N/A'}</div>
  },
  {
    accessorKey: 'cover',
    header: 'Cover Image',
    cell: ({ row }) => {
      const cover = row.original.cover
      return cover ? (
        <div className="relative h-12 w-20 overflow-hidden rounded-md">
          <Image src={cover || '/placeholder.svg'} alt={row.original.title || 'Banner cover'} fill className="object-cover" sizes="80px" />
        </div>
      ) : (
        <div className="text-muted-foreground text-sm">No image</div>
      )
    }
  },

  {
    accessorKey: 'cta',
    header: 'CTA',
    cell: ({ row }) =>
      row.original.cta ? (
        <a
          href={row.original.cta}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline transition-colors hover:text-blue-800"
          title={row.original.cta}
        >
          <Link />
        </a>
      ) : (
        <div className="text-muted-foreground text-sm">N/A</div>
      )
  },
  {
    accessorKey: 'ctaText',
    header: 'Button Text',
    cell: ({ row }) => <div>{row.original.ctaText || 'N/A'}</div>
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
