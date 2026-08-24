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
  online_users: 128,
  online_servers: 12,
  offline_servers: 2,
  today_upload: 18_400_000_000,
  today_download: 54_700_000_000,
  monthly_upload: 328_000_000_000,
  monthly_download: 984_000_000_000,
  server_traffic_ranking_today: [
    { server_id: 1, name: "Hong Kong Edge 01", upload: 8e9, download: 24e9 },
    { server_id: 2, name: "Tokyo Core 02", upload: 6e9, download: 18e9 },
    { server_id: 3, name: "Frankfurt Edge", upload: 4e9, download: 12e9 },
  ],
  server_traffic_ranking_yesterday: [
    { server_id: 1, name: "Hong Kong Edge 01", upload: 7e9, download: 21e9 },
    { server_id: 2, name: "Tokyo Core 02", upload: 5e9, download: 16e9 },
  ],
  user_traffic_ranking_today: [
    { sid: 101, uid: 1001, upload: 3e9, download: 9e9 },
    { sid: 102, uid: 1002, upload: 2e9, download: 7e9 },
  ],
  user_traffic_ranking_yesterday: [
    { sid: 101, uid: 1001, upload: 2e9, download: 8e9 },
  ],
};

const revenueStatistics = {
  today: {
    amount_total: 328_600,
    new_order_amount: 214_800,
    renewal_order_amount: 113_800,
  },
  monthly: {
    amount_total: 8_420_000,
    new_order_amount: 5_360_000,
    renewal_order_amount: 3_060_000,
    list: [
      {
        date: "2026-08-18",
        amount_total: 910_000,
        new_order_amount: 580_000,
        renewal_order_amount: 330_000,
      },
      {
        date: "2026-08-19",
        amount_total: 1_020_000,
        new_order_amount: 640_000,
        renewal_order_amount: 380_000,
      },
      {
        date: "2026-08-20",
        amount_total: 1_180_000,
        new_order_amount: 760_000,
        renewal_order_amount: 420_000,
      },
      {
        date: "2026-08-21",
        amount_total: 960_000,
        new_order_amount: 610_000,
        renewal_order_amount: 350_000,
      },
      {
        date: "2026-08-22",
        amount_total: 1_310_000,
        new_order_amount: 820_000,
        renewal_order_amount: 490_000,
      },
    ],
  },
  all: {
    amount_total: 38_420_000,
    new_order_amount: 24_360_000,
    renewal_order_amount: 14_060_000,
    list: [],
  },
};

const userStatistics = {
  today: { register: 42, new_order_users: 28, renewal_order_users: 19 },
  monthly: {
    register: 924,
    new_order_users: 618,
    renewal_order_users: 382,
    list: [
      {
        date: "2026-08-18",
        register: 122,
        new_order_users: 78,
        renewal_order_users: 46,
      },
      {
        date: "2026-08-19",
        register: 136,
        new_order_users: 86,
        renewal_order_users: 51,
      },
      {
        date: "2026-08-20",
        register: 148,
        new_order_users: 97,
        renewal_order_users: 58,
      },
      {
        date: "2026-08-21",
        register: 118,
        new_order_users: 74,
        renewal_order_users: 43,
      },
      {
        date: "2026-08-22",
        register: 164,
        new_order_users: 108,
        renewal_order_users: 66,
      },
    ],
  },
  all: {
    register: 12_840,
    new_order_users: 8240,
    renewal_order_users: 5180,
    list: [],
  },
};

