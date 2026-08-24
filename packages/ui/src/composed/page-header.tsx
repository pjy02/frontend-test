import { cn } from "@workspace/ui/lib/utils";
import type * as React from "react";

export interface PageHeaderProps
  extends Omit<React.ComponentProps<"header">, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  metadata?: React.ReactNode;
}

export function PageHeader({
  actions,
  className,
  description,
  eyebrow,
  metadata,
  title,
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
      data-slot="page-header"
      {...props}
    >
      <div className="min-w-0 max-w-3xl">
        {eyebrow && (
          <div className="type-label mb-2 text-primary uppercase">
            {eyebrow}
          </div>
        )}
        <h1 className="type-title text-balance">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        )}
        {metadata && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
            {metadata}
          </div>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          {actions}
        </div>
      )}
    </header>
  );
}
