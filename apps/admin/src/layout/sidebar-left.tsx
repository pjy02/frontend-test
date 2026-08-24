import { Link, useLocation } from "@tanstack/react-router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import { ChevronRight, FlaskConical, PanelLeftClose } from "lucide-react";
import type * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGlobalStore } from "@/stores/global";
import {
  isNavGroupActive,
  isNavItemActive,
  type NavItem,
  useNavs,
} from "./navs";

function NavGroup({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isNavGroupActive(pathname, item);
  const { setOpen: setSidebarOpen, state } = useSidebar();
  const [open, setOpen] = useState(item.defaultOpen || active);

  useEffect(() => {
    if (active) setOpen(true);
  }, [active]);

  const Icon = item.icon;

  return (
    <Collapsible
      asChild
      className="group/collapsible"
      onOpenChange={setOpen}
      open={open}
    >
      <SidebarGroup className="py-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                aria-label={item.title}
                className="h-[var(--control-height)]"
                isActive={active}
                onClick={() => {
                  if (state === "collapsed") setSidebarOpen(true);
                }}
                tooltip={item.title}
              >
                <Icon />
                <span>{item.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-[var(--motion-duration-fast)] group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items?.map((child) => {
                  if (!child.url) return null;
                  const ChildIcon = child.icon;
                  return (
                    <SidebarMenuSubItem key={child.url}>
                      <SidebarMenuSubButton
                        asChild
                        className="h-[var(--control-height-sm)]"
                        isActive={isNavItemActive(pathname, child.url)}
                      >
                        <Link to={child.url as "/dashboard"}>
                          <ChildIcon />
                          <span>{child.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </Collapsible>
  );
}

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { common } = useGlobalStore();
  const { t } = useTranslation("menu");
  const navs = useNavs();
  const pathname = useLocation({ select: (location) => location.pathname });
  const { toggleSidebar } = useSidebar();
  const dashboard = navs.find((item) => item.url === "/dashboard");
  const groups = navs.filter((item) => item.items?.length);
  const DashboardIcon = dashboard?.icon;
  const siteName = common.site.site_name || "Perfect Panel";
  const siteDescription = common.site.site_desc || "Admin Console";

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader className="pt-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-12 data-[active=true]:bg-transparent"
              isActive
              size="lg"
              tooltip={siteName}
            >
              <Link to="/dashboard">
                <div className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-lg border border-primary/15 bg-primary/10 shadow-xs">
                  <img
                    alt=""
                    className="size-6 object-contain"
                    height={24}
                    src={common.site.site_logo || "/favicon.svg"}
                    width={24}
                  />
                </div>
                <div className="grid min-w-0 flex-1 text-left leading-tight">
                  <span className="truncate font-semibold">{siteName}</span>
                  <span className="truncate text-muted-foreground text-xs">
                    {siteDescription}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-1 pb-2">
        {dashboard?.url && DashboardIcon && (
          <SidebarGroup className="pb-1">
            <SidebarGroupLabel>{t("Workspace", "Workspace")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="h-[var(--control-height)]"
                    isActive={isNavItemActive(pathname, dashboard.url)}
                    tooltip={dashboard.title}
                  >
                    <Link to="/dashboard">
                      <DashboardIcon />
                      <span>{dashboard.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroupLabel className="px-4">
          {t("Management", "Management")}
        </SidebarGroupLabel>
        {groups.map((item) => (
          <NavGroup item={item} key={item.title} pathname={pathname} />
        ))}
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="UI Lab">
              <Link to="/ui-lab">
                <FlaskConical />
                <span>UI Lab</span>
                <span className="ml-auto rounded bg-primary/10 px-1.5 py-0.5 font-medium text-[10px] text-primary group-data-[collapsible=icon]:hidden">
                  v2
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleSidebar} tooltip="Toggle sidebar">
              <PanelLeftClose />
              <span>Collapse navigation</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