const visualUser = {
  id: 1001,
  avatar: "",
  balance: 128_600,
  commission: 24_800,
  referral_percentage: 12,
  only_first_purchase: true,
  gift_amount: 5000,
  telegram: 0,
  refer_code: "PPANEL24",
  referer_id: 0,
  enable: true,
  is_admin: false,
  enable_balance_notify: true,
  enable_login_notify: true,
  enable_subscribe_notify: true,
  enable_trade_notify: false,
  auth_methods: [
    {
      auth_type: "email",
      auth_identifier: "member@example.com",
      verified: true,
    },
  ],
  user_devices: [],
  rules: [],
  created_at: 1_724_515_200,
  updated_at: 1_724_601_600,
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
  if (url.pathname.endsWith("/v1/admin/user/list")) {
    return { count: 1, list: [visualUser], total: 1 };
  }
  if (url.pathname.endsWith("/v1/admin/user/detail")) return visualUser;
  if (url.pathname.endsWith("/v1/admin/system/site_config")) {
    return {
      site_logo: "/favicon.svg",
      site_name: "PPanel Visual Baseline",
      site_desc: "Admin redesign vertical template",
      keywords: "panel, operations",
      custom_html: "",
      host: "panel.example.com",
      custom_data: {},
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

async function stabilizeVisuals(page: Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }

      .navigation-progress {
        display: none !important;
      }
    `,
  });
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
      await stabilizeVisuals(page);
      await expect(page).toHaveScreenshot(`${name}.png`, {
        animations: "disabled",
        fullPage: true,
      });
    });
  }

  test("auth guard redirects anonymous dashboard access", async ({ page }) => {
    await preparePage(page, false);
    await page.goto("/#/dashboard");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/#\/$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "登录" })
    ).toBeVisible();
  });

  test("command menu and sidebar keyboard interactions", async ({ page }) => {
    await preparePage(page, true);
    await page.goto("/#/dashboard");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("Control+k");
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByPlaceholder("输入页面名称或操作…")).toBeFocused();
    await stabilizeVisuals(page);
    await expect(page).toHaveScreenshot("command-menu.png", {
      animations: "disabled",
      fullPage: true,
    });
    await page.keyboard.press("Escape");

    await page
      .getByRole("button", { exact: true, name: "Toggle Sidebar" })
      .first()
      .click();
    await expect(
      page.locator('[data-slot="sidebar"][data-state="collapsed"]')
    ).toBeVisible();
  });

  test("announcement page standards and detail sheet", async ({ page }) => {
    await preparePage(page, true);
    await page.goto("/#/dashboard/announcement");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { level: 1, name: "公告列表" })
    ).toBeVisible();
    await page.getByRole("button", { exact: true, name: "创建" }).click();
    const detailSheet = page.getByRole("dialog", { name: "创建公告" });
    await expect(detailSheet).toBeVisible();
    await stabilizeVisuals(page);
    await expect(page).toHaveScreenshot("announcement-detail-sheet.png", {
      animations: "disabled",
      fullPage: false,
    });
  });

  test("user vertical template and profile detail", async ({ page }) => {
    await preparePage(page, true);
    await page.goto("/#/dashboard/user");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { level: 1, name: "用户列表" })
    ).toBeVisible();
    await expect(page.getByText("member@example.com")).toBeVisible();
    await page.getByRole("button", { exact: true, name: "编辑" }).click();
    await expect(page.getByRole("dialog", { name: /用户资料/ })).toBeVisible();
    await stabilizeVisuals(page);
    await expect(page).toHaveScreenshot("user-detail-sheet.png", {
      animations: "disabled",
      fullPage: false,
    });
  });

  test("system vertical template and settings form", async ({ page }) => {
    await preparePage(page, true);
    await page.goto("/#/dashboard/system");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { level: 1, name: "系统设置" })
    ).toBeVisible();
    await page.getByText("站点配置", { exact: true }).click();
    await expect(page.getByRole("dialog", { name: "站点配置" })).toBeVisible();
    await stabilizeVisuals(page);
    await expect(page).toHaveScreenshot("system-settings-sheet.png", {
      animations: "disabled",
      fullPage: false,
    });
  });

  test("mobile login and sidebar sheet", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await preparePage(page, false);
    await page.goto("/#/");
    await page.waitForLoadState("networkidle");
    await stabilizeVisuals(page);
    await expect(page).toHaveScreenshot("auth-mobile.png", {
      animations: "disabled",
      fullPage: true,
    });

    await page.context().addCookies([
      {
        name: "Authorization",
        value: "visual-baseline",
        url: "http://127.0.0.1:4173",
      },
    ]);
    await page.goto("/#/dashboard");
    await page.waitForLoadState("networkidle");
    await page
      .getByRole("button", { exact: true, name: "Toggle Sidebar" })
      .first()
      .click();
    await expect(page.locator('[data-mobile="true"]')).toBeVisible();
    await stabilizeVisuals(page);
    await expect(page).toHaveScreenshot("sidebar-mobile.png", {
      animations: "disabled",
      fullPage: false,
    });
  });
});
