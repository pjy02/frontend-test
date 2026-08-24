import { useNavigate } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@workspace/ui/components/command";
import { Kbd } from "@workspace/ui/components/kbd";
import { FlaskConical, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { flattenNavs, useNavs } from "./navs";

export function CommandMenu() {
  const { t } = useTranslation("components");
  const { t: tMenu } = useTranslation("menu");
  const navigate = useNavigate();
  const navs = useNavs();
  const items = useMemo(() => flattenNavs(navs), [navs]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const goTo = (to: string) => {
    setOpen(false);
    navigate({ to: to as "/dashboard" });
  };

  const groupedItems = useMemo(() => {
    const groups = new Map<string, (typeof items)[number][]>();
    for (const item of items) {
      const group = item.group || tMenu("Workspace", "Workspace");
      groups.set(group, [...(groups.get(group) || []), item]);
    }
    return groups;
  }, [items, tMenu]);

  return (
    <>
      <Button
        aria-label={t("command.open", "Search and open command menu")}
        className="h-[var(--control-height-sm)] w-8 justify-start gap-2 px-2 text-muted-foreground sm:w-48 lg:w-64"
        onClick={() => setOpen(true)}
        variant="outline"
      >
        <Search className="size-3.5" />
        <span className="hidden flex-1 text-left text-xs sm:inline">
          {t("command.search", "Search navigation...")}
        </span>
        <Kbd className="hidden lg:inline-flex">⌘ K</Kbd>
      </Button>

      <CommandDialog
        description={t(
          "command.description",
          "Search all admin pages and tools"
        )}
        onOpenChange={setOpen}
        open={open}
        title={t("command.title", "Command menu")}
      >
        <CommandInput
          autoFocus
          placeholder={t("command.placeholder", "Type a page or action...")}
        />
        <CommandList className="max-h-[min(28rem,60vh)]">
          <CommandEmpty>
            {t("command.empty", "No matching pages found.")}
          </CommandEmpty>
          {Array.from(groupedItems.entries()).map(
            ([group, groupItems], index) => (
              <div key={group}>
                {index > 0 && <CommandSeparator />}
                <CommandGroup heading={group}>
                  {groupItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <CommandItem
                        key={item.url}
                        onSelect={() => goTo(item.url)}
                        value={`${group} ${item.title}`}
                      >
                        <Icon />
                        <span>{item.title}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </div>
            )
          )}
          <CommandSeparator />
          <CommandGroup heading={t("command.tools", "Tools")}>
            <CommandItem
              onSelect={() => goTo("/ui-lab")}
              value="UI Lab design system"
            >
              <FlaskConical />
              <span>UI Lab</span>
              <CommandShortcut>Design System</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
        <div className="flex items-center justify-between border-t bg-surface px-3 py-2 text-muted-foreground text-xs">
          <span>{t("command.hint", "Use arrow keys to navigate")}</span>
          <span className="flex items-center gap-1">
            <Kbd>↵</Kbd>
            {t("command.openAction", "Open")}
          </span>
        </div>
      </CommandDialog>
    </>
  );
}
