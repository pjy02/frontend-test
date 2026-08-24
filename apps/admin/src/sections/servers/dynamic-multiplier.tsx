"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { DetailSheet } from "@workspace/ui/composed/detail-sheet";
import { ArrayInput } from "@workspace/ui/composed/dynamic-Inputs";
import { SettingsEntry } from "@workspace/ui/composed/settings-entry";
import { StickyActions } from "@workspace/ui/composed/sticky-actions";
import {
  getNodeMultiplier,
  setNodeMultiplier,
} from "@workspace/ui/services/admin/system";
import { Clock3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function DynamicMultiplier() {
  const { t } = useTranslation("servers");
  const [open, setOpen] = useState(false);
  const [timeSlots, setTimeSlots] = useState<API.TimePeriod[]>([]);

  const { data: periodsResp, refetch: refetchPeriods } = useQuery({
    queryKey: ["getNodeMultiplier"],
    queryFn: async () => {
      const { data } = await getNodeMultiplier();
      return (data.data?.periods || []) as API.TimePeriod[];
    },
    enabled: open,
  });

  useEffect(() => {
    if (periodsResp) {
      setTimeSlots(periodsResp);
    }
  }, [periodsResp]);

  async function savePeriods() {
    await setNodeMultiplier({ periods: timeSlots });
    await refetchPeriods();
    toast.success(t("server_config.saveSuccess", "Saved successfully"));
    setOpen(false);
  }

  return (
    <DetailSheet
      description={t(
        "server_config.dynamic_multiplier_desc",
        "Define time slots and multipliers to adjust traffic accounting."
      )}
      footer={
        <StickyActions>
          <Button
            onClick={() => setTimeSlots(periodsResp || [])}
            variant="outline"
          >
            {t("server_config.fields.reset", "Reset")}
          </Button>
          <Button onClick={() => setOpen(false)} variant="outline">
            {t("actions.cancel", "Cancel")}
          </Button>
          <Button onClick={savePeriods}>{t("actions.save", "Save")}</Button>
        </StickyActions>
      }
      onOpenChange={setOpen}
      open={open}
      size="md"
      title={t("server_config.dynamic_multiplier", "Dynamic multiplier")}
      trigger={
        <SettingsEntry
          className="rounded-xl border bg-card p-5 shadow-[var(--shadow-xs)]"
          description={t(
            "server_config.dynamic_multiplier_desc",
            "Define time slots and multipliers to adjust traffic accounting."
          )}
          icon={Clock3}
          title={t("server_config.dynamic_multiplier", "Dynamic multiplier")}
        />
      }
    >
      <div className="space-y-4">
        <ArrayInput<API.TimePeriod>
          fields={[
            {
              name: "start_time",
              prefix: t("server_config.fields.start_time", "Start time"),
              type: "time",
              step: "1",
            },
            {
              name: "end_time",
              prefix: t("server_config.fields.end_time", "End time"),
              type: "time",
              step: "1",
            },
            {
              name: "multiplier",
              prefix: t("server_config.fields.multiplier", "Multiplier"),
              type: "number",
              placeholder: "0",
            },
          ]}
          onChange={setTimeSlots}
          value={timeSlots}
        />
      </div>
    </DetailSheet>
  );
}
