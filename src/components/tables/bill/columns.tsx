'use client'

import { Badge } from '@/components/ui/badge'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import CellAction from './cell-action'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'contract.project.title',
    header: 'Project',
    cell: ({ row }) => (
      <div>
        <p>{row.original.contract?.project?.title || row.original.milestone?.contract?.project?.title || 'N/A'}</p>
        {row.original.milestone && (
          <p>
            Milestone number: {row.original.milestone.number}
            Milestone title: {row.original.milestone.title}
          </p>
        )}
      </div>
    )
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = parseFloat(row.original.amount)
      return <div className="font-medium">{`NPR ${Number(row.original.amount).toFixed(2)}`}</div>
    }
  },
  {
    accessorKey: 'fee',
    header: 'Fee',
    cell: ({ row }) => {
      const fee = parseFloat(row.original.fee)
      return <div className="text-muted-foreground">{`NPR ${Number(row.original.fee / 100).toFixed(2)}`}</div>
    }
  },
  {
    accessorKey: 'buyer',
    header: 'Buyer',
    cell: ({ row }) => row.original.buyer?.user?.name || 'N/A'
  },
  {
    accessorKey: 'seller',
    header: 'Seller',
    cell: ({ row }) => row.original.seller?.user?.name || 'N/A'
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment Status',
    cell: ({ row }) => {
      const status = row.original.paymentStatus

      return (
        <Badge
          variant="outline"
          className={
            status === 'completed'
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
    accessorKey: 'statusInAdmin',
    header: 'Admin Status',
    cell: ({ row }) => {
      const status = row.original.statusInAdmin

      return (
        <Badge
          variant="outline"
          className={
            status === 'approved'
              ? 'border-green-200 bg-green-100 text-green-800 hover:bg-green-200'
              : status === 'rejected'
                ? 'border-red-200 bg-red-100 text-red-800 hover:bg-red-200'
                : 'border-yellow-200 bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const date = row.original.createdAt
      if (!date) return 'N/A'
      try {
        return format(new Date(date), 'MMM d, yyyy - h:mm a')
      } catch {
        return 'Invalid Date'
      }
    }
  },
  {
    accessorKey: 'payWithCash',
    header: 'Payment Method',
    cell: ({ row }) => {
      const isCash = row.original.payWithCash
      return isCash ? (
        <Badge variant="outline" className="border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200">
          Cash
        </Badge>
      ) : (
        <Badge variant="outline" className="border-purple-200 bg-purple-100 text-purple-800 capitalize hover:bg-purple-200">
          {row?.original?.method}
        </Badge>
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
