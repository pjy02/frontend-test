"use client";

import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart";
// (Select imports removed)
import { Separator } from "@workspace/ui/components/separator";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { EmptyState } from "@workspace/ui/composed/async-state";
import {
  queryServerTotalData,
  queryTicketWaitReply,
} from "@workspace/ui/services/admin/console";
import { formatBytes } from "@workspace/ui/utils/formatting";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Cloud,
  Gauge,
  Server,
  TicketCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { UserDetail, UserSubscribeDetail } from "@/sections/user/user-detail";
import { RevenueStatisticsCard } from "./revenue-statistics-card";
import SystemVersionCard from "./system-version-card";
import { UserStatisticsCard } from "./user-statistics-card";

export default function Statistics() {
  const { t } = useTranslation("dashboard");

  const { data: TicketTotal } = useQuery({
    queryKey: ["queryTicketWaitReply"],
    queryFn: async () => {
      const { data } = await queryTicketWaitReply();
      return data.data?.count;
    },
  });
  const { data: ServerTotal } = useQuery({
    queryKey: ["queryServerTotalData"],
    queryFn: async () => {
      const { data } = await queryServerTotalData();
      return data.data;
    },
  });

  const [timeFrame, setTimeFrame] = useState<string | "today" | "yesterday">(
    "today"
  );

  const trafficData = {
    nodes: {
      today:
        ServerTotal?.server_traffic_ranking_today?.map((item) => ({
          name: item.name,
          traffic: item.download + item.upload,
        })) || [],
      yesterday:
        ServerTotal?.server_traffic_ranking_yesterday?.map((item) => ({
          name: item.name,
          traffic: item.download + item.upload,
        })) || [],
    },
    users: {
      today:
        ServerTotal?.user_traffic_ranking_today?.map((item) => ({
          name: item.sid,
          uid: item.uid,
          traffic: item.download + item.upload,
        })) || [],
      yesterday:
        ServerTotal?.user_traffic_ranking_yesterday?.map((item) => ({
          name: item.sid,
          uid: item.uid,
          traffic: item.download + item.upload,
        })) || [],
    },
  };

  const TrafficRankCard = ({ type }: { type: "nodes" | "users" }) => {
    const currentData = trafficData[type][timeFrame as "today" | "yesterday"];

    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {type === "nodes"
              ? t("nodeTraffic", "Node Traffic")
              : t("userTraffic", "User Traffic")}
          </CardTitle>
          <CardDescription>
            {t(
              "trafficRankDescription",
              "Highest combined upload and download"
            )}
          </CardDescription>
          <CardAction>
            <Tabs onValueChange={setTimeFrame} value={timeFrame}>
              <TabsList>
                <TabsTrigger value="today">{t("today", "Today")}</TabsTrigger>
                <TabsTrigger value="yesterday">
                  {t("yesterday", "Yesterday")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardAction>
        </CardHeader>
        <CardContent className="h-80">
          {currentData.length > 0 ? (
            <ChartContainer
              className="max-h-80"
              config={{
                traffic: {
                  label: t("traffic", "Traffic"),
                  color: "var(--primary)",
                },
                type: {
                  label: t("type", "Type"),
                  color: "var(--muted-foreground)",
                },
                label: {
                  color: "var(--foreground)",
                },
              }}
            >
              <BarChart data={currentData} height={400} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  axisLine={false}
                  tickFormatter={(value) => formatBytes(value || 0)}
                  tickLine={false}
                  type="number"
                />
                <YAxis
                  axisLine={false}
                  dataKey="name"
                  interval={0}
                  tickFormatter={(_value, index) => String(index + 1)}
                  tickLine={false}
                  tickMargin={0}
                  type="category"
                  width={15}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatBytes(Number(value) || 0)}
                      label={true}
                      labelFormatter={(label, [payload]) =>
                        type === "nodes" ? (
                          `${t("nodes", "Nodes")}: ${label}`
                        ) : (
                          <>
                            {payload?.payload.uid ? (
                              <>
                                <div className="w-80">
                                  <UserDetail id={payload.payload.uid} />
                                </div>
                                <Separator className="my-2" />
                              </>
                            ) : null}
                            <div className="w-80">
                              <UserSubscribeDetail
                                enabled={true}
                                id={payload?.payload.name}
                              />
                            </div>
                            <Separator className="my-2" />
                            <div>{`${t("users", "Users")}: ${label}`}</div>
                          </>
                        )
                      }
                    />
                  }
                  trigger="hover"
                />
                <Bar
                  dataKey="traffic"
                  fill="var(--color-traffic)"
                  isAnimationActive={false}
                  radius={[0, 4, 4, 0]}
                >
                  <LabelList
                    className="fill-foreground"
                    dataKey="name"
                    fontSize={12}
                    offset={8}
                    position="insideLeft"
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          ) : (
            <EmptyState
              compact
              description={t(
                "trafficEmptyDescription",
                "Traffic rankings will appear after data is reported."
              )}
              title={t("trafficEmpty", "No traffic data")}
            />
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          {
            title: t("onlineUsersCount", "Online Users"),
            value: ServerTotal?.online_users || 0,
            subtitle: t("currentlyOnline", "Currently Online"),
            icon: Users,
            href: "/dashboard/servers",
            iconClassName: "bg-primary/10 text-primary",
          },

          {
            title: t("todayTraffic", "Today Traffic"),
            value: formatBytes(
              (ServerTotal?.today_upload || 0) +
                (ServerTotal?.today_download || 0)
            ),
            subtitle: `↑${formatBytes(ServerTotal?.today_upload || 0)} ↓${formatBytes(ServerTotal?.today_download || 0)}`,
            icon: Gauge,
            iconClassName: "bg-info/10 text-info",
          },
          {
            title: t("monthTraffic", "Month Traffic"),
            value: formatBytes(
              (ServerTotal?.monthly_upload || 0) +
                (ServerTotal?.monthly_download || 0)
            ),
            subtitle: `↑${formatBytes(ServerTotal?.monthly_upload || 0)} ↓${formatBytes(ServerTotal?.monthly_download || 0)}`,
            icon: Cloud,
            iconClassName: "bg-warning/12 text-warning",
          },
          {
            title: t("totalServers", "Total Servers"),
            value:
              (ServerTotal?.online_servers || 0) +
              (ServerTotal?.offline_servers || 0),
            subtitle: `${t("online", "Online")} ${ServerTotal?.online_servers || 0} ${t("offline", "Offline")} ${ServerTotal?.offline_servers || 0}`,
            icon: Server,
            href: "/dashboard/servers",
            iconClassName: "bg-success/10 text-success",
          },
          {
            title: t("pendingTickets", "Pending Tickets"),
            value: TicketTotal || 0,
            subtitle: t("pending", "Pending"),
            icon: TicketCheck,
            href: "/dashboard/ticket",
            iconClassName: "bg-destructive/10 text-destructive",
          },
        ].map((item, index) => (
          <Link
            className={item.href ? "" : "pointer-events-none"}
            key={index}
            to={item.href || "#"}
          >
            <Card
              className={`group h-full transition-[border-color,box-shadow,transform] duration-[var(--motion-duration-normal)] ${item.href ? "hover:-translate-y-0.5 cursor-pointer hover:border-primary/25 hover:shadow-[var(--shadow-md)]" : ""}`}
            >
              <CardContent className="flex h-full items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-muted-foreground text-sm">
                    {item.title}
                  </p>
                  <div className="mt-2 font-semibold text-2xl tabular-nums tracking-tight">
                    {item.value}
                  </div>
                  <div className="mt-1 flex min-h-4 items-center gap-1 text-muted-foreground text-xs">
                    {index === 1 && <ArrowUp className="size-3 text-success" />}
                    {index === 1 && <ArrowDown className="size-3 text-info" />}
                    {item.subtitle}
                  </div>
                </div>
                <div
                  className={`grid size-10 shrink-0 place-items-center rounded-xl ${item.iconClassName}`}
                >
                  <item.icon className="size-5" />
                </div>
                {item.href && (
                  <ArrowRight className="absolute right-5 bottom-5 size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
        <SystemVersionCard />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <RevenueStatisticsCard />
        <UserStatisticsCard />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <TrafficRankCard type="nodes" />
        <TrafficRankCard type="users" />
      </div>
    </>
  );
}
