'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { IUser } from '@/types'
import { ColumnDef } from '@tanstack/react-table'

type IProject = {
  id: string
  title: string
  description: string
  fixedAmount: string
  minAmount: string
  maxAmount: string
  paymentType: string
  boostAmount: string
  city: string
  country: string
  expertise: string
  status: string

  buyer: {
    user: IUser
    paymentVerified: boolean
    totalSpent: string
    completedProjects: number
  }
}

export const columns: ColumnDef<IProject>[] = [
  {
    header: 'User Info',
    accessorKey: 'user',
    cell: ({ row }) => (
      <div className="flex items-center border-b border-gray-200 py-3 last:border-b-0">
        <Avatar className="mr-3 h-10 w-10">
          <AvatarImage src={row.original.buyer?.user?.avatar || '/placeholder.svg'} alt={row.original?.buyer?.user?.name} />
          <AvatarFallback className="text-white">{row.original?.buyer?.user?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <p className="text-sm font-semibold text-gray-800">{row.original?.buyer?.user?.name}</p>
          <p className="text-sm font-semibold text-gray-800">{row.original?.buyer?.user?.email}</p>
        </div>
      </div>
    )
  },
  {
    header: 'Project Title',
    accessorKey: 'title',
    cell: ({ row }) => row.original.title
  },

  {
    header: 'Boost Amount',
    accessorKey: 'boostAmount',
    cell: ({ row }) => `NPR ${row.original.boostAmount}`
  },

  {
    header: 'Location',
    cell: ({ row }) => `${row.original.city}, ${row.original.country}`
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => row.original.status
  }
  // {
  //   header: () => <div className="text-end">Action</div>,
  //   id: 'Actions',
  //   cell: ({ row }) => <BlogCellAction id={row.original.id} />
  // }
]
