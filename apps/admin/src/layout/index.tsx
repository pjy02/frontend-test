import { Outlet } from "@tanstack/react-router";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import { getCookie } from "@workspace/ui/lib/cookies";
import { useState } from "react";
import { Header } from "@/layout/header";
import { SidebarLeft } from "./sidebar-left";

export function AdminShell() {
  const [defaultOpen] = useState(() => getCookie("sidebar_state") !== "false");

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <SidebarLeft />
      <SidebarInset className="min-w-0 overflow-hidden border border-border/70">
        <Header />
        <div className="min-h-0 flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-[112rem] p-[var(--page-gutter)]">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AdminShell;
