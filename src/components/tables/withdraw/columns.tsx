'use client'

import { Badge } from '@/components/ui/badge'
import type { ColumnDef } from '@tanstack/react-table'
import CellAction from './cell-action'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <p>{row.original.name || 'N/A'}</p>
  },
  {
    accessorKey: 'bank',
    header: 'Bank',
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.bank || 'N/A'}</p>
        <p className="text-muted-foreground text-sm">{row.original.branch || 'N/A'}</p>
      </div>
    )
  },
  {
    accessorKey: 'account',
    header: 'Account No.',
    cell: ({ row }) => <p>{row.original.account || 'N/A'}</p>
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = parseFloat(row.original.amount)
      return <div className="font-medium">{`NPR ${Number(amount).toFixed(2)}`}</div>
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status

      return (
        <Badge
          variant="outline"
          className={
            status === 'approved'
              ? 'border-green-200 bg-green-100 text-green-800 hover:bg-green-200'
              : status === 'pending'
                ? 'border-yellow-200 bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                : 'border-red-200 bg-red-100 text-red-800 hover:bg-red-200'
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    }
  },
  {
    accessorKey: 'released',
    header: 'Escrow Status',
    cell: ({ row }) => {
      const released = row.original.released
      return released ? (
        <Badge variant="outline" className="border-green-200 bg-green-100 text-green-800 hover:bg-green-200">
          Released
        </Badge>
      ) : (
        <Badge variant="outline" className="border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-200">
          In Escrow
        </Badge>
      )
    }
  },
  {
    accessorKey: 'rejected',
    header: 'Rejected',
    cell: ({ row }) => {
      const rejected = row.original.rejected
      return rejected ? (
        <Badge variant="outline" className="border-red-200 bg-red-100 text-red-800 hover:bg-red-200">
          Rejected
        </Badge>
      ) : (
        <Badge variant="outline" className="border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200">
          No
        </Badge>
      )
    }
  },
  {
    accessorKey: 'rejectionNote',
    header: 'Rejected Note',
    cell: ({ row }) => {
      const rejected = row.original.rejectionNote
      return (
        rejected && (
          <Badge variant="outline" className="w-[200px] border-red-200 bg-red-300 text-red-800 hover:bg-red-200">
            {rejected}
          </Badge>
        )
      )
    }
  },
  {
    accessorKey: 'seller',
    header: 'Seller',
    cell: ({ row }) => {
      const user = row.original.seller?.user
      return user?.name || 'N/A'
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
