import { createLazyFileRoute } from "@tanstack/react-router";
import { ADMIN_UI_V2 } from "@/config/features";
import DashboardLayout from "@/layout";
import AdminShellV2 from "@/layout/admin-shell-v2";

export const Route = createLazyFileRoute("/dashboard")({
  component: ADMIN_UI_V2 ? AdminShellV2 : DashboardLayout,
});
