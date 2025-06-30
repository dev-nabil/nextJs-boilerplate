"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "project",
    header: "Project",
    cell: ({ row }) => <div className="max-w-[200px] truncate">{row.original?.contract?.project?.title}</div>,
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => <div className="max-w-[300px]">{row.original?.reason}</div>,
  },
  {
    accessorKey: "note",
    header: "Notes",
    cell: ({ row }) => <div className="max-w-[300px]">{row.original?.note || 'No decision has been made yet'}</div>,
  },
  {
    accessorKey: "assigned",
    header: "Assigned",
    cell: ({ row }) => {
      return row.original?.admin ? <Badge variant={'outline'}>{row.original?.admin?.user?.name}</Badge>
        : <Badge variant={'outline'}>None</Badge>
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status

      let badgeVariant: "outline" | "secondary" | "destructive" | "default" = "outline"

      switch (status) {
        case "pending":
          badgeVariant = "outline"
          break
        case "open":
          badgeVariant = "secondary"
          break
        case "declined":
          badgeVariant = "destructive"
          break
        case "resolved":
          badgeVariant = "default"
          break
      }

      return (
        <Badge variant={badgeVariant} className="capitalize">
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "projectContinue",
    header: "Project Continue",
    cell: ({ row }) => (
      <Badge variant={'outline'} className={row.original.projectContinue ? "" : "text-red-500"}>
        {row.original.projectContinue ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    accessorKey: "paymentRefunded",
    header: "Payment Refunded",
    cell: ({ row }) => (
      <Badge variant={'outline'} className={row.original.paymentRefunded ? "" : "text-red-500"}>
        {row.original.paymentRefunded ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    accessorKey: "paymentResolvedTo",
    header: "Resolved To",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.paymentResolvedTo || 'N/A'}
      </Badge>
    ),
  },
  {
    accessorKey: "raisedBy",
    header: "Raised By",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.raisedBy}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => <div>{format(new Date(row.original.createdAt), "MMM dd, yyyy")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
