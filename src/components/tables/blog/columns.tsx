'use client'

import { IBlog } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'
import { BlogCellAction } from './cell-action'

export const columns: ColumnDef<IBlog>[] = [
  {
    header: 'Image',
    cell: ({ row }) => (
      <Image
        className="h-20 w-20 rounded-sm border object-cover"
        width={500}
        height={500}
        src={row.original.image || ''}
        alt={row.original.title || 'Blog Image'}
      />
    )
  },
  {
    header: 'Title',
    cell: ({ row }) => row.original.title
  },
  {
    header: () => <div className="text-end">Action</div>,
    id: 'Actions',
    cell: ({ row }) => <BlogCellAction id={row.original.id} />
  }
]
