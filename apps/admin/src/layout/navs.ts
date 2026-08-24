import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BadgeDollarSign,
  BellRing,
  ChartNoAxesCombined,
  CreditCard,
  FileText,
  Gift,
  Headphones,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  ListTree,
  LogIn,
  Mail,
  Megaphone,
  MessageSquareText,
  Network,
  Package,
  PanelTop,
  Plug,
  RadioTower,
  RefreshCcw,
  Server,
  Settings,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  TicketPercent,
  UserPlus,
  Users,
  WalletCards,
  Wrench,
} from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export interface NavItem {
  title: string;
  url?: string;
  icon: LucideIcon;
  items?: NavItem[];
  defaultOpen?: boolean;
}

export interface FlatNavItem extends NavItem {
  group?: string;
  url: string;
}

export function useNavs() {
  const { t } = useTranslation("menu");

  return useMemo<NavItem[]>(
    () => [
      {
        title: t("Dashboard", "Dashboard"),
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: t("Maintenance", "Maintenance"),
        icon: Wrench,
        defaultOpen: true,
        items: [
          {
            title: t("Server Management", "Server Management"),
            url: "/dashboard/servers",
            icon: Server,
          },
          {
            title: t("Node Management", "Node Management"),
            url: "/dashboard/nodes",
            icon: Network,
          },
          {
            title: t("Subscribe Config", "Subscribe Config"),
            url: "/dashboard/subscribe",
            icon: RadioTower,
          },
          {
            title: t("Product Management", "Product Management"),
            url: "/dashboard/product",
            icon: Package,
          },
        ],
      },
      {
        title: t("Commerce", "Commerce"),
        icon: ShoppingBag,
        defaultOpen: true,
        items: [
          {
            title: t("Order Management", "Order Management"),
            url: "/dashboard/order",
            icon: ShoppingCart,
          },
          {
            title: t("Coupon Management", "Coupon Management"),
            url: "/dashboard/coupon",
            icon: TicketPercent,
          },
          {
            title: t("Marketing Management", "Marketing Management"),
            url: "/dashboard/marketing",
            icon: Megaphone,
          },
          {
            title: t("Announcement Management", "Announcement Management"),
            url: "/dashboard/announcement",
            icon: BellRing,
          },
        ],
      },
      {
        title: t("Users & Support", "Users & Support"),
        icon: Headphones,
        items: [
          {
            title: t("User Management", "User Management"),
            url: "/dashboard/user",
            icon: Users,
          },
          {
            title: t("Ticket Management", "Ticket Management"),
            url: "/dashboard/ticket",
            icon: LifeBuoy,
          },
          {
            title: t("Document Management", "Document Management"),
            url: "/dashboard/document",
            icon: FileText,
          },
        ],
      },
      {
        title: t("System", "System"),
        icon: Settings,
        items: [
          {
            title: t("System Config", "System Config"),
            url: "/dashboard/system",
            icon: Settings,
          },
          {
            title: t("Auth Control", "Auth Control"),
            url: "/dashboard/auth-control",
            icon: ShieldCheck,
          },
          {
            title: t("Payment Config", "Payment Config"),
            url: "/dashboard/payment",
            icon: CreditCard,
          },
          {
            title: t("Plugin Management", "Plugin Management"),
            url: "/dashboard/plugin",
            icon: Plug,
          },
          {
            title: t("ADS Config", "ADS Config"),
            url: "/dashboard/ads",
            icon: PanelTop,
          },
        ],
      },
      {
        title: t("Logs & Analytics", "Logs & Analytics"),
        icon: ChartNoAxesCombined,
        items: [
          {
            title: t("Login", "Login"),
            url: "/dashboard/log/login",
            icon: LogIn,
          },
          {
            title: t("Register", "Register"),
            url: "/dashboard/log/register",
            icon: UserPlus,
          },
          {
            title: t("Email", "Email"),
            url: "/dashboard/log/email",
            icon: Mail,
          },
          {
            title: t("Mobile", "Mobile"),
            url: "/dashboard/log/mobile",
            icon: MessageSquareText,
          },
          {
            title: t("Subscribe", "Subscribe"),
            url: "/dashboard/log/subscribe",
            icon: KeyRound,
          },
          {
            title: t("Reset Subscribe", "Reset Subscribe"),
            url: "/dashboard/log/reset-subscribe",
            icon: RefreshCcw,
          },
          {
            title: t("Subscribe Traffic", "Subscribe Traffic"),
            url: "/dashboard/log/subscribe-traffic",
            icon: Activity,
          },
          {
            title: t("Server Traffic", "Server Traffic"),
            url: "/dashboard/log/server-traffic",
            icon: ChartNoAxesCombined,
          },
          {
            title: t("Traffic Details", "Traffic Details"),
            url: "/dashboard/log/traffic-details",
            icon: ListTree,
          },
          {
            title: t("Balance", "Balance"),
            url: "/dashboard/log/balance",
            icon: WalletCards,
          },
          {
            title: t("Commission", "Commission"),
            url: "/dashboard/log/commission",
            icon: BadgeDollarSign,
          },
          {
            title: t("Gift", "Gift"),
            url: "/dashboard/log/gift",
            icon: Gift,
          },
        ],
      },
    ],
    [t]
  );
}

export function normalizeRoutePath(path: string) {
  return path.endsWith("/") && path !== "/" ? path.replace(/\/+$/, "") : path;
}

export function isNavItemActive(pathname: string, url: string) {
  const path = normalizeRoutePath(pathname);
  const target = normalizeRoutePath(url);

  if (target === "/dashboard") return path === target;
  return path === target || path.startsWith(`${target}/`);
}

export function isNavGroupActive(pathname: string, item: NavItem): boolean {
  if (item.url && isNavItemActive(pathname, item.url)) return true;
  return (
    item.items?.some((child) => isNavGroupActive(pathname, child)) ?? false
  );
}

export function flattenNavs(navs: NavItem[]): FlatNavItem[] {
  return navs.flatMap((item) => {
    if (item.url) return [{ ...item, url: item.url }];
    return (item.items ?? [])
      .filter((child): child is NavItem & { url: string } => Boolean(child.url))
      .map((child) => ({ ...child, group: item.title, url: child.url }));
  });
}

export function findNavByUrl(navs: NavItem[], url: string): NavItem[] {
  for (const item of navs) {
    if (item.url && isNavItemActive(url, item.url)) return [item];
    if (item.items) {
      const child = item.items.find(
        (navItem) => navItem.url && isNavItemActive(url, navItem.url)
      );
      if (child) return [item, child];
    }
  }
  return [];
}
