"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DataTable({
  columns,
  data,
  className = "",
  isLoading = false,
  onRowClick,
  // Server-side pagination props
  serverSide = false,
  pageCount: controlledPageCount,
  onPaginationChange: onServerPaginationChange,
  pageIndex: controlledPageIndex,
  pageSize: controlledPageSize,
}) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: controlledPageIndex || 0,
    pageSize: controlledPageSize || 10,
  });

  // Update local pagination when controlled props change
  React.useEffect(() => {
    if (serverSide) {
      setPagination({
        pageIndex: controlledPageIndex || 0,
        pageSize: controlledPageSize || 10,
      });
    }
  }, [controlledPageIndex, controlledPageSize, serverSide]);

  const handlePaginationChange = (updater) => {
    if (serverSide && onServerPaginationChange) {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater;
      onServerPaginationChange(newPagination);
    }
    setPagination(updater);
  };

  // Debug logging for server-side pagination
  React.useEffect(() => {
    if (serverSide) {
      console.log("[DataTable] Server-side pagination:", {
        controlledPageCount,
        controlledPageIndex,
        controlledPageSize,
        localPagination: pagination,
      });
    }
  }, [
    serverSide,
    controlledPageCount,
    controlledPageIndex,
    controlledPageSize,
    pagination,
  ]);

  const table = useReactTable({
    data,
    columns,
    pageCount: serverSide ? controlledPageCount || 1 : undefined,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: serverSide ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: handlePaginationChange,
    manualPagination: serverSide,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
  });

  return (
    <div className={className}>
      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className="h-9 px-3 text-left align-middle font-medium text-muted-foreground"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "flex items-center gap-2 cursor-pointer select-none"
                              : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getCanSort() && (
                            <span className="ml-auto">
                              {header.column.getIsSorted() === "asc" ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronsUpDown className="h-4 w-4 opacity-50" />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: pagination.pageSize / 2 }).map(
                (_, index) => (
                  <tr key={`skeleton-${index}`} className={`border-t`}>
                    {columns.map((column, colIndex) => (
                      <td
                        key={`skeleton-cell-${colIndex}`}
                        className="px-3 py-1.5"
                      >
                        <Skeleton className="h-5 w-full" />
                      </td>
                    ))}
                  </tr>
                ),
              )
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={`border-t hover:bg-muted/50 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-1.5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-4 bg-muted/10">
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-muted-foreground whitespace-nowrap hidden sm:inline">
            Rows per page
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-9 w-[75px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 25, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <p className="hidden sm:block text-sm font-medium text-muted-foreground whitespace-nowrap">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {serverSide && controlledPageCount
              ? controlledPageCount
              : table.getPageCount()}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="h-9 w-9 hidden sm:flex"
              title="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-9 w-9"
              title="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              min="1"
              max={table.getPageCount()}
              value={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="w-14 h-9 text-center font-medium"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-9 w-9"
              title="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="h-9 w-9 hidden sm:flex"
              title="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
