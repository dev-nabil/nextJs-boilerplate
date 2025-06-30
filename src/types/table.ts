import type React from "react"
import type { ColumnDef, Row } from "@tanstack/react-table"

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  searchKey?: string
  searchPlaceholder?: string
  showSearch?: boolean
  showPagination?: boolean
  enableSorting?: boolean
  enableFiltering?: boolean
  enableRowSelection?: boolean
  enableDragAndDrop?: boolean
  onRowClick?: (row: Row<TData>) => void
  onDragEnd?: (data: TData[]) => void
  className?: string
}

export interface TableColumn<T> {
  key: keyof T
  label: string
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}
