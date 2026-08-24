"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { TableCell, TableHead, TableRow } from "@workspace/ui/components/table";
import { DataTable } from "@workspace/ui/composed/data-table";
import { FilterBar } from "@workspace/ui/composed/filter-bar";
import {
  ColumnFilter,
  type IParams,
} from "@workspace/ui/composed/pro-table/column-filter";
import { ColumnHeader } from "@workspace/ui/composed/pro-table/column-header";
import { ColumnToggle } from "@workspace/ui/composed/pro-table/column-toggle";
import { Pagination } from "@workspace/ui/composed/pro-table/pagination";
import { SortableRow } from "@workspace/ui/composed/pro-table/sortable-row";
import { ProTableWrapper } from "@workspace/ui/composed/pro-table/wrapper";
import { cn } from "@workspace/ui/lib/utils";
import { useSize } from "ahooks";
import { GripVertical, ListRestart, RefreshCcw } from "lucide-react";
import type React from "react";
import {
  Fragment,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export interface ProTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  request: (
    pagination: {
      page: number;
      size: number;
    },
    filter: TValue
  ) => Promise<{ list: TData[]; total: number }>;
  params?: IParams[];
  header?: {
    title?: React.ReactNode;
    toolbar?: React.ReactNode | React.ReactNode[];
    hidden?: boolean;
  };
  actions?: {
    render?: (row: TData) => React.ReactNode[];
    batchRender?: (rows: TData[]) => React.ReactNode[];
  };
  action?: React.Ref<ProTableActions | undefined>;
  texts?: Partial<{
    actions: string;
    asc: string;
    desc: string;
    hide: string;
    textRowsPerPage: string;
    textPageOf: (current: number, total: number) => string;
    selectedRowsText: (total: number) => string;
  }>;
  empty?: React.ReactNode;
  onSort?: (
    sourceId: string | number,
    targetId: string | number | null,
    items: TData[]
  ) => Promise<TData[]>;
  initialFilters?: Record<string, unknown>;
}

export interface ProTableActions {
  refresh: () => void;
  reset: () => void;
}

export function ProTable<
  TData extends Record<string, unknown> & { id?: string | number },
  TValue extends Record<string, unknown>,
