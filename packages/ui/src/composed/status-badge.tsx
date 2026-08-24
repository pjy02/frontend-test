import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import type * as React from "react";

export type StatusTone =
  | "neutral"
  | "success"
  | "warning"
  | "info"
  | "destructive";

export const statusToneVariants = {
  destructive: "destructive",
  info: "info",
  neutral: "secondary",
  success: "success",
  warning: "warning",
} as const;

const statusDotClassNames: Record<StatusTone, string> = {
  destructive: "bg-destructive",
  info: "bg-info",
  neutral: "bg-muted-foreground",
  success: "bg-success",
  warning: "bg-warning",
};

export interface StatusBadgeProps extends React.ComponentProps<typeof Badge> {
  tone?: StatusTone;
  dot?: boolean;
  pulse?: boolean;
}

export function StatusBadge({
  children,
  className,
  dot = true,
  pulse = false,
  tone = "neutral",
  variant,
  ...props
}: StatusBadgeProps) {
  return (
    <Badge
      className={cn("gap-1.5", className)}
      data-slot="status-badge"
      data-tone={tone}
      variant={variant ?? statusToneVariants[tone]}
      {...props}
    >
      {dot && (
        <span aria-hidden="true" className="relative flex size-1.5">
          {pulse && (
            <span
              className={cn(
                "absolute inline-flex size-full animate-ping rounded-full opacity-45",
                statusDotClassNames[tone]
              )}
            />
          )}
          <span
            className={cn(
              "relative inline-flex size-1.5 rounded-full",
              statusDotClassNames[tone]
            )}
          />
        </span>
      )}
      {children}
    </Badge>
  );
}
