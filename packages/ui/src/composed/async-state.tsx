import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import { CircleAlert, Inbox, RefreshCcw } from "lucide-react";
import type * as React from "react";

interface StateShellProps extends React.ComponentProps<"div"> {
  compact?: boolean;
}

function StateShell({
  children,
  className,
  compact = false,
  ...props
}: StateShellProps) {
  return (
    <div
      className={cn(
        "grid place-items-center text-center",
        compact ? "min-h-32 p-4" : "min-h-72 p-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface LoadingStateProps extends StateShellProps {
  label?: string;
  rows?: number;
}

export function LoadingState({
  className,
  compact,
  label = "Loading…",
  rows = 3,
  ...props
}: LoadingStateProps) {
  return (
    <StateShell
      aria-busy="true"
      aria-live="polite"
      className={className}
      compact={compact}
      data-slot="loading-state"
      {...props}
    >
      <div className="grid w-full max-w-lg gap-3">
        <span className="sr-only">{label}</span>
        {Array.from({ length: rows }, (_, index) => (
          <div className="flex items-center gap-3" key={index}>
            <Skeleton className="size-9 shrink-0 rounded-lg" />
            <div className="grid flex-1 gap-2">
              <Skeleton className="h-3 w-2/5" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </StateShell>
  );
}

export interface EmptyStateProps extends Omit<StateShellProps, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export function EmptyState({
  action,
  className,
  compact,
  description = "Try adjusting your filters or create the first item.",
  icon,
  title = "No results found",
  ...props
}: EmptyStateProps) {
  return (
    <StateShell
      className={className}
      compact={compact}
      data-slot="empty-state"
      {...props}
    >
      <div className="flex max-w-sm flex-col items-center">
        <div className="mb-4 grid size-11 place-items-center rounded-xl border bg-surface text-muted-foreground shadow-[var(--shadow-xs)]">
          {icon ?? <Inbox className="size-5" />}
        </div>
        <h3 className="type-heading">{title}</h3>
        {description && (
          <p className="mt-1.5 text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        )}
        {action && <div className="mt-4">{action}</div>}
      </div>
    </StateShell>
  );
}

export interface ErrorStateProps extends Omit<StateShellProps, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  action,
  className,
  compact,
  description = "Check your connection and try again.",
  onRetry,
  retryLabel = "Try again",
  title = "Unable to load data",
  ...props
}: ErrorStateProps) {
  return (
    <StateShell
      className={className}
      compact={compact}
      data-slot="error-state"
      role="alert"
      {...props}
    >
      <div className="flex max-w-sm flex-col items-center">
        <div className="mb-4 grid size-11 place-items-center rounded-xl border border-destructive/20 bg-destructive/8 text-destructive">
          <CircleAlert className="size-5" />
        </div>
        <h3 className="type-heading">{title}</h3>
        {description && (
          <p className="mt-1.5 text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        )}
        {(action || onRetry) && (
          <div className="mt-4">
            {action ?? (
              <Button onClick={onRetry} size="sm" variant="outline">
                <RefreshCcw />
                {retryLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </StateShell>
  );
}
