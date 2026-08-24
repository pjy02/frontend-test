import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@workspace/ui/composed/async-state";
import { cn } from "@workspace/ui/lib/utils";
import type * as React from "react";

export interface DataTableProps extends React.ComponentProps<"div"> {
  columns: number;
  empty?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  emptyTitle?: React.ReactNode;
  error?: React.ReactNode;
  header: React.ReactNode;
  isEmpty?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  onRetry?: () => void;
  tableClassName?: string;
}

export function DataTable({
  children,
  className,
  columns,
  empty,
  emptyDescription,
  emptyTitle,
  error,
  header,
  isEmpty = false,
  loading = false,
  loadingLabel,
  onRetry,
  tableClassName,
  ...props
}: DataTableProps) {
  const showLoading = loading && isEmpty;
  const showError = Boolean(error) && isEmpty;
  const showEmpty = !(showLoading || showError) && isEmpty;

  return (
    <div
      className={cn(
        "relative w-full overflow-x-auto rounded-xl border bg-card shadow-[var(--shadow-xs)]",
        className
      )}
      data-slot="data-table"
      {...props}
    >
      <Table className={cn("w-full", tableClassName)}>
        <TableHeader>{header}</TableHeader>
        <TableBody>
          {showLoading && (
            <TableRow className="hover:bg-transparent">
              <TableCell className="p-0" colSpan={columns}>
                <LoadingState compact label={loadingLabel} />
              </TableCell>
            </TableRow>
          )}
          {showError && (
            <TableRow className="hover:bg-transparent">
              <TableCell className="p-0" colSpan={columns}>
                <ErrorState compact description={error} onRetry={onRetry} />
              </TableCell>
            </TableRow>
          )}
          {showEmpty && (
            <TableRow className="hover:bg-transparent">
              <TableCell className="p-0" colSpan={columns}>
                {empty ?? (
                  <EmptyState
                    compact
                    description={emptyDescription}
                    title={emptyTitle}
                  />
                )}
              </TableCell>
            </TableRow>
          )}
          {!isEmpty && children}
        </TableBody>
      </Table>
      {loading && !isEmpty && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-background/65 backdrop-blur-[1px]">
          <LoadingState
            className="min-h-0"
            compact
            label={loadingLabel}
            rows={1}
          />
        </div>
      )}
    </div>
  );
}
