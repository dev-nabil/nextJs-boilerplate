"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "user",
    header: "Admin",
    cell: ({ row }) => {
      const user = row.original.user
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar || ""} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "accessLevels",
    header: "Access Levels",
    cell: ({ row }) => {
      const accessLevels = row.original.accessLevels || []
      return (
        <div className="flex flex-wrap gap-1">
          {accessLevels.length === 0 && <Badge variant="outline">No Access</Badge>}
          {accessLevels.slice(0, 3).map((level: any) => (
            <Badge key={level.id} variant="outline" className="capitalize">
              {level.service}
            </Badge>
          ))}
          {accessLevels.length > 3 && <Badge variant="outline">{`+${accessLevels.length - 3} more`}</Badge>}
        </div>
      )
    },
  },
  {
    accessorKey: "user.blocked",
    header: "Status",
    cell: ({ row }) => {
      const blocked = row.original?.user?.blocked

      if (blocked) {
        return <Badge variant="destructive">Banned</Badge>
      }

      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
          Active
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      try {
        return format(new Date(row.original.createdAt), "MMM d, yyyy")
      } catch (error) {
        return "Invalid Date"
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
