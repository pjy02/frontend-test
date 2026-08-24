import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { ConfirmButton } from "@workspace/ui/composed/confirm-button";
import { DetailSheet } from "@workspace/ui/composed/detail-sheet";
import { PageHeader } from "@workspace/ui/composed/page-header";
import {
  ProTable,
  type ProTableActions,
} from "@workspace/ui/composed/pro-table/pro-table";
import {
  StatusBadge,
  type StatusTone,
} from "@workspace/ui/composed/status-badge";
import { cn } from "@workspace/ui/lib/utils";
import {
  createTicketFollow,
  getTicket,
  getTicketList,
  updateTicketStatus,
} from "@workspace/ui/services/admin/ticket";
import { ImagePlus, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { formatDate } from "@/utils/common";
import { UserDetail } from "../user/user-detail";

const ticketTones: Record<number, StatusTone> = {
  1: "destructive",
  2: "warning",
  3: "success",
  4: "neutral",
};

export default function Page() {
  const { t } = useTranslation("ticket");
  const [ticketId, setTicketId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const conversationRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<ProTableActions>(null);

  const { data: ticket, refetch: refetchTicket } = useQuery({
    queryKey: ["getTicket", ticketId],
    queryFn: async () => {
      const { data } = await getTicket({ id: ticketId! });
      return data.data as API.Ticket;
    },
    enabled: ticketId !== null,
    refetchInterval: ticketId === null ? false : 5000,
  });

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const scrollContainer = conversationRef.current?.parentElement;
      scrollContainer?.scrollTo({
        behavior: "smooth",
        top: scrollContainer.scrollHeight,
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [ticket?.follow?.length]);

  return (
    <div className="grid gap-5">
      <PageHeader
        description={t(
          "pageDescription",
          "Triage customer requests, continue conversations, and close resolved cases."
        )}
        eyebrow={t("pageEyebrow", "Customer support")}
        metadata={
          <StatusBadge pulse tone="destructive">
            {t("priorityQueue", "Pending follow-up first")}
          </StatusBadge>
        }
        title={t("ticketList", "Ticket List")}
      />

      <ProTable<API.Ticket, { status: number }>
        action={tableRef}
        actions={{
          render(row) {
            if (row.status !== 4) {
              return [
                <Button key="reply" onClick={() => setTicketId(row.id)}>
                  {t("reply", "Reply")}
                </Button>,
                <ConfirmButton
                  cancelText={t("cancel", "Cancel")}
                  confirmText={t("confirm", "Confirm")}
                  description={t(
                    "closeWarning",
                    "Once closed, the ticket cannot be operated on. Please proceed with caution."
                  )}
                  key="close"
                  onConfirm={async () => {
                    await updateTicketStatus({ id: row.id, status: 4 });
                    toast.success(t("closeSuccess", "Closed successfully"));
                    tableRef.current?.refresh();
                  }}
                  title={t("confirmClose", "Are you sure you want to close?")}
                  trigger={
                    <Button variant="destructive">{t("close", "Close")}</Button>
                  }
                />,
              ];
            }
            return [
              <Button
                key="check"
                onClick={() => setTicketId(row.id)}
                size="sm"
                variant="outline"
              >
                {t("check", "Check")}
              </Button>,
            ];
          },
        }}
        columns={[
          {
            accessorKey: "title",
            header: t("title", "Title"),
          },
          {
            accessorKey: "user_id",
            header: t("user", "User"),
            cell: ({ row }) => <UserDetail id={row.original.user_id} />,
          },
          {
            accessorKey: "status",
            header: t("status.0", "Status"),
            cell: ({ row }) => (
              <StatusBadge
                pulse={row.original.status === 1}
                tone={ticketTones[row.original.status] || "neutral"}
              >
                {t(`status.${row.original.status}`)}
              </StatusBadge>
            ),
          },
          {
            accessorKey: "updated_at",
            header: t("updatedAt", "Updated At"),
            cell: ({ row }) => formatDate(row.getValue("updated_at")),
          },
        ]}
        params={[
          {
            key: "status",
            placeholder: t("status.0", "Status"),
            options: [1, 2, 3, 4].map((status) => ({
              label: t(`status.${status}`),
              value: String(status),
            })),
          },
        ]}
        request={async (pagination, filters) => {
          const { data } = await getTicketList({
            ...pagination,
            ...filters,
          });
          const list = [...((data.data?.list || []) as API.Ticket[])];
          list.sort((a, b) => {
            const priority = (status: number) =>
              status === 1 ? 0 : status === 2 ? 1 : 2;
            const difference = priority(a.status) - priority(b.status);
            if (difference !== 0) return difference;
            return toTime(b.updated_at) - toTime(a.updated_at);
          });
          return { list, total: data.data?.total || 0 };
        }}
      />

      <DetailSheet
        bodyClassName="bg-surface-muted/40 p-0"
        description={t(
          "conversationDescription",
          "Messages refresh automatically while this conversation is open."
        )}
        footer={
          ticket?.status !== 4 ? (
            <TicketComposer
              message={message}
              onMessageChange={setMessage}
              onSent={() => refetchTicket()}
              ticketId={ticketId}
            />
          ) : (
            <div className="border-t bg-background px-6 py-4">
              <StatusBadge tone="neutral">
                {t("conversationClosed", "This conversation is closed")}
              </StatusBadge>
            </div>
          )
        }
        headerContent={
          ticket ? (
            <StatusBadge tone={ticketTones[ticket.status] || "neutral"}>
              {t(`status.${ticket.status}`)}
            </StatusBadge>
          ) : null
        }
        onOpenChange={(open) => {
          if (!open) {
            setTicketId(null);
            setMessage("");
          }
        }}
        open={ticketId !== null}
        size="lg"
        title={ticket?.title || t("ticketDetails", "Ticket Details")}
      >
        <div
          className="grid min-h-full content-start gap-5 p-6"
          ref={conversationRef}
        >
          {ticket?.description && (
            <ConversationMessage
              content={ticket.description}
              createdAt={ticket.created_at}
              system={false}
            />
          )}
          {ticket?.follow?.map((item) => (
            <ConversationMessage
              content={item.content || ""}
              createdAt={item.created_at}
              image={item.type === 2}
              key={item.id}
              system={item.from === "System"}
            />
          ))}
        </div>
      </DetailSheet>
    </div>
  );
}

function ConversationMessage({
  content,
  createdAt,
  image,
  system,
}: {
  content: string;
  createdAt: Date | number | undefined;
  image?: boolean;
  system: boolean;
}) {
  return (
    <div className={cn("flex", system && "justify-end")}>
      <div
        className={cn(
          "grid max-w-[85%] gap-1.5",
          system && "justify-items-end"
        )}
      >
        <span className="text-muted-foreground text-xs">
          {system ? "Admin" : "Customer"} · {formatDate(createdAt)}
        </span>
        <div
          className={cn(
            "rounded-2xl rounded-tl-sm border bg-background px-4 py-3 text-sm shadow-sm",
            system &&
              "rounded-tl-2xl rounded-tr-sm border-primary bg-primary text-primary-foreground"
          )}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt="attachment"
              className="max-h-72 max-w-full rounded-lg object-contain"
              height={300}
              src={content}
              width={300}
            />
          ) : (
            <p className="whitespace-pre-wrap">{content}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function TicketComposer({
  message,
  onMessageChange,
  onSent,
  ticketId,
}: {
  message: string;
  onMessageChange: (message: string) => void;
  onSent: () => void;
  ticketId: number | null;
}) {
  const { t } = useTranslation("ticket");

  return (
    <form
      className="flex items-center gap-2 border-t bg-background px-6 py-4"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!(message.trim() && ticketId)) return;
        await createTicketFollow({
          content: message.trim(),
          from: "System",
          ticket_id: ticketId,
          type: 1,
        });
        onMessageChange("");
        onSent();
      }}
    >
      <Button asChild size="icon" type="button" variant="outline">
        <Label className="cursor-pointer" htmlFor="ticket-picture">
          <ImagePlus aria-hidden="true" />
          <span className="sr-only">{t("uploadImage", "Upload image")}</span>
        </Label>
      </Button>
      <Input
        accept="image/*"
        className="hidden"
        id="ticket-picture"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (file?.type.startsWith("image/") && ticketId) {
            const content = await resizeImage(file);
            await createTicketFollow({
              content,
              from: "System",
              ticket_id: ticketId,
              type: 2,
            });
            event.target.value = "";
            onSent();
          }
        }}
        type="file"
      />
      <Input
        onChange={(event) => onMessageChange(event.target.value)}
        placeholder={t(
          "inputPlaceholder",
          "Please enter your question, we will reply as soon as possible."
        )}
        value={message}
      />
      <Button disabled={!message.trim()} size="icon" type="submit">
        <Send aria-hidden="true" />
        <span className="sr-only">{t("send", "Send")}</span>
      </Button>
    </form>
  );
}

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Unable to load image"));
      image.onload = () => {
        const scale = Math.min(1, 300 / image.width, 300 / image.height);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas
          .getContext("2d")
          ?.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/webp", 0.8));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function toTime(value: unknown) {
  const time = new Date(value as string).getTime();
  return Number.isFinite(time) ? time : 0;
}
