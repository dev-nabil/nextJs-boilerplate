import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
// import { DeleteConfirmation } from './DeleteConfirmation';

interface DataTableProps {
  columns: any
  columnsFilter?: boolean
  data: any
  // rowActions: boolean;
  editRow?: (id: number | string) => string
  editIcon?: React.ReactNode
  deleteRow?: (id: number | string) => void
  modelHandelFunction?: (isOpen: boolean, data?: any) => void
  isLoading?: boolean
  total?: number | undefined
  currentPage?: number | undefined
  totalPages?: number | undefined
  query?: any
  setQuery?: (query: any) => void
  pageSizeOptions?: number[]
  filter?: string | 'customFilter'
  customFilter?: React.ReactNode
}

export default function CustomTable({
  data = [],
  columns = [],
  // rowActions,
  // editRow,
  // editIcon = <PenLineIcon className="w-5 h-5" />,
  // deleteRow,
  // modelHandelFunction,
  columnsFilter = false,
  isLoading = true,
  total = data.length || 0,
  currentPage = 1,
  totalPages = 1,
  query = {
    page: 1,
    limit: 10
  },
  setQuery,
  pageSizeOptions = [10, 20, 50, 100, 200, 500],
  filter = '',
  customFilter
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Add "Edit" and "Delete" columns to the columns array
  // const modifiedColumns = [
  //   ...columns,
  //   {
  //     id: 'actions',
  //     header: () => {
  //       return (
  //         <Button className="w-full justify-end items-center " variant="ghost">
  //           Actions
  //         </Button>
  //       );
  //     },
  //     cell: ({ row }: any) =>
  //       row?.original && (
  //         <div className="flex gap-2 space-x-2 justify-end items-center">
  //           {editRow && (
  //             <Link href={editRow ? editRow(row?.original?.id) : ''}>
  //               <Button
  //                 variant="outline"
  //                 className="border px-4 py-2 rounded-lg hover:bg-gray-800 hover:text-primary-50 bg-primary-50 text-white"
  //               >
  //                 {editIcon}
  //               </Button>
  //             </Link>
  //           )}
  //           {modelHandelFunction && (
  //             <>
  //               <Button
  //                 variant="outline"
  //                 className="border px-4 py-2 rounded-lg hover:bg-gray-800 hover:text-primary-50 bg-primary-50 text-white"
  //                 onClick={() => modelHandelFunction(true, row?.original)}
  //               >
  //                 {editIcon}
  //               </Button>
  //             </>
  //           )}

  //           {/* {deleteRow && <DeleteConfirmation id={row?.original?.id} deleteFunction={deleteRow} />} */}
  //         </div>
  //       ),
  //   },
  // ];

  const table = useReactTable({
    data,
    columns: columns || [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  return (
    <div className="px-4">
      <div className="flex items-center gap-5 py-4">
        {filter === 'customFilter' ? (
          customFilter
        ) : filter != '' ? (
          <Input
            placeholder={`Search ${filter}`}
            value={(table.getColumn(filter || '')?.getFilterValue() as string) ?? ''}
            onChange={event => {
              table.getColumn(filter || '')?.setFilterValue(event.target.value)
              if (setQuery && query?.search) {
                setQuery({
                  ...query,
                  search: event.target.value
                })
              }
            }}
            className="max-w-sm"
          />
        ) : (
          ''
        )}
        {columnsFilter ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <></>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const headClassName = (header.column.columnDef as any).headClassName
                  return (
                    <TableHead className={headClassName} key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {
              isLoading ? (
                // Loading state
                [...Array(10)].map((_, index) => (
                  <TableRow key={index}>
                    {table
                      .getAllColumns()
                      .filter(column => column.getCanHide())
                      .map(i => (
                        <TableCell key={i.id}>
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                      ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )
              // [...Array(10)].map((_, index) => (
              //   <TableRow key={index}>
              //     {table
              //       .getAllColumns()
              //       .filter((column) => column.getCanHide())
              //       .map((i) => (
              //         <TableCell key={i.id}>
              //           <Skeleton className="h-4 w-[100px]" />
              //         </TableCell>
              //       ))}
              //   </TableRow>
              // ))
            }
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-3 bg-[#F8F9FD] py-4 text-[#94989B] md:flex-row md:items-center md:justify-between md:space-x-2">
        {/* <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div> */}
        <div className="flex w-full items-center justify-center text-sm font-medium md:w-[100px]">
          {currentPage} / {totalPages} of {total ? total : 0}
        </div>

        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center md:space-x-2">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium whitespace-nowrap">Rows per page</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={event => {
                table.setPageSize(Number(event.target.value))
                if (setQuery) {
                  setQuery({ ...query, limit: event.target.value })
                }
              }}
              className="h-8 w-[70px] rounded-md border bg-transparent px-2 py-1"
            >
              {pageSizeOptions.map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-2 flex items-center space-x-2 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                table.previousPage()
                if (setQuery) {
                  setQuery({ ...query, page: currentPage - 1 })
                }
              }}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <div>
              <span className="text-gray-900">{currentPage}</span> / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                table.nextPage()
                if (setQuery && query.page) {
                  setQuery({ ...query, page: currentPage + 1 })
                }
              }}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
