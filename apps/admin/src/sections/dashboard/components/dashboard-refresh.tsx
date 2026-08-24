"use client";

import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { RefreshCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

export const DASHBOARD_REFRESH_INTERVAL = 30_000;

const dashboardQueryKeys = [
  "queryTicketWaitReply",
  "queryServerTotalData",
  "queryRevenueStatistics",
  "queryUserStatistics",
] as const;

export function DashboardRefresh() {
  const { t } = useTranslation("dashboard");
  const queryClient = useQueryClient();
  const isRefreshing = useIsFetching({
    predicate: (query) =>
      dashboardQueryKeys.includes(
        String(query.queryKey[0]) as (typeof dashboardQueryKeys)[number]
      ),
  });

  return (
    <Button
      disabled={isRefreshing > 0}
      onClick={() =>
        Promise.all(
          dashboardQueryKeys.map((queryKey) =>
            queryClient.invalidateQueries({ queryKey: [queryKey] })
          )
        )
      }
      variant="outline"
    >
      <RefreshCcw className={cn(isRefreshing > 0 && "animate-spin")} />
      {isRefreshing > 0
        ? t("syncing", "Syncing")
        : t("refreshDashboard", "Refresh data")}
    </Button>
  );
}
