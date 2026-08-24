"use client";

import { Badge } from "@workspace/ui/components/badge";
import { LanguageSwitch } from "@workspace/ui/composed/language-switch";
import { ThemeSwitch } from "@workspace/ui/composed/theme-switch";
import {
  Activity,
  CheckCircle2,
  Globe2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGlobalStore } from "@/stores/global";
import EmailAuthForm from "./email/auth-form";

export default function Auth() {
  const { t } = useTranslation("auth");
  const { common } = useGlobalStore();
  const siteName = common.site.site_name || "Perfect Panel";
  const siteDescription =
    common.site.site_desc ||
    t("page.defaultDescription", "A focused workspace for modern operations.");
  const capabilities = [
    {
      icon: Activity,
      label: t("page.capabilityStatus", "Live service status"),
    },
    {
      icon: ShieldCheck,
      label: t("page.capabilitySecurity", "Centralized security policies"),
    },
    { icon: Globe2, label: t("page.capabilityGlobal", "Global traffic views") },
  ] as const;

  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-[minmax(0,1.08fr)_minmax(30rem,0.92fr)]">
      <aside className="relative hidden overflow-hidden bg-[var(--brand-canvas)] p-10 text-[var(--brand-canvas-foreground)] lg:flex lg:flex-col xl:p-14">
        <div className="-top-32 -right-24 absolute size-96 rounded-full bg-[var(--brand-glow)] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <header className="relative flex items-center gap-3">
          <div className="grid size-10 place-items-center overflow-hidden rounded-xl border border-white/15 bg-white/10 shadow-lg backdrop-blur">
            <img
              alt=""
              className="size-7 object-contain"
              height={28}
              src={common.site.site_logo || "/favicon.svg"}
              width={28}
            />
          </div>
          <div>
            <p className="font-semibold text-base">{siteName}</p>
            <p className="text-white/55 text-xs">Admin Console</p>
          </div>
        </header>

        <div className="relative my-auto max-w-2xl py-16">
          <Badge
            className="mb-6 border-white/10 bg-white/10 text-white"
            variant="outline"
          >
            <Sparkles />
            {t("page.eyebrow", "Operations, simplified")}
          </Badge>
          <h1 className="type-display max-w-xl text-balance">
            {t("page.heroTitle", "Manage complex systems with clarity.")}
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/62 leading-relaxed">
            {siteDescription}
          </p>

          <div className="mt-10 grid gap-3">
            {capabilities.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3 backdrop-blur-sm"
                  key={item.label}
                >
                  <div className="grid size-8 place-items-center rounded-lg bg-white/10 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <span className="text-sm text-white/78">{item.label}</span>
                  <CheckCircle2 className="ml-auto size-4 text-success" />
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              ["24/7", t("page.metricAvailability", "Always available")],
              ["Global", t("page.metricGlobal", "Multi-region")],
              ["Secure", t("page.metricSecure", "Session protected")],
            ].map(([value, label]) => (
              <div
                className="rounded-xl border border-white/10 bg-black/10 p-4"
                key={value}
              >
                <p className="font-semibold text-lg">{value}</p>
                <p className="mt-1 text-white/45 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <footer className="relative flex items-center gap-2 text-white/45 text-xs">
          <LockKeyhole className="size-3.5" />
          {t(
            "page.auditNotice",
            "Protected admin access · Operations are recorded in audit logs"
          )}
        </footer>
      </aside>

      <section className="relative flex min-h-svh flex-col">
        <header className="flex h-16 items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="grid size-8 place-items-center overflow-hidden rounded-lg border bg-primary/10">
              <img
                alt=""
                className="size-5 object-contain"
                height={20}
                src={common.site.site_logo || "/favicon.svg"}
                width={20}
              />
            </div>
            <span className="font-semibold">{siteName}</span>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <LanguageSwitch />
            <ThemeSwitch />
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <EmailAuthForm />
            <div className="mt-8 flex items-center justify-center gap-2 border-t pt-6 text-muted-foreground text-xs">
              <ShieldCheck className="size-3.5 text-success" />
              {t(
                "page.encryptedNotice",
                "Encrypted connection · Credentials are used only for this session"
              )}
            </div>
          </div>
        </div>

        <footer className="px-5 py-5 text-center text-muted-foreground text-xs sm:px-8">
          © {new Date().getFullYear()} {siteName}. Admin workspace.
        </footer>
      </section>
    </main>
  );
}
