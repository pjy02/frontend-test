import { Separator } from "@workspace/ui/components/separator";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { LanguageSwitch } from "@workspace/ui/composed/language-switch";
import { ThemeSwitch } from "@workspace/ui/composed/theme-switch";
import { AdminBreadcrumb } from "./admin-breadcrumb";
import { CommandMenu } from "./command-menu";
import TimezoneSwitch from "./timezone-switch";
import { UserNav } from "./user-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b bg-background/88 px-3 backdrop-blur-xl supports-[backdrop-filter]:bg-background/72 sm:px-4">
      <SidebarTrigger className="shrink-0" />
      <Separator className="h-4" orientation="vertical" />
      <div className="min-w-0 flex-1">
        <AdminBreadcrumb />
      </div>
      <CommandMenu />
      <Separator className="hidden h-4 sm:block" orientation="vertical" />
      <div className="hidden items-center sm:flex">
        <LanguageSwitch />
        <div className="hidden lg:block">
          <TimezoneSwitch />
        </div>
      </div>
      <ThemeSwitch />
      <UserNav />
    </header>
  );
}
