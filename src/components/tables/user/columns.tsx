"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import CellAction from "./cell-action"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const address = row.original.address
      if (!address) return "N/A"

      const city = address.city || ""
      const country = address.country || ""
      return city && country ? `${city}, ${country}` : city || country || "N/A"
    },
  },
  {
    accessorKey: "verification",
    header: "Verification",
    cell: ({ row }) => {
      // Only show verification status for sellers
      if (row.original.role !== "seller") return "N/A"

      const verified = row.original.verified
      const status = row.original.verificationStatus

      if (verified) {
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Verified</Badge>
      }

      switch (status) {
        case "pending":
          return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200" >Pending</Badge>
        case "failed":
          return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">Failed</Badge>
        case "not_applied":
          return <Badge variant="outline">Not Applied</Badge>
        default:
          return <Badge variant="outline">Not Verified</Badge>
      }
    },
  },
  {
    accessorKey: "status",
    header: "Account Status",
    cell: ({ row }) => {
      const blocked = row.original.blocked

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
    header: "Joined",
    cell: ({ row }) => {
      const date = row.original.createdAt
      if (!date) return "N/A"

      try {
        return format(new Date(date), "MMM d, yyyy")
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
