import { Link, useLocation } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { LayoutDashboard } from "lucide-react";
import { Fragment, useMemo } from "react";
import { findNavByUrl, useNavs } from "./navs";

export function AdminBreadcrumb() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const navs = useNavs();
  const items = useMemo(() => findNavByUrl(navs, pathname), [navs, pathname]);

  if (items.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem className="hidden sm:inline-flex">
          <BreadcrumbLink asChild>
            <Link aria-label="Dashboard" to="/dashboard">
              <LayoutDashboard className="size-3.5" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden sm:block" />
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <Fragment key={item.title}>
              <BreadcrumbItem
                className={current ? "min-w-0" : "hidden md:inline-flex"}
              >
                {current ? (
                  <BreadcrumbPage className="truncate font-medium">
                    {item.title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={(item.url || "/dashboard") as "/dashboard"}>
                      {item.title}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!current && <BreadcrumbSeparator className="hidden md:block" />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
