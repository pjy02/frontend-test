"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Switch } from "@workspace/ui/components/switch";
import { Textarea } from "@workspace/ui/components/textarea";
import { DetailSheet } from "@workspace/ui/composed/detail-sheet";
import { EnhancedInput } from "@workspace/ui/composed/enhanced-input";
import { SettingsEntry } from "@workspace/ui/composed/settings-entry";
import { StickyActions } from "@workspace/ui/composed/sticky-actions";
import {
  getSubscribeConfig,
  updateSubscribeConfig,
} from "@workspace/ui/services/admin/system";
import { LoaderCircle, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const subscribeConfigSchema = z.object({
  single_model: z.boolean().optional(),
  pan_domain: z.boolean().optional(),
  subscribe_path: z.string().optional(),
  subscribe_domain: z.string().optional(),
  user_agent_limit: z.boolean().optional(),
  user_agent_list: z.string().optional(),
  show_tutorial: z.boolean().optional(),
  profile_update_interval: z.coerce.number().int().min(0).optional(),
  profile_web_page_url: z.string().optional(),
});

type SubscribeConfigFormData = z.infer<typeof subscribeConfigSchema>;

export default function ConfigForm() {
  const { t } = useTranslation("subscribe");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["getSubscribeConfig"],
    queryFn: async () => {
      const { data } = await getSubscribeConfig();
      return data.data;
    },
    enabled: open,
  });

  const form = useForm<SubscribeConfigFormData>({
    resolver: zodResolver(
      subscribeConfigSchema
    ) as Resolver<SubscribeConfigFormData>,
    defaultValues: {
      single_model: false,
      pan_domain: false,
      subscribe_path: "",
      subscribe_domain: "",
      user_agent_limit: false,
      user_agent_list: "",
      show_tutorial: true,
      profile_update_interval: 0,
      profile_web_page_url: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  async function onSubmit(values: SubscribeConfigFormData) {
    setLoading(true);
    try {
      await updateSubscribeConfig(values as API.SubscribeConfig);
      toast.success(t("config.updateSuccess", "Settings updated successfully"));
      refetch();
      setOpen(false);
    } catch (_error) {
      toast.error(t("config.updateError", "Update failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <DetailSheet
      description={t(
        "config.sheetDescription",
        "Set public paths, delivery domains, profile metadata, and client access rules."
      )}
      footer={
        <StickyActions
          description={t(
            "config.saveDescription",
            "These defaults apply to subscription delivery immediately after saving."
          )}
        >
          <Button
            disabled={loading}
            onClick={() => setOpen(false)}
            variant="outline"
          >
            {t("actions.cancel", "Cancel")}
          </Button>
          <Button disabled={loading} form="subscribe-config-form" type="submit">
            {loading && <LoaderCircle className="mr-2 animate-spin" />}
            {t("actions.save", "Save")}
          </Button>
        </StickyActions>
      }
      onOpenChange={setOpen}
      open={open}
      size="md"
      title={t("config.title", "Subscription Configuration")}
      trigger={
        <SettingsEntry
          description={t(
            "config.description",
            "Manage subscription system settings"
          )}
          icon={Settings}
          title={t("config.title", "Subscription Configuration")}
        />
      }
    >
      <Form {...form}>
        <form
          className="space-y-2 pt-4"
          id="subscribe-config-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="show_tutorial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("config.showTutorial", "Show Tutorial Section")}
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    className="!mt-0 float-end"
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  {t(
                    "config.showTutorialDescription",
                    "Show the client tutorial section on the user document page"
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="single_model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t(
                    "config.singleSubscriptionMode",
                    "Single Subscription Mode"
                  )}
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    className="!mt-0 float-end"
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  {t(
                    "config.singleSubscriptionModeDescription",
                    "Limit users to one active subscription. Existing subscriptions unaffected"
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pan_domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("config.wildcardResolution", "Wildcard Resolution")}
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    className="!mt-0 float-end"
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  {t(
                    "config.wildcardResolutionDescription",
                    "Enable wildcard domain resolution for subscriptions"
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subscribe_path"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("config.subscriptionPath", "Subscription Path")}
                </FormLabel>
                <FormControl>
                  <EnhancedInput
                    onValueBlur={field.onChange}
                    placeholder={t(
                      "config.subscriptionPathPlaceholder",
                      "Enter subscription path"
                    )}
                    value={field.value}
                  />
                </FormControl>
                <FormDescription>
                  {t(
                    "config.subscriptionPathDescription",
                    "Custom path for subscription endpoints (better performance after system restart)"
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subscribe_domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("config.subscriptionDomain", "Subscription Domain")}
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="h-32"
                    placeholder={`${t(
                      "config.subscriptionDomainPlaceholder",
                      "Enter subscription domain, one per line"
                    )}\nexample.com\nwww.example.com`}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {t(
                    "config.subscriptionDomainDescription",
                    "Custom domain for subscription links"
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profile_update_interval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("config.profileUpdateInterval", "Profile Update Interval")}
                </FormLabel>
                <FormControl>
                  <EnhancedInput
                    min={0}
                    onValueBlur={(value) => field.onChange(Number(value))}
                    placeholder="24"
                    suffix="Hours"
                    type="number"
                    value={field.value}
                  />
                </FormControl>
                <FormDescription>
                  {t(
                    "config.profileUpdateIntervalDescription",
                    "Set the profile-update-interval response header in hours. 0 disables this header."
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profile_web_page_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("config.profileWebPageUrl", "Profile Web Page URL")}
                </FormLabel>
                <FormControl>
                  <EnhancedInput
                    onValueBlur={field.onChange}
                    placeholder="https://example.com"
                    value={field.value}
                  />
                </FormControl>
                <FormDescription>
                  {t(
                    "config.profileWebPageUrlDescription",
                    "Set the profile-web-page-url response header. Leave blank to disable this header."
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="user_agent_limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("config.userAgentLimit", "{{userAgent}} Restriction", {
                    userAgent: "User-Agent",
                  })}
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    className="!mt-0 float-end"
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  {t(
                    "config.userAgentLimitDescription",
                    "Enable access restrictions based on {{userAgent}}",
                    {
                      userAgent: "User-Agent",
                    }
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="user_agent_list"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("config.userAgentList", "{{userAgent}} Whitelist", {
                    userAgent: "User-Agent",
                  })}
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="h-32"
                    placeholder={`${t(
                      "config.userAgentListPlaceholder",
                      "Enter allowed {{userAgent}}, one per line",
                      { userAgent: "User-Agent" }
                    )}\nClashX\nClashForAndroid\nClash-verge`}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {t(
                    "config.userAgentListDescription",
                    "Allowed {{userAgent}} for subscription access, one per line. Configured application {{userAgent}} will be automatically included",
                    {
                      userAgent: "User-Agent",
                    }
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </DetailSheet>
  );
}
