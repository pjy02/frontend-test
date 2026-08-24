import { cn } from "@workspace/ui/lib/utils";
import type * as React from "react";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "field-sizing-content flex min-h-[calc(var(--control-height)*2)] w-full rounded-md border border-input bg-card px-[var(--control-padding-x)] py-2 text-base shadow-xs outline-none transition-[color,border-color,box-shadow,background-color] duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
        className
      )}
      data-slot="textarea"
      {...props}
    />
  );
}

export { Textarea };
