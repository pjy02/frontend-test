import { cn } from "@workspace/ui/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-surface-muted duration-[var(--motion-duration-slow)]",
        className
      )}
      data-slot="skeleton"
      {...props}
    />
  );
}

export { Skeleton };
