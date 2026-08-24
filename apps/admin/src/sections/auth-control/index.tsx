import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { PageHeader } from "@workspace/ui/composed/page-header";
import { StatusBadge } from "@workspace/ui/composed/status-badge";
import {
  KeyRound,
  MailCheck,
  MonitorSmartphone,
  ShieldCheck,
} from "lucide-react";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import AppleForm from "./forms/apple-form";
import DeviceForm from "./forms/device-form";
import EmailSettingsForm from "./forms/email-settings-form";
import FacebookForm from "./forms/facebook-form";
import GithubForm from "./forms/github-form";
import GoogleForm from "./forms/google-form";
import PhoneSettingsForm from "./forms/phone-settings-form";
import TelegramForm from "./forms/telegram-form";

interface AuthGroup {
  description: string;
  forms: Array<{ component: ComponentType }>;
  icon: ComponentType<{ className?: string }>;
  id: string;
  title: string;
}

export default function AuthControl() {
  const { t } = useTranslation("auth-control");

  const formSections: AuthGroup[] = [
    {
      id: "communication",
      title: t("communicationMethods", "Communication Methods"),
      description: t(
        "communicationDescription",
        "Configure identity verification and delivery channels for email and SMS."
      ),
      icon: MailCheck,
      forms: [
        { component: EmailSettingsForm },
        { component: PhoneSettingsForm },
      ],
    },
    {
      id: "social",
      title: t("socialAuthMethods", "Social Authentication Methods"),
      description: t(
        "socialDescription",
        "Connect OAuth providers and control which external identities can sign in."
      ),
      icon: KeyRound,
      forms: [
        { component: AppleForm },
        { component: GoogleForm },
        { component: FacebookForm },
        { component: GithubForm },
        { component: TelegramForm },
      ],
    },
    {
      id: "device",
      title: t("deviceAuthMethods", "Device Authentication Methods"),
      description: t(
        "deviceDescription",
        "Manage device authorization credentials and client enrollment policy."
      ),
      icon: MonitorSmartphone,
      forms: [{ component: DeviceForm }],
    },
  ];

  return (
    <div className="grid gap-6">
      <PageHeader
        description={t(
          "pageDescription",
          "Manage verification channels, external identity providers, and device access."
        )}
        eyebrow={t("pageEyebrow", "Identity & access")}
        metadata={
          <StatusBadge tone="warning">
            <ShieldCheck className="size-3.5" />
            {t("securitySensitive", "Security-sensitive configuration")}
          </StatusBadge>
        }
        title={t("pageTitle", "Authentication Methods")}
      />

      <div className="grid items-start gap-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <nav
          aria-label={t("authNavigation", "Authentication navigation")}
          className="sticky top-20 hidden rounded-xl border bg-card p-2 shadow-[var(--shadow-xs)] lg:grid"
        >
          {formSections.map((section) => {
            const Icon = section.icon;
            return (
              <a
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 font-medium text-muted-foreground text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                href={`#auth-${section.id}`}
                key={section.id}
              >
                <Icon className="size-4" />
                {section.title}
              </a>
            );
          })}
        </nav>

        <div className="grid min-w-0 gap-6">
          {formSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card
                className="scroll-mt-20 overflow-hidden"
                id={`auth-${section.id}`}
                key={section.id}
              >
                <CardHeader className="border-b bg-muted/30">
                  <div className="flex items-start gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-lg border bg-background text-primary shadow-[var(--shadow-xs)]">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="type-heading">
                        {section.title}
                      </CardTitle>
                      <CardDescription className="mt-1.5 max-w-2xl leading-relaxed">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
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
    </div>
  );
}
