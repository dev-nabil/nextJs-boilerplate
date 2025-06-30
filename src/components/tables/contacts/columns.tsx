'use client'

import { checkAccess } from '@/app/(admin)/permission/permission'
import { Badge } from '@/components/ui/badge'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { CellAction } from './cell-action'

// ============permission===edit=delete===========
const respondPermission = checkAccess('Contacts', 'respond').status
const deletePermission = checkAccess('Contacts', 'delete').status
// ============permission===edit=delete===========

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'Name',
    header: 'Name',
    cell: ({ row }) => <p>{row.original.firstName + ' ' + row.original.lastName}</p>
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'message',
    header: 'Message',
    cell: ({ row }) => {
      const message = row.original.message
      return (
        <div className="max-w-[300px] truncate" title={message}>
          {message}
        </div>
      )
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      if (status === 'resolved')
        return (
          <Badge variant="outline" className="border-green-200 bg-green-100 text-green-800 hover:bg-green-200">
            Resolved
          </Badge>
        )
      else
        return (
          <Badge variant="outline" className="border-yellow-200 bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Pending
          </Badge>
        )
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const createdAt = new Date(row.original.createdAt)
      return format(createdAt, 'MMM dd, yyyy')
    }
  },
  ...(respondPermission || deletePermission
    ? [
        {
          id: 'actions',
          cell: ({ row }: any) => <CellAction data={row.original} />
        }
      ]
    : [])
]
