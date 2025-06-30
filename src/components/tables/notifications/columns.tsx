'use client'

import { Badge } from '@/components/ui/badge'
import { Notification } from '@/schemas/notification'
import { ColumnDef } from '@tanstack/react-table'
import CellAction from './cell-action'

export const columns: ColumnDef<Notification>[] = [
  {
    header: 'Notification',
    cell: ({ row }) => (
      <div className="flex items-center gap-7">
        <div>
          {row?.original?.image ? (
            <img src={row?.original?.image as string} alt="notification" className="aspect-square w-20 rounded-xl object-cover" />
          ) : (
            <div className="flex aspect-square w-20 items-center justify-center rounded-xl border bg-muted text-3xl text-muted-foreground">
              🔔
            </div>
          )}
        </div>

        <div className="space-y-1 py-1 text-sm">
          <p>
            <b>Title: </b>
            {row?.original?.title}
          </p>
          <p>
            <b>Body: </b>
            {row?.original?.body}
          </p>
          {row?.original?.actionUrl && (
            <p>
              <b>Action URL: </b>
              {row?.original?.actionUrl}
            </p>
          )}
        </div>
      </div>
    )
  },

  {
    header: 'Type',
    cell: ({ row }) => <Badge>{row.original.type === 'in_app' ? 'In-App' : 'URL'}</Badge>
  },
  {
    id: 'Actions',
    cell: ({ row }) => <CellAction id={row?.original?.id as string} />
  }
]
