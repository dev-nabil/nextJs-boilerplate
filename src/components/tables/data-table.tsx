import { Icons } from "@/components/custom/icons";
import Loader from "@/components/custom/loader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import generateURLParams from "@/lib/generate-url-params";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ColumnDef,
  PaginationState,
  Row,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, memo, useEffect, useMemo, useState } from "react";
import DragHandler from "./drag-handler";
import TableSearch from "./table-search";

interface DataWithId {
  id?: string;
}

interface Props<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  loading: boolean;
  limit?: number;
  totalItems: number;
  totalPages?: number;
  showSearch?: boolean;
  showPagination?: boolean;
  enableDrag?: boolean;
  onDragEnd?: (newList: TData[]) => void;
  refetch: () => void;
}

const pageSizeOptions = [10, 20, 50, 100, 200];

export const RefetchContext = createContext(() => {});

export default function DataTable<TData extends DataWithId, TValue>(
  props: Props<TData, TValue>
) {
  const {
    columns = [],
    data = [],
    onDragEnd,
    limit,
    searchKey = "",
    totalItems = 0,
    totalPages,
    showSearch = true,
    showPagination = true,
    loading,
    enableDrag = false,
    refetch,
  } = props;

  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams?.get("page") ?? "1");

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: page - 1,
    pageSize: limit ?? pageSizeOptions[pageSizeOptions.length - 1],
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = data.findIndex((item) => item.id === active?.id);
      const newIndex = data.findIndex((item) => item.id === over?.id);

      const updatedList = arrayMove(data, oldIndex, newIndex);
      onDragEnd?.(updatedList);
    }
  }

  const table = useReactTable({
    columns: enableDrag
      ? [
          ...columns,
          {
            id: "drag",
            cell: ({ row }) => <DragHandler id={row.original.id as string} />,
          },
        ]
      : columns,
    data,
    pageCount: totalPages,
    manualPagination: true,
    manualFiltering: true,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination: { pageIndex, pageSize } },
  });

  // pagination effect
  useEffect(() => {
    const urlParams = generateURLParams(searchParams, {
      page: String(pageIndex + 1),
      limit: String(pageSize),
    });

    replace(`${pathname}?${urlParams}`);
  }, [limit, page, pageIndex, pageSize, pathname, replace, searchParams]);

  // Memoized DraggableRow to prevent unnecessary re-renders
  const DraggableRow = memo(function DraggableRow({
    row,
  }: {
    row: Row<TData>;
  }) {
    const { setNodeRef, transform, transition } = useSortable({
      id: row.original.id as string,
    });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
      <TableRow ref={setNodeRef} style={style}>
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id} className="whitespace-nowrap">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    );
  });

  // Memoize the list of draggable item IDs
  const draggableItemIds = useMemo(
    () => data.map((item) => item.id as string),
    [data]
  );

  return (
    <div className="space-y-4 rounded-lg bg-white p-3 shadow-md sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          {showSearch && <TableSearch searchKey={searchKey} />}
        </div>
        <span className="text-muted-foreground rounded-lg border bg-white px-4 py-2 text-center text-sm sm:px-7 sm:py-1">
          Total: {totalItems}
        </span>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <RefetchContext.Provider value={refetch}>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={draggableItemIds}
              strategy={verticalListSortingStrategy}
            >
              <Table className="overflow-x:auto data-table">
                <TableHeader className="">
                  {table?.getHeaderGroups()?.map((headerGroup) => (
                    <TableRow className="bg-muted/10" key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody className="**:data-[slot=table-cell]:first:w-8">
                  {table?.getRowModel()?.rows?.length ? (
                    table
                      .getRowModel()
                      .rows.map((row) => (
                        <DraggableRow key={row.id} row={row} />
                      ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-muted-foreground h-40 text-center"
                      >
                        No results Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </SortableContext>
          </DndContext>
        </RefetchContext.Provider>
      )}

      {showPagination && (
        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-center space-x-2 sm:justify-start">
            <p className="text-sm font-medium whitespace-nowrap">
              Rows per page
            </p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(event) => {
                table.setPageSize(Number(event.target.value));
              }}
              className="h-8 w-[70px] rounded-md border bg-transparent px-2 py-1"
            >
              {pageSizeOptions.map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <div className="text-sm font-medium whitespace-nowrap">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              {/* first page */}
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 sm:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <Icons.chevronsLeft className="h-4 w-4" aria-hidden="true" />
              </Button>

              {/* previous page */}
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <Icons.chevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>

              {/* next page */}
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <Icons.chevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>

              {/* last page */}
              <Button
                aria-label="Go to last page"
                variant="outline"
                className="hidden h-8 w-8 p-0 sm:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <Icons.chevronsRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
