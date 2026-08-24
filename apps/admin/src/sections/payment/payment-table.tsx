import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";
import { ConfirmButton } from "@workspace/ui/composed/confirm-button";
import { PageHeader } from "@workspace/ui/composed/page-header";
import {
  ProTable,
  type ProTableActions,
} from "@workspace/ui/composed/pro-table/pro-table";
import { StatusBadge } from "@workspace/ui/composed/status-badge";
import {
  createPaymentMethod,
  deletePaymentMethod,
  getPaymentMethodList,
  updatePaymentMethod,
} from "@workspace/ui/services/admin/payment";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Display } from "@/components/display";
import PaymentForm from "./payment-form";

export default function PaymentTable() {
  const { t } = useTranslation("payment");
  const [loading, setLoading] = useState(false);
  const ref = useRef<ProTableActions>(null);

  const createForm = (
    <PaymentForm<API.CreatePaymentMethodRequest>
      loading={loading}
      onSubmit={async (values) => {
        setLoading(true);
        try {
          await createPaymentMethod({
            ...values,
            enable: false,
          });
          toast.success(t("createSuccess", "Created successfully"));
          ref.current?.refresh();
          return true;
        } catch {
          return false;
        } finally {
          setLoading(false);
        }
      }}
      title={t("createPayment", "Add Payment Method")}
      trigger={<Button>{t("create", "Add Payment Method")}</Button>}
    />
  );

  return (
    <div className="grid gap-5">
      <PageHeader
        actions={createForm}
        description={t(
          "pageDescription",
          "Configure payment providers, callback endpoints, and customer fees."
        )}
        eyebrow={t("pageEyebrow", "Revenue infrastructure")}
        metadata={
          <StatusBadge tone="neutral">
            {t("disabledByDefault", "New methods start disabled")}
          </StatusBadge>
        }
        title={t("paymentManagement", "Payment Management")}
      />
      <ProTable<API.PaymentConfig, { search: string }>
        action={ref}
        actions={{
          render: (row) => [
            <PaymentForm<API.UpdatePaymentMethodRequest>
              initialValues={row}
              isEdit
              key="edit"
              loading={loading}
              onSubmit={async (values) => {
                setLoading(true);
                try {
                  await updatePaymentMethod({
                    ...row,
                    ...values,
                  });
                  toast.success(t("updateSuccess", "Updated successfully"));
                  ref.current?.refresh();
                  setLoading(false);
                  return true;
                } catch {
                  setLoading(false);
                  return false;
                }
              }}
              title={t("editPayment", "Edit Payment Method")}
              trigger={<Button>{t("edit", "Edit")}</Button>}
            />,
            <ConfirmButton
              cancelText={t("cancel", "Cancel")}
              confirmText={t("confirm", "Confirm")}
              description={t(
                "deleteWarning",
                "Are you sure you want to delete this payment method? This action cannot be undone."
              )}
              key="delete"
              onConfirm={async () => {
                await deletePaymentMethod({
                  id: row.id,
                });
                toast.success(t("deleteSuccess", "Deleted successfully"));
                ref.current?.refresh();
              }}
              title={t("confirmDelete", "Confirm Delete")}
              trigger={
                <Button variant="destructive">{t("delete", "Delete")}</Button>
              }
            />,
            <Button
              key="copy"
              onClick={async () => {
                setLoading(true);
                try {
                  const { id: _id, ...params } = row;
                  await createPaymentMethod({
                    ...params,
                    enable: false,
                  });
                  toast.success(t("copySuccess", "Copied successfully"));
                  ref.current?.refresh();
                  setLoading(false);
                  return true;
                } catch {
                  setLoading(false);
                  return false;
                }
              }}
              variant="outline"
            >
              {t("copy", "Copy")}
            </Button>,
          ],
          batchRender(rows) {
            return [
              <ConfirmButton
                cancelText={t("cancel", "Cancel")}
                confirmText={t("confirm", "Confirm")}
                description={t(
                  "deleteWarning",
                  "Are you sure you want to delete this payment method? This action cannot be undone."
                )}
                key="delete"
                onConfirm={async () => {
                  for (const row of rows) {
                    await deletePaymentMethod({ id: row.id });
                  }
                  toast.success(t("deleteSuccess", "Deleted successfully"));
                  ref.current?.refresh();
                }}
                title={t("confirmDelete", "Confirm Delete")}
                trigger={
                  <Button variant="destructive">
                    {t("batchDelete", "Batch Delete")}
                  </Button>
                }
              />,
            ];
          },
        }}
        columns={[
          {
            accessorKey: "enable",
            header: t("enable", "Enable"),
            cell: ({ row }) => (
              <Switch
                checked={Boolean(row.getValue("enable"))}
                onCheckedChange={async (checked) => {
                  await updatePaymentMethod({
                    ...row.original,
                    enable: checked,
                  });
                  ref.current?.refresh();
                }}
              />
            ),
          },
          {
            accessorKey: "icon",
            header: t("icon", "Icon"),
            cell: ({ row }) => {
              const icon = row.getValue("icon") as string;
              return (
                <Avatar className="h-8 w-8">
                  {icon ? (
                    <AvatarImage alt={row.getValue("name")} src={icon} />
                  ) : null}
                  <AvatarFallback>
                    {(row.getValue("name") as string)?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
              );
            },
          },
          {
            accessorKey: "name",
            header: t("name", "Name"),
          },
          {
            accessorKey: "platform",
            header: t("platform", "Platform"),
            cell: ({ row }) => <Badge>{t(row.original.platform)}</Badge>,
          },
          {
            accessorKey: "notify_url",
            header: t("notify_url", "Notify URL"),
          },
          {
            accessorKey: "fee",
            header: t("handlingFee", "Handling Fee"),
            cell: ({ row }) => {
              const feeMode = row.original.fee_mode;
              if (feeMode === 1) {
                return <Badge>{row.original.fee_percent}%</Badge>;
              }
              if (feeMode === 2) {
                return (
                  <Badge>
                    <Display type="currency" value={row.original.fee_amount} />
                  </Badge>
                );
              }
              return "--";
            },
          },
        ]}
        params={[
          {
            key: "search",
            placeholder: t("searchPlaceholder", "Enter search terms"),
          },
        ]}
        request={async (pagination, filter) => {
          const { data } = await getPaymentMethodList({
            ...pagination,
            ...filter,
          });
          return {
            list: data?.data?.list || [],
            total: data?.data?.total || 0,
          };
        }}
      />
    </div>
  );
}
