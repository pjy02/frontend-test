import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { RotateCcw, Search } from "lucide-react";
import type * as React from "react";

export interface FilterBarProps extends React.ComponentProps<"div"> {
  actions?: React.ReactNode;
  onReset?: () => void;
  resetLabel?: string;
  summary?: React.ReactNode;
}

export function FilterBar({
  actions,
  children,
  className,
  onReset,
  resetLabel = "Reset filters",
  summary,
  ...props
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-[var(--shadow-xs)] lg:flex-row lg:items-center lg:justify-between",
        className
      )}
      data-slot="filter-bar"
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        {children}
        {summary && (
          <span className="text-muted-foreground text-xs">{summary}</span>
        )}
      </div>
      {(actions || onReset) && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
          {onReset && (
            <Button onClick={onReset} size="sm" variant="ghost">
              <RotateCcw />
              {resetLabel}
            </Button>
          )}
          {actions}
        </div>
      )}
    </div>
  );
}

export function FilterSearch({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <div className="relative min-w-48 flex-1 sm:max-w-xs">
      <Search
        aria-hidden="true"
        className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground"
      />
      <Input className={cn("pl-9", className)} type="search" {...props} />
    </div>
  );
}

export function FilterGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      data-slot="filter-group"
      {...props}
    />
  );
}
