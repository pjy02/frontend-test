import { cn } from "@workspace/ui/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import type { ComponentPropsWithRef } from "react";

export interface SettingsEntryProps extends ComponentPropsWithRef<"button"> {
  description: string;
  icon: LucideIcon;
  title: string;
}

export function SettingsEntry({
  className,
  description,
  icon: EntryIcon,
  ref,
  title,
  ...props
}: SettingsEntryProps) {
  return (
    <button
      className={cn(
        "group flex w-full cursor-pointer items-center justify-between gap-4 text-left",
        className
      )}
      data-slot="settings-entry"
      ref={ref}
      type="button"
      {...props}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <EntryIcon aria-hidden="true" className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="font-medium leading-none">{title}</p>
          <p className="mt-1.5 text-muted-foreground text-sm leading-snug">
            {description}
          </p>
        </div>
      </div>
      <ChevronRight
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
      />
    </button>
  );
}
