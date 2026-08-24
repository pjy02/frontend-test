import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { DetailSheet } from "@workspace/ui/composed/detail-sheet";
import { MarkdownEditor } from "@workspace/ui/composed/editor/markdown";
import { FormSection } from "@workspace/ui/composed/form-section";
import { StickyActions } from "@workspace/ui/composed/sticky-actions";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const formSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
});

interface AnnouncementFormProps<T> {
  onSubmit: (data: T) => Promise<boolean> | boolean;
  initialValues?: T;
  loading?: boolean;
  trigger: string;
  title: string;
}

export default function AnnouncementForm<T extends Record<string, any>>({
  onSubmit,
  initialValues,
  loading,
  trigger,
  title,
}: AnnouncementFormProps<T>) {
  const { t } = useTranslation("announcement");
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      ...initialValues,
    },
  });

  useEffect(() => {
    form?.reset(initialValues);
  }, [form, initialValues]);

  async function handleSubmit(data: { [x: string]: any }) {
    const bool = await onSubmit(data as T);
    if (bool) setOpen(false);
  }

  return (
    <DetailSheet
      description={t(
        "form.description",
        "Compose the message and preview how it will appear to customers."
      )}
      footer={
        <StickyActions
          description={t(
            "form.saveHint",
            "Changes take effect after you confirm and save."
          )}
        >
          <Button
            disabled={loading}
            onClick={() => setOpen(false)}
            variant="outline"
          >
            {t("form.cancel", "Cancel")}
          </Button>
          <Button disabled={loading} onClick={form.handleSubmit(handleSubmit)}>
            {loading && <LoaderCircle className="animate-spin" />}
            {t("form.confirm", "Confirm")}
          </Button>
        </StickyActions>
      }
      onOpenChange={setOpen}
      open={open}
      size="lg"
      title={title}
      trigger={
        <Button
          onClick={() => {
            form.reset();
            setOpen(true);
          }}
        >
          {trigger}
        </Button>
      }
    >
      <Form {...form}>
        <form id="notice-form" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormSection
            description={t(
              "form.contentDescription",
              "Use a concise title and clear Markdown content."
            )}
            title={t("form.contentSection", "Announcement content")}
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.title", "Title")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.titlePlaceholder", "Enter title")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.content", "Content")}</FormLabel>
                    <FormControl>
                      <MarkdownEditor
                        onChange={(value) => {
                          form.setValue(field.name, value || "");
                        }}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormSection>
        </form>
      </Form>
    </DetailSheet>
  );
}
