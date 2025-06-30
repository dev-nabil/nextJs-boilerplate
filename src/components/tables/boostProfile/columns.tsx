import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { IBoostProfile } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { BlogCellAction } from './cell-action'

export const columns: ColumnDef<IBoostProfile>[] = [
  {
    header: 'User Info',
    accessorKey: 'user.avatar',
    cell: ({ row }) => (
      <div className="flex items-center border-b border-gray-200 py-3 last:border-b-0">
        <Avatar className="mr-3 h-10 w-10">
          <AvatarImage src={row.original.user?.avatar || '/placeholder.svg'} alt={row.original.user?.name} />
          <AvatarFallback>{row.original.user?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <p className="text-sm font-semibold text-gray-800">{row.original.user?.name}</p>
        </div>
      </div>
    )
  },
  {
    header: 'Email',
    accessorKey: 'user.email',
    cell: ({ row }) => row.original.user?.email || 'N/A'
  },

  // Created At Column
  {
    header: 'Total Boost',
    accessorKey: '_count',
    cell: ({ row }) => row.original._count.boosts || 0
  },

  // Action Column
  {
    header: () => <div className="text-end">Action</div>,
    id: 'Actions',
    cell: ({ row }) => <BlogCellAction id={row.original.id} />
  }
]