>({
  columns,
  request,
  params,
  header,
  actions,
  action,
  texts,
  empty,
  onSort,
  initialFilters,
}: ProTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    if (initialFilters) {
      return Object.entries(initialFilters).map(([id, value]) => ({
        id,
        value,
      })) as ColumnFiltersState;
    }
    return [];
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<TData[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const requestSequence = useRef(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<React.ReactNode>(null);

  const table = useReactTable({
    data,
    columns: [
      ...(onSort
        ? [
            {
              id: "sortable",
              header: (
                <GripVertical className="h-4 w-4 cursor-move text-gray-500 hover:text-gray-700" />
              ),
              enableSorting: false,
              enableHiding: false,
            },
          ]
        : []),
      ...(actions?.batchRender ? [createSelectColumn<TData, TValue>()] : []),
      ...columns.map(
        (column) =>
          ({
            enableSorting: false,
            ...column,
          }) as ColumnDef<TData, TValue>
      ),
      ...(actions?.render
        ? ([
            {
              id: "actions",
              header: texts?.actions,
              cell: ({ row }) => (
                <div className="flex items-center justify-end gap-2">
                  {actions?.render?.(row.original).map((item, index) => (
                    <Fragment key={index}>{item}</Fragment>
                  ))}
                </div>
              ),
              enableSorting: false,
              enableHiding: false,
            },
          ] as ColumnDef<TData, TValue>[])
        : []),
    ] as ColumnDef<TData, TValue>[],
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    manualPagination: true,
    manualFiltering: true,
    rowCount,
    manualSorting: true,
  });

  const fetchData = async () => {
    const requestId = ++requestSequence.current;
    setLoading(true);
    setError(null);
    try {
      const response = await request(
        {
          page: pagination.pageIndex + 1,
          size: pagination.pageSize,
        },
        Object.fromEntries(
          columnFilters.map((item) => [item.id, item.value])
        ) as TValue
      );
      if (requestId === requestSequence.current) {
        setData(response.list);
        setRowCount(response.total);
      }
    } catch (error) {
      if (requestId !== requestSequence.current) return;
      console.log("Fetch data error:", error);
      setError(
        error instanceof Error ? error.message : "The request could not finish."
      );
    } finally {
      if (requestId === requestSequence.current) {
        setLoading(false);
      }
    }
  };
  const reset = async () => {
    table.resetSorting();
    table.resetColumnFilters();
    table.resetGlobalFilter(true);
    table.resetColumnVisibility();
    table.resetRowSelection();
    table.resetPagination();
  };
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  useImperativeHandle(action, () => ({
    refresh: fetchData,
    reset,
  }));

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    JSON.stringify(columnFilters),
  ]);

  const selectedRows = table
    .getSelectedRowModel()
    .flatRows.map((row) => row.original);
  const selectedCount = selectedRows.length;

  return (
    <div className="flex flex-col gap-4" ref={ref}>
      {!header?.hidden && (
        <FilterBar
          actions={
            <>
              <Button onClick={fetchData} size="icon" variant="outline">
                <RefreshCcw />
              </Button>
              <ColumnToggle table={table} />
              <Button onClick={reset} size="icon" variant="outline">
                <ListRestart />
              </Button>
              {header?.toolbar}
            </>
          }
        >
          {params ? (
            <ColumnFilter
              filters={Object.fromEntries(
                columnFilters.map((item) => [item.id, item.value])
              )}
              params={params}
              table={table}
            />
          ) : (
            header?.title
          )}
        </FilterBar>
      )}

      {selectedCount > 0 && actions?.batchRender && (
        <Alert className="flex items-center justify-between">
          <AlertTitle className="m-0">
            {texts?.selectedRowsText?.(selectedCount) ||
              `Selected ${selectedCount} rows`}
          </AlertTitle>
          <AlertDescription className="flex gap-2">
            {actions.batchRender(selectedRows)}
          </AlertDescription>
        </Alert>
      )}

      <ProTableWrapper data={data} onSort={onSort} setData={setData}>
        <DataTable
          columns={table.getVisibleLeafColumns().length}
          empty={empty}
          error={error}
          header={table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  className={cn(
                    "!z-auto",
                    getTableHeaderClass(header.column.id)
                  )}
                  key={header.id}
                >
                  <ColumnHeader
                    header={header}
                    text={{
                      asc: texts?.asc,
                      desc: texts?.desc,
                      hide: texts?.hide,
                    }}
                  />
                </TableHead>
              ))}
            </TableRow>
          ))}
          isEmpty={!table.getRowModel()?.rows?.length}
          loading={loading}
          onRetry={fetchData}
          style={{ width: size?.width }}
        >
          {onSort
            ? table.getRowModel().rows.map((row) => (
                <SortableRow
                  data-state={row.getIsSelected() && "selected"}
                  id={
                    row.original.id
                      ? String(row.original.id)
                      : String(row.index)
                  }
                  isSortable
                  key={
                    row.original.id
                      ? String(row.original.id)
                      : String(row.index)
                  }
                >
                  {row
                    .getVisibleCells()
                    .filter((cell) => cell.column.id !== "sortable")
                    .map((cell) => (
                      <TableCell
                        className={getTableCellClass(cell.column.id)}
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                </SortableRow>
              ))
            : table.getRowModel().rows.map((row) => (
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className={getTableCellClass(cell.column.id)}
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </DataTable>
      </ProTableWrapper>
      {rowCount > 0 && <Pagination table={table} />}
    </div>
  );
}

function createSelectColumn<TData, TValue>(): ColumnDef<TData, TValue> {
  return {
    id: "selected",
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

function getTableHeaderClass(columnId: string) {
  if (["sortable", "selected"].includes(columnId)) {
    return "sticky left-0 z-10 bg-background shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] [&:has([role=checkbox])]:pr-2";
  }
  if (columnId === "actions") {
    return "sticky right-0 z-10 text-right bg-background shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]";
  }
  return "truncate";
}

function getTableCellClass(columnId: string) {
  if (["sortable", "selected"].includes(columnId)) {
    return "sticky left-0 bg-background shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]";
  }
  if (columnId === "actions") {
    return "sticky right-0 bg-background shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]";
  }
  return "truncate";
}
