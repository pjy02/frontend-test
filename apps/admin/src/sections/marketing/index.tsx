import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { PageHeader } from "@workspace/ui/composed/page-header";
import { StatusBadge } from "@workspace/ui/composed/status-badge";
import { Gift, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import EmailBroadcastForm from "./email/broadcast-form";
import EmailTaskManager from "./email/task-manager";
import QuotaBroadcastForm from "./quota/broadcast-form";
import QuotaTaskManager from "./quota/task-manager";

export default function MarketingPage() {
  const { t } = useTranslation("marketing");

  const formSections = [
    {
      description: t(
        "emailMarketingDescription",
        "Build broadcasts and monitor delivery tasks."
      ),
      icon: Mail,
      title: t("emailMarketing", "Email Marketing"),
      forms: [
        { component: EmailBroadcastForm },
        { component: EmailTaskManager },
      ],
    },
    {
      description: t(
        "quotaServiceDescription",
        "Distribute account credit, traffic resets, and subscription time."
      ),
      icon: Gift,
      title: t("quotaService", "Quota Service"),
      forms: [
        { component: QuotaBroadcastForm },
        { component: QuotaTaskManager },
      ],
    },
  ];

  return (
    <div className="grid gap-5">
      <PageHeader
        description={t(
          "pageDescription",
          "Coordinate outbound communication and customer quota campaigns."
        )}
        eyebrow={t("pageEyebrow", "Customer engagement")}
        metadata={
          <StatusBadge tone="warning">
            {t("reviewBeforeLaunch", "Review audience before launch")}
          </StatusBadge>
        }
        title={t("pageTitle", "Marketing Operations")}
      />
      <div className="grid gap-5 xl:grid-cols-2">
        {formSections.map((section) => {
          const SectionIcon = section.icon;
          return (
            <Card key={section.title}>
              <CardHeader className="border-b">
                <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <SectionIcon className="size-5" />
                </div>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="divide-y p-0">
                {section.forms.map((form, formIndex) => {
                  const FormComponent = form.component;
                  return (
                    <div className="px-5 py-4" key={formIndex}>
                      <FormComponent />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
