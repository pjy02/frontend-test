import { removeCookie, setCookie } from "@workspace/ui/lib/cookies";
import { isBrowser } from "@workspace/ui/utils/index";
import { intlFormat } from "date-fns";

export function getPlatform(): string {
  if (typeof window === "undefined") return "unknown";

  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes("android")) return "android";

  // Detect iOS, including iPad/iPhone requesting desktop site
  // iOS devices have maxTouchPoints > 1, macOS typically has 0
  const isIOS =
    userAgent.includes("iphone") ||
    userAgent.includes("ipad") ||
    (userAgent.includes("mac") && navigator.maxTouchPoints > 1);
  if (isIOS) return "ios";

  if (userAgent.includes("win")) return "windows";
  if (userAgent.includes("mac")) return "macos";
  if (userAgent.includes("linux")) return "linux";

  return "unknown";
}

export function differenceInDays(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date1.getTime() - date2.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function formatDate(date?: Date | number, showTime = true) {
  if (!date) return;
  const timeZone = localStorage.getItem("timezone") || "UTC";
  return intlFormat(date, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    ...(showTime && {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }),
    hour12: false,
    timeZone,
  });
}

export function setAuthorization(token: string): void {
  setCookie("Authorization", token);
}

export function sanitizeRedirectPath(
  value?: string | null
): string | undefined {
  if (!value?.startsWith("/") || value.startsWith("//")) return;
  try {
    const url = new URL(value, "https://admin.local");
    if (url.origin !== "https://admin.local") return;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return;
  }
}

export function getRedirectUrl(): string {
  if (typeof window === "undefined") return "/dashboard";

  const storedRedirect = sanitizeRedirectPath(
    sessionStorage.getItem("redirect-url")
  );
  sessionStorage.removeItem("redirect-url");
  if (storedRedirect) return storedRedirect;

  const hashSearch = window.location.hash.split("?")[1];
  const params = new URLSearchParams(
    hashSearch || window.location.search.replace(/^\?/, "")
  );
  return sanitizeRedirectPath(params.get("redirect")) || "/dashboard";
}

export function setRedirectUrl(value?: string) {
  const redirect = sanitizeRedirectPath(value);
  if (redirect && redirect !== "/")
    sessionStorage.setItem("redirect-url", redirect);
}

export function Logout() {
  if (!isBrowser()) return;
  removeCookie("Authorization");

  const hashPath = location.hash.slice(1);
  const currentPath = hashPath || location.pathname;
  setRedirectUrl(currentPath);
  location.href = "/#/";
}
