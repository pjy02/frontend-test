import { cn } from "@workspace/ui/lib/utils";
import type * as React from "react";

export interface FormSectionProps
  extends Omit<React.ComponentProps<"section">, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

export function FormSection({
  actions,
  children,
  className,
  description,
  title,
  ...props
}: FormSectionProps) {
  return (
    <section
      className={cn(
        "grid gap-5 border-b pb-6 last:border-b-0 last:pb-0 lg:grid-cols-[13rem_minmax(0,1fr)]",
        className
      )}
      data-slot="form-section"
      {...props}
    >
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h2 className="type-heading">{title}</h2>
          {actions}
        </div>
        {description && (
          <p className="mt-1.5 text-muted-foreground text-xs leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="grid min-w-0 gap-4">{children}</div>
    </section>
  );
}
