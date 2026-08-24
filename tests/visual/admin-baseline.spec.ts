import { expect, type Page, type Route, test } from "@playwright/test";

const adminRoutes = [
  ["auth", "/"],
  ["dashboard", "/dashboard"],
  ["ads", "/dashboard/ads"],
  ["announcement", "/dashboard/announcement"],
  ["auth-control", "/dashboard/auth-control"],
  ["coupon", "/dashboard/coupon"],
  ["document", "/dashboard/document"],
  ["marketing", "/dashboard/marketing"],
  ["nodes", "/dashboard/nodes"],
  ["order", "/dashboard/order"],
  ["payment", "/dashboard/payment"],
  ["plugin", "/dashboard/plugin"],
  ["product", "/dashboard/product"],
  ["servers", "/dashboard/servers"],
  ["subscribe", "/dashboard/subscribe"],
  ["system", "/dashboard/system"],
  ["ticket", "/dashboard/ticket"],
  ["user", "/dashboard/user"],
  ["log-balance", "/dashboard/log/balance"],
  ["log-commission", "/dashboard/log/commission"],
  ["log-email", "/dashboard/log/email"],
  ["log-gift", "/dashboard/log/gift"],
  ["log-login", "/dashboard/log/login"],
  ["log-mobile", "/dashboard/log/mobile"],
  ["log-register", "/dashboard/log/register"],
  ["log-reset-subscribe", "/dashboard/log/reset-subscribe"],
  ["log-server-traffic", "/dashboard/log/server-traffic"],
  ["log-subscribe", "/dashboard/log/subscribe"],
  ["log-subscribe-traffic", "/dashboard/log/subscribe-traffic"],
  ["log-traffic-details", "/dashboard/log/traffic-details"],
] as const;

const commonData = {
  count: 0,
  list: [],
  total: 0,
  online_users: 0,
  online_servers: 0,
  offline_servers: 0,
  today_upload: 0,
  today_download: 0,
  monthly_upload: 0,
  monthly_download: 0,
  server_traffic_ranking_today: [],
  server_traffic_ranking_yesterday: [],
  user_traffic_ranking_today: [],
  user_traffic_ranking_yesterday: [],
};

const revenueStatistics = {
  today: {
    amount_total: 0,
    new_order_amount: 0,
    renewal_order_amount: 0,
  },
  monthly: {
    amount_total: 0,
    new_order_amount: 0,
    renewal_order_amount: 0,
    list: [],
  },
  all: { amount_total: 0, list: [] },
};

const userStatistics = {
  today: { register: 0, new_order_users: 0, renewal_order_users: 0 },
  monthly: {
    register: 0,
    new_order_users: 0,
    renewal_order_users: 0,
    list: [],
  },
  all: { register: 0, list: [] },
};

const globalConfig = {
  site: {
    host: "http://127.0.0.1:4173",
    site_name: "PPanel Visual Baseline",
    site_desc: "Admin redesign phase 0",
    site_logo: "/favicon.svg",
    keywords: "",
    custom_html: "",
    custom_data: "",
  },
  verify: {
    turnstile_site_key: "",
    enable_login_verify: false,
    enable_register_verify: false,
    enable_reset_password_verify: false,
  },
  auth: {
    mobile: { enable: false, enable_whitelist: false, whitelist: [] },
    email: {
      enable: true,
      enable_verify: false,
      enable_domain_suffix: false,
      domain_suffix_list: "",
    },
    register: {
      stop_register: false,
      enable_ip_register_limit: false,
      ip_register_limit: 0,
      ip_register_limit_duration: 0,
    },
    device: {
      enable: false,
      show_ads: false,
      enable_security: false,
      only_real_device: false,
    },
  },
  invite: {
    forced_invite: false,
    referral_percentage: 0,
    only_first_purchase: false,
  },
  currency: { currency_unit: "USD", currency_symbol: "$" },
  subscribe: {
    single_model: false,
    subscribe_path: "/sub",
    subscribe_domain: "",
    pan_domain: false,
    user_agent_limit: false,
    user_agent_list: "",
  },
  verify_code: {
    verify_code_expire_time: 5,
    verify_code_limit: 15,
    verify_code_interval: 60,
  },
  oauth_methods: [],
  web_ad: false,
};

function responseFor(url: URL) {
  if (url.pathname.endsWith("/v1/common/site/config")) return globalConfig;
  if (url.pathname.endsWith("/v1/admin/console/revenue")) {
    return revenueStatistics;
  }
  if (url.pathname.endsWith("/v1/admin/console/user")) {
    return userStatistics;
  }
  if (url.pathname.includes("/v1/admin/user/current")) {
    return {
      id: 1,
      avatar: "",
      auth_methods: [{ auth_identifier: "admin@example.com" }],
    };
  }
  return commonData;
}

async function mockApi(route: Route) {
  const url = new URL(route.request().url());
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ code: 0, data: responseFor(url), msg: "ok" }),
  });
}

async function preparePage(page: Page, authenticated: boolean) {
  await page.addInitScript((isAuthenticated) => {
    Math.random = () => 0.5;
    window.localStorage.setItem("language", "zh-CN");
    if (isAuthenticated) {
      document.cookie = "Authorization=visual-baseline; path=/";
    }
  }, authenticated);
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.protocol.startsWith("http") && url.hostname !== "127.0.0.1") {
      await route.abort();
      return;
    }
    await route.continue();
  });
  await page.route("**/v1/**", mockApi);
}

test.describe("admin phase 0 visual baseline", () => {
  test.describe.configure({ mode: "serial" });

  for (const [name, route] of adminRoutes) {
    test(name, async ({ page }) => {
      await preparePage(page, name !== "auth");
      await page.goto(`/#${route}`);
      await page.waitForLoadState("networkidle");
      await expect(page.locator("#app")).not.toBeEmpty();
      await expect(page.getByText("Something went wrong!")).toHaveCount(0);
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-duration: 0s !important;
            transition-duration: 0s !important;
            caret-color: transparent !important;
          }
        `,
      });
      await expect(page).toHaveScreenshot(`${name}.png`, {
        animations: "disabled",
        fullPage: true,
      });
    });
  }
});
