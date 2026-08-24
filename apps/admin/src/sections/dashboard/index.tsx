import { Link } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { PageHeader } from "@workspace/ui/composed/page-header";
import { StatusBadge } from "@workspace/ui/composed/status-badge";
import { Settings, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import Billing from "./components/billing";
import Statistics from "./components/statistics";

export default function Dashboard() {
  const { t } = useTranslation("dashboard");

  return (
    <div className="flex flex-1 flex-col gap-5">
      <PageHeader
        actions={
          <>
            <Button asChild variant="outline">
              <Link to="/dashboard/user">
                <Users />
                {t("manageUsers", "Manage users")}
              </Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard/system">
                <Settings />
                {t("systemSettings", "System settings")}
              </Link>
            </Button>
          </>
        }
        description={t(
          "pageDescription",
          "Monitor service health, revenue, users, and traffic from one operational view."
        )}
        eyebrow={t("pageEyebrow", "Operations overview")}
        metadata={
          <StatusBadge pulse tone="success">
            {t("liveData", "Live data")}
          </StatusBadge>
        }
        title={t("pageTitle", "Dashboard")}
      />
      <Statistics />
      <Billing type="dashboard" />
    </div>
  );
}
