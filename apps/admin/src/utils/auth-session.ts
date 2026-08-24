import { redirect } from "@tanstack/react-router";
import { getCookie, removeCookie } from "@workspace/ui/lib/cookies";
import { useGlobalStore } from "@/stores/global";
import { setRedirectUrl } from "./common";

let sessionRequest: Promise<boolean> | undefined;

export async function resolveAdminSession(): Promise<boolean> {
  if (!getCookie("Authorization")) return false;

  const store = useGlobalStore.getState();
  if (store.user) return true;

  sessionRequest ??= store
    .getUserInfo()
    .then(() => Boolean(useGlobalStore.getState().user))
    .catch(() => false)
    .finally(() => {
      sessionRequest = undefined;
    });

  const authenticated = await sessionRequest;
  if (!authenticated) {
    removeCookie("Authorization");
    useGlobalStore.getState().setUser(undefined);
  }
  return authenticated;
}

export async function requireAdminAuth(redirectPath: string) {
  if (await resolveAdminSession()) return;
  setRedirectUrl(redirectPath);
  throw redirect({ to: "/" });
}

export async function redirectAuthenticatedAdmin() {
  if (await resolveAdminSession()) {
    throw redirect({ to: "/dashboard" });
  }
}
