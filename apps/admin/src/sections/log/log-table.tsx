"use client";

import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { DetailSheet } from "@workspace/ui/composed/detail-sheet";
import { PageHeader } from "@workspace/ui/composed/page-header";
import {
  ProTable,
  type ProTableActions,
  type ProTableProps,
} from "@workspace/ui/composed/pro-table/pro-table";
import { StatusBadge } from "@workspace/ui/composed/status-badge";
import { Clock3, Eye, RefreshCcw, TimerReset } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const refreshOptions = [0, 15, 30, 60] as const;

type LogRecord = Record<string, unknown> & { id?: string | number };

interface LogTableProps<
  TData extends LogRecord,
  TValue extends Record<string, unknown>,
> extends Omit<ProTableProps<TData, TValue>, "action" | "header"> {
  title: string;
  description?: string;
  eyebrow?: string;
}

export function LogTable<
  TData extends LogRecord,
  TValue extends Record<string, unknown>,
>({
  actions,
  description,
  eyebrow,
  request,
  title,
  ...props
}: LogTableProps<TData, TValue>) {
  const { t, i18n } = useTranslation("log");
  const tableAction = useRef<ProTableActions | undefined>(undefined);
  const [selectedRecord, setSelectedRecord] = useState<TData>();
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date>();
  const [refreshSeconds, setRefreshSeconds] = useState<number>(() => {
    const saved = window.localStorage.getItem("admin-log-refresh-seconds");
    if (saved === null) return 30;
    const value = Number(saved);
    return refreshOptions.includes(value as (typeof refreshOptions)[number])
      ? value
      : 30;
  });

  useEffect(() => {
    window.localStorage.setItem(
      "admin-log-refresh-seconds",
      String(refreshSeconds)
    );
    if (!refreshSeconds) return;

    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        tableAction.current?.refresh();
      }
    }, refreshSeconds * 1000);

    return () => window.clearInterval(timer);
  }, [refreshSeconds]);

  const detailTitle = selectedRecord?.id
    ? `${t("recordDetail", "Record detail")} #${selectedRecord.id}`
    : t("recordDetail", "Record detail");

  return (
    <div className="flex flex-1 flex-col gap-5">
      <PageHeader
        actions={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <TimerReset />
                  {refreshSeconds
                    ? t("refreshEvery", {
                        defaultValue: "Every {{seconds}}s",
                        seconds: refreshSeconds,
                      })
                    : t("refreshOff", "Auto refresh off")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>
                  {t("autoRefresh", "Auto refresh")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  onValueChange={(value) => setRefreshSeconds(Number(value))}
                  value={String(refreshSeconds)}
                >
                  {refreshOptions.map((seconds) => (
                    <DropdownMenuRadioItem
                      key={seconds}
                      value={String(seconds)}
                    >
                      {seconds
                        ? t("refreshEvery", {
                            defaultValue: "Every {{seconds}}s",
                            seconds,
                          })
                        : t("refreshOff", "Auto refresh off")}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={() => tableAction.current?.refresh()}
              variant="default"
            >
              <RefreshCcw />
              {t("refreshNow", "Refresh now")}
            </Button>
          </>
        }
        description={
          description ??
          t(
            "pageDescription",
            "Filter, inspect, and monitor operational events from one consistent workspace."
          )
        }
        eyebrow={eyebrow ?? t("pageEyebrow", "Observability")}
        metadata={
          <>
            <StatusBadge
              pulse={refreshSeconds > 0}
              tone={refreshSeconds > 0 ? "success" : "neutral"}
            >
              {refreshSeconds
                ? t("liveMonitoring", "Live monitoring")
                : t("paused", "Paused")}
            </StatusBadge>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-3.5" />
              {lastUpdatedAt
                ? t("lastUpdated", {
                    defaultValue: "Updated {{time}}",
                    time: new Intl.DateTimeFormat(i18n.language, {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    }).format(lastUpdatedAt),
                  })
                : t("waitingForData", "Waiting for data")}
            </span>
          </>
        }
        title={title}
      />

      <ProTable<TData, TValue>
        {...props}
        action={tableAction}
        actions={{
          ...actions,
          render: (row) => [
            <Button
              aria-label={t("viewDetail", "View detail")}
              key="observability-detail"
              onClick={() => setSelectedRecord(row)}
              size="icon"
              variant="ghost"
            >
              <Eye />
            </Button>,
            ...(actions?.render?.(row) ?? []),
          ],
        }}
        header={{}}
        request={async (pagination, filter) => {
          const result = await request(pagination, filter);
          setLastUpdatedAt(new Date());
          return result;
        }}
      />

      <DetailSheet
        description={t(
          "recordDetailDescription",
          "Complete values returned by the current log event."
        )}
        onOpenChange={(open) => {
          if (!open) setSelectedRecord(undefined);
        }}
        open={Boolean(selectedRecord)}
        size="lg"
        title={detailTitle}
      >
        {selectedRecord && (
          <dl className="grid gap-3 sm:grid-cols-2">
            {Object.entries(selectedRecord).map(([key, value]) => (
              <div className="rounded-xl border bg-muted/25 p-4" key={key}>
                <dt className="type-label text-muted-foreground uppercase">
                  {key.replaceAll("_", " ")}
                </dt>
                <dd className="mt-2 break-words font-mono text-sm leading-relaxed">
                  {formatDetailValue(value)}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </DetailSheet>
    </div>
  );
}

function formatDetailValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}
