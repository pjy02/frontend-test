import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { PageHeader } from "@workspace/ui/composed/page-header";
import { StatusBadge } from "@workspace/ui/composed/status-badge";
import { Database, Settings2, ShieldCheck } from "lucide-react";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import CurrencyForm from "./basic-settings/currency-form";
import PrivacyPolicyForm from "./basic-settings/privacy-policy-form";
import SiteForm from "./basic-settings/site-form";
import TosForm from "./basic-settings/tos-form";
import LogCleanupForm from "./log-cleanup/log-cleanup-form";
import InviteForm from "./user-security/invite-form";
import RegisterForm from "./user-security/register-form";
import VerifyCodeForm from "./user-security/verify-code-form";
import VerifyForm from "./user-security/verify-form";

interface SettingsGroup {
  description: string;
  forms: ComponentType[];
  icon: ComponentType<{ className?: string }>;
  id: string;
  title: string;
}

export default function System() {
  const { t } = useTranslation("system");

  const formSections: SettingsGroup[] = [
    {
      id: "general",
      title: t("basicSettings", "Basic Settings"),
      description: t(
        "basicSettingsDescription",
        "Brand, domains, currency, and customer-facing legal content."
      ),
      icon: Settings2,
      forms: [SiteForm, CurrencyForm, TosForm, PrivacyPolicyForm],
    },
    {
      id: "security",
      title: t("userSecuritySettings", "User & Security"),
      description: t(
        "userSecurityDescription",
        "Registration, invitations, verification, and abuse protection."
      ),
      icon: ShieldCheck,
      forms: [RegisterForm, InviteForm, VerifyForm, VerifyCodeForm],
    },
    {
      id: "logs",
      title: t("logSettings", "Log Settings"),
      description: t(
        "logSettingsDescription",
        "Retention and automatic cleanup for operational records."
      ),
      icon: Database,
      forms: [LogCleanupForm],
    },
  ];

  return (
    <div className="grid gap-6">
      <PageHeader
        description={t(
          "pageDescription",
          "Configure product defaults, account security, and operational policies."
        )}
        eyebrow={t("pageEyebrow", "Administration")}
        metadata={
          <StatusBadge tone="warning">
            {t("changesApplyImmediately", "Changes apply immediately")}
          </StatusBadge>
        }
        title={t("pageTitle", "System Settings")}
      />

      <div className="grid items-start gap-6 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <nav
          aria-label={t("settingsNavigation", "Settings navigation")}
          className="sticky top-20 hidden rounded-xl border bg-card p-2 shadow-[var(--shadow-xs)] lg:grid"
        >
          {formSections.map((section) => {
            const Icon = section.icon;
            return (
              <a
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 font-medium text-muted-foreground text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                href={`#settings-${section.id}`}
                key={section.id}
              >
                <Icon className="size-4" />
                {section.title}
              </a>
            );
          })}
        </nav>

        <div className="grid min-w-0 gap-5">
          {formSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card id={`settings-${section.id}`} key={section.id}>
                <CardHeader className="border-b">
                  <div className="flex items-start gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle>{section.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="divide-y px-0">
                  {section.forms.map((FormComponent, formIndex) => (
                    <div
                      className="p-4 transition-colors hover:bg-surface"
                      key={`${section.id}-${formIndex}`}
                    >
                      <FormComponent />
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
