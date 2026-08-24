import { Link } from "@tanstack/react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { FlaskConical, LogOut, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGlobalStore } from "@/stores/global";
import { Logout } from "@/utils/common";

export function UserNav() {
  const { t } = useTranslation("auth");
  const { user } = useGlobalStore();

  if (!user) return null;

  const identifier = user.auth_methods?.[0]?.auth_identifier || "Admin";
  const fallback = identifier.toUpperCase().charAt(0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={identifier}
          className="rounded-full p-0"
          size="icon-sm"
          variant="ghost"
        >
          <Avatar className="size-8 border bg-surface shadow-xs">
            <AvatarImage alt={identifier} src={user.avatar ?? ""} />
            <AvatarFallback className="bg-primary/10 font-semibold text-primary text-xs">
              {fallback}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3 py-1">
            <Avatar className="size-9 border">
              <AvatarImage alt={identifier} src={user.avatar ?? ""} />
              <AvatarFallback className="bg-primary/10 font-semibold text-primary text-xs">
                {fallback}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-sm">{identifier}</p>
              <p className="mt-0.5 flex items-center gap-1 text-muted-foreground text-xs">
                <ShieldCheck className="size-3" />
                Administrator
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/ui-lab">
            <FlaskConical />
            UI Lab
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={Logout} variant="destructive">
          <LogOut />
          {t("logout", "Logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
