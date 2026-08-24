import { useQuery } from "@tanstack/react-query";
import { Link, useSearch } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Switch } from "@workspace/ui/components/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { ErrorState, LoadingState } from "@workspace/ui/composed/async-state";
import { ConfirmButton } from "@workspace/ui/composed/confirm-button";
import { DetailSheet } from "@workspace/ui/composed/detail-sheet";
import { PageHeader } from "@workspace/ui/composed/page-header";
import {
  ProTable,
  type ProTableActions,
} from "@workspace/ui/composed/pro-table/pro-table";
import { StatusBadge } from "@workspace/ui/composed/status-badge";
import {
  createUser,
  deleteUser,
  getUserDetail,
  getUserList,
  updateUserBasicInfo,
} from "@workspace/ui/services/admin/user";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Display } from "@/components/display";
import { useSubscribe } from "@/stores/subscribe";
import { formatDate } from "@/utils/common";
import { UserDetail } from "./user-detail";
import UserForm from "./user-form";
import { AuthMethodsForm } from "./user-profile/auth-methods-form";
import { BasicInfoForm } from "./user-profile/basic-info-form";
import { NotifySettingsForm } from "./user-profile/notify-settings-form";
import UserSubscription from "./user-subscription";

export default function User() {
  const { t } = useTranslation("user");
  const [loading, setLoading] = useState(false);
  const ref = useRef<ProTableActions>(null);
  const sp = useSearch({ strict: false }) as Record<string, string | undefined>;

  const { subscribes } = useSubscribe();

  const initialFilters = {
    search: sp.search || undefined,
    user_id: sp.user_id || undefined,
    subscribe_id: sp.subscribe_id || undefined,
    user_subscribe_id: sp.user_subscribe_id || undefined,
    user_subscribe_token: sp.user_subscribe_token || undefined,
  };

  const createForm = (
    <UserForm<API.CreateUserRequest>
      key="create"
      loading={loading}
      onSubmit={async (values) => {
        setLoading(true);
        try {
          await createUser(values);
          toast.success(t("createSuccess", "Created successfully"));
          ref.current?.refresh();
          return true;
        } catch {
          return false;
        } finally {
          setLoading(false);
        }
      }}
      title={t("createUser", "Create User")}
      trigger={t("create", "Create")}
    />
  );

  return (
    <div className="grid gap-5">
      <PageHeader
        actions={createForm}
        description={t(
          "pageDescription",
          "Search accounts, inspect subscriptions, and manage access from one workspace."
        )}
        eyebrow={t("pageEyebrow", "Customer operations")}
        metadata={
          <StatusBadge tone="info">
            {t("liveAccountData", "Live account data")}
          </StatusBadge>
        }
        title={t("userList", "User List")}
      />
      <ProTable<API.User, API.GetUserListParams>
        action={ref}
        actions={{
          render: (row) => [
            <ProfileSheet
              key="profile"
              onUpdated={() => ref.current?.refresh()}
              userId={row.id}
            />,
            <SubscriptionSheet key="subscription" userId={row.id} />,
            <ConfirmButton
              cancelText={t("cancel", "Cancel")}
              confirmText={t("confirm", "Confirm")}
              description={t(
                "deleteDescription",
                "This action cannot be undone."
              )}
              key="edit"
              onConfirm={async () => {
                await deleteUser({ id: row.id });
                toast.success(t("deleteSuccess", "Deleted successfully"));
                ref.current?.refresh();
              }}
              title={t("confirmDelete", "Confirm Delete")}
              trigger={
                <Button variant="destructive">{t("delete", "Delete")}</Button>
              }
            />,
            <DropdownMenu key="more" modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{t("more", "More")}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    search={{ user_id: String(row.id) }}
                    to="/dashboard/order"
                  >
                    {t("orderList", "Order List")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    search={{ user_id: String(row.id) }}
                    to="/dashboard/log/login"
                  >
                    {t("loginLogs", "Login Logs")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    search={{ user_id: String(row.id) }}
                    to="/dashboard/log/balance"
                  >
                    {t("balanceLogs", "Balance Logs")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    search={{ user_id: String(row.id) }}
                    to="/dashboard/log/commission"
                  >
                    {t("commissionLogs", "Commission Logs")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    search={{ user_id: String(row.id) }}
                    to="/dashboard/log/gift"
                  >
                    {t("giftLogs", "Gift Logs")}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>,
          ],
        }}
        columns={[
          {
            accessorKey: "enable",
            header: t("enable", "Enable"),
            cell: ({ row }) => (
              <Switch
                defaultChecked={row.getValue("enable")}
                onCheckedChange={async (checked) => {
                  const {
                    auth_methods: _auth_methods,
                    user_devices: _user_devices,
                    enable_balance_notify: _enable_balance_notify,
                    enable_login_notify: _enable_login_notify,
                    enable_subscribe_notify: _enable_subscribe_notify,
                    enable_trade_notify: _enable_trade_notify,
                    updated_at: _updated_at,
                    created_at: _created_at,
                    id,
                    ...rest
                  } = row.original;
                  await updateUserBasicInfo({
                    user_id: id,
                    ...rest,
                    enable: checked,
                  } as unknown as API.UpdateUserBasiceInfoRequest);
                  toast.success(t("updateSuccess", "Updated successfully"));
                  ref.current?.refresh();
                }}
              />
            ),
          },
          {
            accessorKey: "id",
            header: "ID",
          },
          {
            accessorKey: "deleted_at",
            header: t("isDeleted", "Deleted"),
            cell: ({ row }) => {
              const deletedAt = row.getValue("deleted_at") as
                | number
                | undefined;
              return deletedAt ? (
                <StatusBadge tone="destructive">
                  {t("deleted", "Deleted")}
                </StatusBadge>
              ) : (
                <StatusBadge tone="success">
                  {t("normal", "Normal")}
                </StatusBadge>
              );
            },
          },
          {
            accessorKey: "auth_methods",
            header: t("userName", "Username"),
            cell: ({ row }) => {
              const method = row.original.auth_methods?.[0];
              return (
                <div>
                  <StatusBadge
                    className="mr-1 uppercase"
                    dot={false}
                    title={method?.verified ? t("verified", "Verified") : ""}
                    tone={method?.verified ? "success" : "neutral"}
                  >
                    {method?.auth_type}
                  </StatusBadge>
                  {method?.auth_identifier}
                </div>
              );
            },
          },
          {
            accessorKey: "balance",
            header: t("balance", "Balance"),
            cell: ({ row }) => (
              <Display type="currency" value={row.getValue("balance")} />
            ),
          },
          {
            accessorKey: "gift_amount",
            header: t("giftAmount", "Gift Amount"),
            cell: ({ row }) => (
              <Display type="currency" value={row.getValue("gift_amount")} />
            ),
          },
          {
            accessorKey: "commission",
            header: t("commission", "Commission"),
            cell: ({ row }) => (
              <Display type="currency" value={row.getValue("commission")} />
            ),
          },
          {
            accessorKey: "refer_code",
            header: t("inviteCode", "Invite Code"),
            cell: ({ row }) => row.getValue("refer_code") || "--",
          },
          {
            accessorKey: "referer_id",
            header: t("referer", "Referer"),
            cell: ({ row }) => <UserDetail id={row.original.referer_id} />,
          },
          {
            accessorKey: "created_at",
            header: t("createdAt", "Created At"),
            cell: ({ row }) => formatDate(row.getValue("created_at")),
          },
        ]}
        initialFilters={initialFilters}
        key={JSON.stringify(initialFilters)}
        params={[
          {
            className: "sm:w-44",
            key: "subscribe_id",
            placeholder: t("subscription", "Subscription"),
            options: subscribes?.map((item) => ({
              label: item.name!,
              value: String(item.id!),
            })),
          },
          {
            className: "sm:w-56",
            key: "search",
            placeholder: "Search",
          },
          {
            className: "sm:w-36",
            key: "user_id",
            placeholder: t("userId", "User ID"),
          },
          {
            className: "sm:w-44",
            key: "user_subscribe_id",
            placeholder: t("subscriptionId", "Subscription ID"),
          },
          {
            className: "sm:min-w-72 sm:flex-1",
            key: "user_subscribe_token",
            placeholder: t(
              "subscriptionTokenOrUrl",
              "Subscription URL / Token / UUID"
            ),
          },
        ]}
        request={async (pagination, filter) => {
          const { data } = await getUserList({
            ...pagination,
            ...filter,
            user_subscribe_token: extractSubscribeTokenOrUuid(
              filter.user_subscribe_token
            ),
          });
          return {
            list: data.data?.list || [],
            total: data.data?.total || 0,
          };
        }}
      />
    </div>
  );
}

function extractSubscribeTokenOrUuid(value: unknown) {
  if (typeof value !== "string") {
    return;
  }
  const input = value.trim();
  if (!input) {
    return;
  }
  const queryIndex = input.indexOf("?");
  const search =
    queryIndex !== -1
      ? input.slice(queryIndex + 1).split("#", 1)[0]
      : input.startsWith("token=") || input.startsWith("uuid=")
        ? input
        : "";
  if (search) {
    const params = new URLSearchParams(search);
    const tokenOrUuid = params.get("token") ?? params.get("uuid");
    if (tokenOrUuid !== null) {
      const trimmedTokenOrUuid = tokenOrUuid.trim();
      return trimmedTokenOrUuid || undefined;
    }
  }
  return input;
}

function ProfileSheet({
  userId,
  onUpdated,
}: {
  userId: number;
  onUpdated?: () => void;
}) {
  const { t } = useTranslation("user");
  const [open, setOpen] = useState(false);
  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useQuery({
    enabled: open,
    queryKey: ["user", userId],
    queryFn: async () => {
      const { data } = await getUserDetail({ id: userId });
      return data.data as API.User;
    },
  });

  const refetchAll = async () => {
    await refetch();
    onUpdated?.();
    return Promise.resolve();
  };
  return (
    <DetailSheet
      description={t(
        "profileDescription",
        "Review account identity, financial settings, notifications, and authentication methods."
      )}
      headerContent={
        user && (
          <StatusBadge tone={user.enable ? "success" : "warning"}>
            {user.enable ? t("normal", "Active") : t("offline", "Disabled")}
          </StatusBadge>
        )
      }
      onOpenChange={setOpen}
      open={open}
      size="lg"
      title={`${t("userProfile", "User Profile")} · ID ${userId}`}
      trigger={<Button variant="default">{t("edit", "Edit")}</Button>}
    >
      {isLoading && <LoadingState compact label={t("loading", "Loading...")} />}
      {error && (
        <ErrorState
          compact
          description={error.message}
          onRetry={() => refetch()}
        />
      )}
      {user && (
        <Tabs defaultValue="basic">
          <TabsList className="mb-4 w-full justify-start overflow-x-auto">
            <TabsTrigger value="basic">
              {t("basicInfoTitle", "Basic Info")}
            </TabsTrigger>
            <TabsTrigger value="notify">
              {t("notifySettingsTitle", "Notify Settings")}
            </TabsTrigger>
            <TabsTrigger value="auth">
              {t("authMethodsTitle", "Auth Methods")}
            </TabsTrigger>
          </TabsList>
          <TabsContent className="mt-0" value="basic">
            <BasicInfoForm refetch={refetchAll} user={user} />
          </TabsContent>
          <TabsContent className="mt-0" value="notify">
            <NotifySettingsForm refetch={refetchAll} user={user} />
          </TabsContent>
          <TabsContent className="mt-0" value="auth">
            <AuthMethodsForm refetch={refetchAll} user={user} />
          </TabsContent>
        </Tabs>
      )}
    </DetailSheet>
  );
}

function SubscriptionSheet({ userId }: { userId: number }) {
  const { t } = useTranslation("user");
  const [open, setOpen] = useState(false);
  return (
    <DetailSheet
      bodyClassName="px-4"
      description={t(
        "subscriptionDescription",
        "Inspect plans, traffic allocation, expiry, and subscription controls."
      )}
      onOpenChange={setOpen}
      open={open}
      size="lg"
      title={`${t("subscriptionList", "Subscription List")} · ID ${userId}`}
      trigger={
        <Button variant="secondary">{t("subscription", "Subscription")}</Button>
      }
    >
      <UserSubscription userId={userId} />
    </DetailSheet>
  );
}
