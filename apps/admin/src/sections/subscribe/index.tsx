"use client";

import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { PageHeader } from "@workspace/ui/composed/page-header";
import { StatusBadge } from "@workspace/ui/composed/status-badge";
import { useTranslation } from "react-i18next";
import ConfigForm from "./config-form";
import { ProtocolForm } from "./protocol-form";

export default function Subscribe() {
  const { t } = useTranslation("subscribe");

  return (
    <div className="grid gap-5">
      <PageHeader
        description={t(
          "pageDescription",
          "Control subscription delivery, client matching, templates, and download behavior."
        )}
        eyebrow={t("pageEyebrow", "Delivery platform")}
        metadata={
          <StatusBadge tone="info">
            {t("templateDriven", "Template-driven output")}
          </StatusBadge>
        }
        title={t("pageTitle", "Subscription Configuration")}
      />
      <Card className="overflow-hidden py-0">
        <CardHeader className="border-b bg-muted/30 px-5 py-4">
          <div className="type-label text-muted-foreground uppercase">
            {t("config.sectionLabel", "Delivery defaults")}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ConfigForm />
        </CardContent>
      </Card>

      <ProtocolForm />
    </div>
  );
}
