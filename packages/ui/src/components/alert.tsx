import { cn } from "@workspace/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const alertVariants = cva(
  "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-[var(--control-padding-x-lg)] py-3 text-sm shadow-xs has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "border-destructive/20 bg-destructive/8 text-destructive *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current",
        success:
          "border-success/20 bg-success/8 text-success *:data-[slot=alert-description]:text-foreground/75",
        warning:
          "border-warning/25 bg-warning/10 text-warning-foreground *:data-[slot=alert-description]:text-foreground/75 dark:text-warning",
        info: "border-info/20 bg-info/8 text-info *:data-[slot=alert-description]:text-foreground/75",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      data-slot="alert"
      role="alert"
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      data-slot="alert-title"
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-muted-foreground text-sm [&_p]:leading-relaxed",
        className
      )}
      data-slot="alert-description"
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
