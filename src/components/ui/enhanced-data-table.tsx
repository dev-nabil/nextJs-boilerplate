"use client"

import type React from "react"

import { useState, useMemo, useCallback } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
} from "@tanstack/react-table"
import { motion, AnimatePresence } from "framer-motion"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Settings2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { DataTableProps } from "@/types/table"

interface DataWithId {
  id: string | number
}

/**
 * Sortable Row Component for Drag & Drop functionality
 */
function SortableRow<T extends DataWithId>({
  row,
  children,
}: {
  row: any
  children: React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.original.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn("cursor-move", isDragging && "shadow-lg")}
    >
      {children}
    </TableRow>
  )
}

/**
 * Loading Skeleton Component
 */
function LoadingSkeleton({ columns }: { columns: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: columns }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

/**
 * Enhanced Data Table Component
 * A comprehensive, feature-rich data table with advanced functionality
 *
 * Features:
 * - Sorting, filtering, and pagination
 * - Row selection and bulk operations
 * - Drag and drop reordering
 * - Column visibility controls
 * - Export functionality
 * - Responsive design
 * - Loading states and animations
 * - Search and advanced filtering
 *
 * @example
 * ```tsx
 * const columns = [
 *   {
 *     accessorKey: "name",
 *     header: "Name",
 *   },
 *   {
 *     accessorKey: "email",
 *     header: "Email",
 *   },
 * ]
 *
 * <EnhancedDataTable
 *   columns={columns}
 *   data={users}
 *   loading={isLoading}
 *   enableRowSelection
 *   enableDragAndDrop
 *   onRowClick={(row) => console.log(row.original)}
 * />
 * ```
 */
export function EnhancedDataTable<TData extends DataWithId, TValue>({
  columns,
  data,
  loading = false,
  searchKey,
  searchPlaceholder = "Search...",
  showSearch = true,
  showPagination = true,
  enableSorting = true,
  enableFiltering = true,
  enableRowSelection = false,
  enableDragAndDrop = false,
  onRowClick,
  onDragEnd,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = useState("")

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const tableColumns = useMemo(() => {
    const cols = [...columns]

    if (enableRowSelection) {
      cols.unshift({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      })
    }

    return cols
  }, [columns, enableRowSelection])

  const table = useReactTable({
    data,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    enableSorting,
    enableColumnFilters: enableFiltering,
  })

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (active.id !== over?.id) {
        const oldIndex = data.findIndex((item) => item.id === active.id)
        const newIndex = data.findIndex((item) => item.id === over?.id)

        const newData = arrayMove(data, oldIndex, newIndex)
        onDragEnd?.(newData)
      }
    },
    [data, onDragEnd],
  )

  const exportData = useCallback(() => {
    const csvContent = [
      // Headers
      table
        .getVisibleFlatColumns()
        .map((col) => col.id)
        .join(","),
      // Data
      ...table.getFilteredRowModel().rows.map((row) =>
        row
          .getVisibleCells()
          .map((cell) => String(cell.getValue() || "").replace(/,/g, ";"))
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "table-data.csv"
    a.click()
    URL.revokeObjectURL(url)
  }, [table])

  const TableContent = () => (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className="relative">
                {header.isPlaceholder ? null : (
                  <div
                    className={cn(
                      "flex items-center space-x-2",
                      header.column.getCanSort() && "cursor-pointer select-none hover:bg-accent/50 rounded p-1 -m-1",
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      <ArrowUpDown
                        className={cn(
                          "h-4 w-4 transition-all",
                          header.column.getIsSorted() === "desc" && "rotate-180",
                          header.column.getIsSorted() === "asc" && "rotate-0",
                          !header.column.getIsSorted() && "opacity-50",
                        )}
                      />
                    )}
                  </div>
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingSkeleton columns={tableColumns.length} />
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => {
              const RowComponent = enableDragAndDrop ? SortableRow : TableRow

              return (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  asChild
                >
                  <RowComponent
                    row={row}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "transition-colors hover:bg-muted/50",
                      onRowClick && "cursor-pointer",
                      row.getIsSelected() && "bg-muted",
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </RowComponent>
                </motion.tr>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="text-muted-foreground">No results found</div>
                  {globalFilter && (
                    <Button variant="outline" size="sm" onClick={() => setGlobalFilter("")}>
                      Clear search
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}
        </AnimatePresence>
      </TableBody>
    </Table>
  )

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-8 w-[250px]"
              />
            </div>
          )}

          {enableFiltering && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {columnFilters.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {columnFilters.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                <DropdownMenuLabel>Filter columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanFilter())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings2 className="h-4 w-4 mr-2" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-2">
          {enableRowSelection && (
            <Badge variant="secondary">
              {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} selected
            </Badge>
          )}

          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        {enableDragAndDrop ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={data.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              <TableContent />
            </SortableContext>
          </DndContext>
        ) : (
          <TableContent />
        )}
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
