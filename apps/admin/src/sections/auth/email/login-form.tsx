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
import { Icon } from "@workspace/ui/composed/icon";
import { PasswordInput } from "@workspace/ui/composed/password-input";
import { AtSign, LockKeyhole } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useGlobalStore } from "@/stores/global";
import CloudFlareTurnstile, { type TurnstileRef } from "../turnstile";

export default function LoginForm({
  loading,
  onSubmit,
  initialValues,
  // setInitialValues,
  onSwitchForm,
}: {
  loading?: boolean;
  onSubmit: (data: any) => void;
  initialValues: any;
  setInitialValues: Dispatch<SetStateAction<any>>;
  onSwitchForm: Dispatch<SetStateAction<"register" | "reset" | "login">>;
}) {
  const { t } = useTranslation("auth");
  const { common } = useGlobalStore();
  const { verify } = common;

  const formSchema = z.object({
    email: z.email(t("login.email", "Email")),
    password: z.string(),
    cf_token:
      verify.enable_login_verify && verify.turnstile_site_key
        ? z.string()
        : z.string().optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const turnstile = useRef<TurnstileRef>(null);
  const handleSubmit = form.handleSubmit((data) => {
    try {
      onSubmit(data);
    } catch (_error) {
      turnstile.current?.reset();
    }
  });

  return (
    <>
      <Form {...form}>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("login.emailLabel", "Email address")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <AtSign className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 z-10 size-4 text-muted-foreground" />
                    <Input
                      autoComplete="username"
                      className="pl-9"
                      disabled={loading}
                      placeholder={t(
                        "login.emailPlaceholder",
                        "Enter your email..."
                      )}
                      type="email"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("login.passwordLabel", "Password")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <LockKeyhole className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 z-10 size-4 text-muted-foreground" />
                    <PasswordInput
                      autoComplete="current-password"
                      disabled={loading}
                      inputClassName="px-9"
                      placeholder={t(
                        "login.passwordPlaceholder",
                        "Enter your password..."
                      )}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {verify.enable_login_verify && (
            <FormField
              control={form.control}
              name="cf_token"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CloudFlareTurnstile
                      id="login"
                      {...field}
                      ref={turnstile}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button
            className="mt-1 w-full"
            disabled={loading}
            size="lg"
            type="submit"
          >
            {loading && <Icon className="animate-spin" icon="mdi:loading" />}
            {t("login.title", "Login")}
          </Button>
        </form>
      </Form>
      <div className="mt-4 flex w-full justify-end text-sm">
        <Button
          className="p-0"
          onClick={() => onSwitchForm("reset")}
          type="button"
          variant="link"
        >
          {t("login.forgotPassword", "Forgot Password?")}
        </Button>
        {/* <Button
          className="p-0"
          onClick={() => {
            setInitialValues(undefined);
            onSwitchForm("register");
          }}
          variant="link"
        >
          {t("login.registerAccount", "Register Account")}
        </Button> */}
      </div>
    </>
  );
}
