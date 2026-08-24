import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { cn } from "@workspace/ui/lib/utils";
import type * as React from "react";

const detailSheetSizes = {
  lg: "sm:max-w-3xl",
  md: "sm:max-w-xl",
  sm: "sm:max-w-md",
} as const;

export interface DetailSheetProps extends React.ComponentProps<typeof Sheet> {
  title: React.ReactNode;
  description?: React.ReactNode;
  trigger?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  headerContent?: React.ReactNode;
  size?: keyof typeof detailSheetSizes;
  contentClassName?: string;
  bodyClassName?: string;
}

export function DetailSheet({
  bodyClassName,
  children,
  contentClassName,
  description,
  footer,
  headerContent,
  size = "md",
  title,
  trigger,
  ...props
}: DetailSheetProps) {
  return (
    <Sheet {...props}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent
        className={cn(
          "w-[calc(100%-1rem)] max-w-full gap-0",
          detailSheetSizes[size],
          contentClassName
        )}
        data-slot="detail-sheet"
      >
        <SheetHeader className="border-b px-6 py-5 pr-12">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <SheetTitle className="type-heading">{title}</SheetTitle>
              {description && (
                <SheetDescription className="mt-1.5 leading-relaxed">
                  {description}
                </SheetDescription>
              )}
            </div>
            {headerContent}
          </div>
        </SheetHeader>
        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto px-6 py-5",
            bodyClassName
          )}
          data-slot="detail-sheet-body"
        >
          {children}
        </div>
        {footer}
      </SheetContent>
    </Sheet>
  );
}
