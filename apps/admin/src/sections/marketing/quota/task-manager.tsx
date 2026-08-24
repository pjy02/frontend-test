import { DetailSheet } from "@workspace/ui/composed/detail-sheet";
import { ProTable } from "@workspace/ui/composed/pro-table/pro-table";
import { SettingsEntry } from "@workspace/ui/composed/settings-entry";
import {
  StatusBadge,
  type StatusTone,
} from "@workspace/ui/composed/status-badge";
import { queryQuotaTaskList } from "@workspace/ui/services/admin/marketing";
import { ListChecks } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Display } from "@/components/display";
import { useSubscribe } from "@/stores/subscribe";
import { formatDate } from "@/utils/common";

export default function QuotaTaskManager() {
  const { t } = useTranslation("marketing");
  const [open, setOpen] = useState(false);

  const { subscribes } = useSubscribe();
  const subscribeMap =
    subscribes?.reduce(
      (acc, subscribe) => {
        acc[subscribe.id!] = subscribe.name!;
        return acc;
      },
      {} as Record<number, string>
    ) || {};

  const getStatusBadge = (status: number) => {
    const statusConfig = {
      0: {
        label: t("notStarted", "Not Started"),
        tone: "neutral" as StatusTone,
      },
      1: { label: t("inProgress", "In Progress"), tone: "info" as StatusTone },
      2: { label: t("completed", "Completed"), tone: "success" as StatusTone },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: `${t("status", "Status")} ${status}`,
      tone: "neutral" as StatusTone,
    };

    return <StatusBadge tone={config.tone}>{config.label}</StatusBadge>;
  };

  return (
    <DetailSheet
      description={t(
        "quotaTasksDescription",
        "Inspect campaign scope, quota changes, progress, and creation time."
      )}
      onOpenChange={setOpen}
      open={open}
      size="lg"
      title={t("quotaTasks", "Quota Tasks")}
      trigger={
        <SettingsEntry
          description={t(
            "viewAndManageQuotaTasks",
            "View and manage quota tasks"
          )}
          icon={ListChecks}
          title={t("quotaTaskManager", "Quota Task Manager")}
        />
      }
    >
      <div className="space-y-4">
        {open && (
          <ProTable<API.QuotaTask, API.QueryQuotaTaskListParams>
            columns={[
              {
                accessorKey: "subscribers",
                header: t("subscribers", "Packages"),
                size: 200,
                cell: ({ row }) => {
                  const subscribers = row.getValue("subscribers") as number[];
                  const subscriptionNames =
                    subscribers
                      ?.map((id) => subscribeMap[id])
                      .filter(Boolean) || [];

                  if (subscriptionNames.length === 0) {
                    return (
                      <span className="text-muted-foreground text-sm">
                        {t("noSubscriptions", "No Subscriptions")}
                      </span>
                    );
                  }

                  return (
                    <div className="flex flex-wrap gap-1">
                      {subscriptionNames.map((name, index) => (
                        <span
                          className="rounded bg-muted px-2 py-1 text-xs"
                          key={index}
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  );
                },
              },
              {
                accessorKey: "is_active",
                header: t("validOnly", "Valid Only"),
                size: 120,
                cell: ({ row }) => {
                  const isActive = row.getValue("is_active") as boolean;
                  return (
                    <span className="text-sm">
                      {isActive ? t("yes", "Yes") : t("no", "No")}
                    </span>
                  );
                },
              },
              {
                accessorKey: "reset_traffic",
                header: t("resetTraffic", "Reset Traffic"),
                size: 120,
                cell: ({ row }) => {
                  const resetTraffic = row.getValue("reset_traffic") as boolean;
                  return (
                    <span className="text-sm">
                      {resetTraffic ? t("yes", "Yes") : t("no", "No")}
                    </span>
                  );
                },
              },
              {
                accessorKey: "gift_value",
                header: t("giftAmount", "Gift Amount"),
                size: 120,
                cell: ({ row }) => {
                  const giftValue = row.getValue("gift_value") as number;
                  const task = row.original as API.QuotaTask;
                  const giftType = task.gift_type;

                  return (
                    <div className="font-medium text-sm">
                      {giftType === 1 ? (
                        <Display type="currency" value={giftValue} />
                      ) : (
                        `${giftValue}%`
                      )}
                    </div>
                  );
                },
              },
              {
                accessorKey: "days",
                header: t("quotaDays", "Extend Expiration Days"),
                size: 100,
                cell: ({ row }) => {
                  const days = row.getValue("days") as number;
                  return (
                    <span className="font-medium">
                      {days} {t("days", "Days")}
                    </span>
                  );
                },
              },
              {
                accessorKey: "time_range",
                header: t("timeRange", "Time Range"),
                size: 180,
                cell: ({ row }) => {
                  const task = row.original as API.QuotaTask;
                  const startTime = task.start_time;
                  const endTime = task.end_time;

                  if (!(startTime || endTime)) {
                    return (
                      <span className="text-muted-foreground text-sm">
                        {t("noTimeLimit", "No Time Limit")}
                      </span>
                    );
                  }

                  return (
                    <div className="space-y-1 text-xs">
                      {startTime && (
                        <div>
                          {t("startTime", "Start Time")}:{" "}
                          {formatDate(startTime)}
                        </div>
                      )}
                      {endTime && (
                        <div>
                          {t("endTime", "End Time")}: {formatDate(endTime)}
                        </div>
                      )}
                    </div>
                  );
                },
              },
              {
                accessorKey: "status",
                header: t("status", "Status"),
                size: 100,
                cell: ({ row }) =>
                  getStatusBadge(row.getValue("status") as number),
              },
              {
                accessorKey: "created_at",
                header: t("createdAt", "Created At"),
                size: 150,
                cell: ({ row }) => {
                  const createdAt = row.getValue("created_at") as number;
                  return formatDate(createdAt);
                },
              },
            ]}
            params={[
              {
                key: "status",
                placeholder: t("status", "Status"),
                options: [
                  { label: t("notStarted", "Not Started"), value: "0" },
                  { label: t("inProgress", "In Progress"), value: "1" },
                  { label: t("completed", "Completed"), value: "2" },
                ],
              },
            ]}
            request={async (pagination, filters) => {
              const response = await queryQuotaTaskList({
                ...filters,
                page: pagination.page,
                size: pagination.size,
              });
              return {
                list: response.data?.data?.list || [],
                total: response.data?.data?.total || 0,
              };
            }}
          />
        )}
      </div>
    </DetailSheet>
  );
}
