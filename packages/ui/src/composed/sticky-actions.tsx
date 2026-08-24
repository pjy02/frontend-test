import { cn } from "@workspace/ui/lib/utils";
import type * as React from "react";

export interface StickyActionsProps extends React.ComponentProps<"div"> {
  description?: React.ReactNode;
}

export function StickyActions({
  children,
  className,
  description,
  ...props
}: StickyActionsProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 flex flex-col gap-3 border-t bg-background/92 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/78 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      data-slot="sticky-actions"
      {...props}
    >
      <div className="min-w-0 text-muted-foreground text-xs">{description}</div>
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
        {children}
      </div>
    </div>
  );
}
