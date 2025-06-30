// columns.ts
'use client'

import { ColumnDef } from '@tanstack/react-table'

interface ICommission {
  id: string
  amount: string
  projectId: string
  createdAt: string
  project: {
    fixedAmount: string
    title: string
  }
}

export const columns: ColumnDef<ICommission>[] = [
  {
    header: 'Project Title',
    accessorKey: 'project.title',
    cell: ({ row }) => row.original.project.title
  },
  {
    header: 'Commission Amount',
    accessorKey: 'amount',
    cell: ({ row }) => `NPR ${row.original.amount}`
  },
  {
    header: 'Created At',
    accessorKey: 'createdAt',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
  }
]
