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

const visualSubscribe = {
  id: 11,
  name: "Pro Annual",
  description: "Primary annual subscription",
  unit_price: 19_900,
  unit_time: "Month",
  discount: [{ quantity: 12, discount: 15 }],
  replacement: 0,
  inventory: -1,
  traffic: 1_099_511_627_776,
  speed_limit: 0,
  device_limit: 5,
  quota: 0,
  nodes: [21],
  node_tags: ["premium"],
  show: true,
  sell: true,
  sort: 1,
  deduction_ratio: 0,
  allow_deduction: false,
  reset_cycle: 1,
  renewal_reset: true,
  show_original_price: true,
  sold: 384,
  language: "zh-CN",
  created_at: 1_724_515_200_000,
  updated_at: 1_724_601_600_000,
};

const visualServer = {
  id: 1,
  name: "Hong Kong Edge 01",
  country: "Hong Kong",
  city: "Central",
  address: "203.0.113.10",
  sort: 1,
  protocols: [
    { type: "vless", port: 443, enable: true, ratio: 1 },
    { type: "shadowsocks", port: 8443, enable: true, ratio: 1.2 },
  ],
  last_reported_at: 1_724_605_200_000,
  status: {
    cpu: 28.4,
    mem: 46.8,
    disk: 61.2,
    protocol: "vless",
    online: [],
    status: "online",
  },
  created_at: 1_724_515_200_000,
  updated_at: 1_724_605_200_000,
};

const visualNode = {
  id: 21,
  name: "HK Premium Gateway",
  tags: ["premium", "asia"],
  port: 443,
  address: "hk-edge.example.com",
  server_id: 1,
  protocol: "vless",
  enabled: true,
  sort: 1,
  created_at: 1_724_515_200_000,
  updated_at: 1_724_605_200_000,
};

const visualLogRecords: Record<string, Record<string, unknown>> = {
  "/v1/admin/log/balance/list": {
    id: 701,
    user_id: 1001,
    amount: 19_900,
    balance: 128_600,
    order_no: "PP-20260824-0001",
    type: 321,
    timestamp: 1_724_605_200_000,
  },
  "/v1/admin/log/commission/list": {
    id: 702,
    user_id: 1001,
    amount: 2480,
    order_no: "PP-20260824-0001",
    type: 325,
    timestamp: 1_724_605_200_000,
  },
  "/v1/admin/log/email/list": {
    id: 703,
    platform: "smtp",
    to: "member@example.com",
    subject: "Subscription renewed",
    content: { template: "renewal-success", locale: "zh-CN" },
    status: 1,
    created_at: 1_724_605_200_000,
  },
  "/v1/admin/log/gift/list": {
    id: 704,
    user_id: 1001,
    subscribe_id: 101,
    order_no: "PP-20260824-0001",
    amount: 5000,
    balance: 133_600,
    type: 341,
    remark: "Retention campaign credit",
    timestamp: 1_724_605_200_000,
  },
  "/v1/admin/log/login/list": {
    id: 705,
    user_id: 1001,
    method: "email",
    login_ip: "203.0.113.24",
    user_agent: "Mozilla/5.0 PPanel Operations Console",
    success: true,
    timestamp: 1_724_605_200_000,
  },
  "/v1/admin/log/mobile/list": {
    id: 706,
    platform: "twilio",
    to: "+86 138 0000 0000",
    subject: "Verification code",
    content: { template: "login-code", region: "CN" },
    status: 1,
    created_at: 1_724_605_200_000,
  },
  "/v1/admin/log/register/list": {
    id: 707,
    user_id: 1001,
    auth_method: "email",
    identifier: "member@example.com",
    register_ip: "203.0.113.24",
    user_agent: "Mozilla/5.0 PPanel Operations Console",
    timestamp: 1_724_605_200_000,
  },
  "/v1/admin/log/subscribe/reset/list": {
    id: 708,
    user_id: 1001,
    user_subscribe_id: 101,
    type: 231,
    order_no: "PP-20260824-0001",
    timestamp: 1_724_605_200_000,
  },
  "/v1/admin/log/server/traffic/list": {
    id: 709,
    server_id: 1,
    upload: 8_000_000_000,
    download: 24_000_000_000,
    total: 32_000_000_000,
    date: "2026-08-24",
  },
  "/v1/admin/log/subscribe/list": {
    id: 710,
    user_id: 1001,
    user_subscribe_id: 101,
    client_ip: "203.0.113.24",
    user_agent: "Clash Meta/1.19.0",
    timestamp: 1_724_605_200_000,
  },
  "/v1/admin/log/subscribe/traffic/list": {
    id: 711,
    user_id: 1001,
    subscribe_id: 101,
    upload: 3_000_000_000,
    download: 9_000_000_000,
    total: 12_000_000_000,
    date: "2026-08-24",
  },
  "/v1/admin/log/traffic/details": {
    id: 712,
    server_id: 1,
    user_id: 1001,
    subscribe_id: 101,
    upload: 3_000_000_000,
    download: 9_000_000_000,
    timestamp: 1_724_605_200_000,
  },
};

const visualApplication = {
  id: 31,
  name: "Clash Meta",
  description: "Managed profile for Clash-compatible clients",
  icon: "",
  scheme: "clash://install-config?url={{url}}",
  user_agent: "Clash|Mihomo",
  is_default: true,
  template: "proxies: {{ .Proxies }}",
  output_format: "yaml",
  download_link: { windows: "https://example.com/clash" },
  created_at: 1_724_515_200_000,
  updated_at: 1_724_605_200_000,
};

const visualPlugin = {
  name: "traffic-insights",
  version: "1.4.2",
  description: "Adds operational traffic insights and health endpoints.",
  author: "PPanel Labs",
  status: "running",
  permissions: ["http.route", "event.subscribe", "storage.read"],
  routes: ["GET /admin/traffic-insights"],
};

const visualOrder = {
  id: 701,
  user_id: 1001,
  order_no: "ORD-20260824-0701",
  type: 1,
  quantity: 1,
  price: 19_900,
  amount: 18_900,
  gift_amount: 0,
  discount: 1000,
  coupon: "WELCOME10",
  coupon_discount: 1000,
  commission: 950,
  payment: { id: 8, name: "Stripe", email: "billing@example.com" },
  fee_amount: 0,
  trade_no: "pi_visual_20260824",
  status: 2,
  subscribe_id: 11,
  created_at: 1_724_601_600_000,
  updated_at: 1_724_605_200_000,
};

const visualCoupon = {
  id: 301,
  name: "Welcome campaign",
  code: "WELCOME10",
  count: 500,
  type: 1,
  discount: 10,
  start_time: 1_724_515_200_000,
  expire_time: 1_727_107_200_000,
  user_limit: 1,
  subscribe: [11],
  used_count: 128,
  enable: true,
  created_at: 1_724_515_200_000,
  updated_at: 1_724_601_600_000,
};

const visualAnnouncement = {
  id: 401,
  title: "Service reliability update",
  content: "All regions are operating normally after scheduled maintenance.",
  show: true,
  pinned: true,
  popup: false,
  created_at: 1_724_515_200_000,
  updated_at: 1_724_601_600_000,
};

const visualDocument = {
  id: 501,
  title: "Getting started with your subscription",
  content: "Use {{subscribe_url}} to connect your preferred client.",
  tags: ["getting-started", "subscription"],
  show: true,
  created_at: 1_724_515_200_000,
  updated_at: 1_724_601_600_000,
};

const visualTicket = {
  id: 601,
  title: "Unable to connect after renewal",
  description: "My subscription renewed, but the client cannot refresh nodes.",
  user_id: 1001,
  status: 1,
  created_at: 1_724_601_600_000,
  updated_at: 1_724_605_200_000,
  follow: [
    {
      id: 1,
      ticket_id: 601,
      from: "System",
      type: 1,
      content: "I’m checking the subscription status for you now.",
      created_at: 1_724_603_400_000,
    },
  ],
};

const visualPayment = {
  id: 8,
  name: "Stripe Card",
  platform: "stripe",
  description: "Visa, Mastercard, and supported local cards",
  icon: "",
  domain: "payments.example.com",
  notify_url: "https://panel.example.com/v1/notify/stripe",
  config: {},
  fee_mode: 1,
  fee_percent: 2.9,
  fee_amount: 0,
  enable: true,
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
  const visualLogRecord = visualLogRecords[url.pathname];
  if (visualLogRecord) {
    return { count: 1, list: [visualLogRecord], total: 1 };
  }
  if (url.pathname.endsWith("/v1/admin/user/list")) {
    return { count: 1, list: [visualUser], total: 1 };
  }
  if (url.pathname.endsWith("/v1/admin/user/detail")) return visualUser;
  if (url.pathname.endsWith("/v1/admin/server/list")) {
    return { count: 1, list: [visualServer], total: 1 };
  }
  if (url.pathname.endsWith("/v1/admin/server/node/list")) {
    return { count: 1, list: [visualNode], total: 1 };
  }
  if (url.pathname.endsWith("/v1/admin/server/node/tags")) {
    return { tags: ["premium", "asia"] };
  }
  if (
    url.pathname.endsWith("/v1/admin/application/subscribe_application_list")
  ) {
    return { count: 1, list: [visualApplication], total: 1 };
  }
  if (url.pathname.endsWith("/v1/admin/application/preview")) {
    return { template: "proxies:\n  - name: HK Premium Gateway" };
  }
  if (url.pathname.endsWith("/v1/admin/system/subscribe_config")) {
    return globalConfig.subscribe;
  }
  if (url.pathname.endsWith("/v1/admin/auth-method/config")) {
    return {
      id: 1,
      method: url.searchParams.get("method") || "email",
      enabled: true,
      config: {
        enable_verify: true,
        enable_domain_suffix: false,
        domain_suffix_list: "",
        platform: "smtp",
        platform_config: {
          host: "smtp.example.com",
          port: 587,
          ssl: false,
          user: "mailer@example.com",
          pass: "",
          from: "PPanel <mailer@example.com>",
          reply_to: "support@example.com",
        },
      },
    };
  }
  if (url.pathname === "/v1/admin/plugins") {
    return { list: [visualPlugin], total: 1 };
  }
  if (url.pathname.endsWith("/traffic-insights/manifest")) {
    return {
      name: visualPlugin.name,
      version: visualPlugin.version,
      description: visualPlugin.description,
      author: visualPlugin.author,
      main: "traffic-insights.wasm",
      permissions: visualPlugin.permissions,
    };
  }
  if (url.pathname.endsWith("/traffic-insights/health")) {
    return {
      name: visualPlugin.name,
      status: "running",
      ready: true,
      pool_size: 4,
      async_in_flight: 1,
      async_limit: 32,
      registered_route: 1,
    };
  }
  if (url.pathname.endsWith("/traffic-insights/routes")) {
    return [
      {
        PluginName: visualPlugin.name,
        Method: "GET",
        Path: "/admin/traffic-insights",
        Handler: "handleInsights",
        Middleware: ["admin-auth"],
      },
    ];
  }
  if (url.pathname.endsWith("/traffic-insights/middlewares")) {
    return [
      {
        PluginName: visualPlugin.name,
        Name: "admin-auth",
        Handler: "requireAdmin",
      },
    ];
  }
  if (url.pathname.endsWith("/traffic-insights/events")) {
    return [
      {
        PluginName: visualPlugin.name,
        Event: "server.traffic.reported",
        Handler: "recordTraffic",
      },
    ];
  }
  if (url.pathname.endsWith("/v1/admin/subscribe/list")) {
    return { count: 1, list: [visualSubscribe], total: 1 };
  }
  if (url.pathname.endsWith("/v1/admin/order/list")) {
    return { count: 1, list: [visualOrder], total: 1 };
  }
  if (url.pathname.endsWith("/v1/admin/coupon/list")) {
    return { count: 1, list: [visualCoupon], total: 1 };
  }
  if (url.pathname.endsWith("/v1/admin/announcement/list")) {
    return { count: 1, list: [visualAnnouncement], total: 1 };
  }
  if (url.pathname.endsWith("/v1/admin/document/list")) {
    return { count: 1, list: [visualDocument], total: 1 };
  }
  if (url.pathname.endsWith("/v1/admin/ticket/list")) {
    return { count: 1, list: [visualTicket], total: 1 };
  }
  if (url.pathname.endsWith("/v1/admin/ticket/detail")) return visualTicket;
  if (url.pathname.endsWith("/v1/admin/payment/list")) {
    return { count: 1, list: [visualPayment], total: 1 };
  }
  if (url.pathname.endsWith("/v1/admin/payment/platform")) {
    return {
      list: [
        {
          platform: "stripe",
          platform_field_description: { secret_key: "Secret key" },
          platform_url: "https://stripe.com",
        },
      ],
    };
  }
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
  await page.clock.setFixedTime(new Date("2026-08-24T12:00:00.000Z"));
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

  test("coupon business template and editor", async ({ page }) => {
    await preparePage(page, true);
    await page.goto("/#/dashboard/coupon");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { level: 1, name: "优惠券管理" })
    ).toBeVisible();
    await expect(page.getByText("WELCOME10")).toBeVisible();
    await page.getByRole("button", { exact: true, name: "创建" }).click();
    await expect(
      page.getByRole("dialog", { name: "创建优惠券" })
    ).toBeVisible();
    await stabilizeVisuals(page);
    await expect(page).toHaveScreenshot("coupon-detail-sheet.png", {
      animations: "disabled",
      fullPage: false,
    });
  });

  test("document business template and editor", async ({ page }) => {
    await preparePage(page, true);
    await page.goto("/#/dashboard/document");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { level: 1, name: "文档列表" })
    ).toBeVisible();
    await expect(
      page.getByText("Getting started with your subscription")
    ).toBeVisible();
    await page.getByRole("button", { exact: true, name: "创建" }).click();
    await expect(page.getByRole("dialog", { name: "创建文档" })).toBeVisible();
    await stabilizeVisuals(page);
    await expect(page).toHaveScreenshot("document-detail-sheet.png", {
      animations: "disabled",
      fullPage: false,
    });
  });

  test("marketing business template and broadcast workflow", async ({
    page,
  }) => {
    await preparePage(page, true);
    await page.goto("/#/dashboard/marketing");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { level: 1, name: "营销运营" })
    ).toBeVisible();
    await page
      .getByRole("button", {
        exact: true,
        name: "邮件广播 创建新的邮件广播活动",
      })
      .click();
    await expect(page.getByRole("dialog", { name: "创建广播" })).toBeVisible();
    await stabilizeVisuals(page);
    await expect(page).toHaveScreenshot("marketing-broadcast-sheet.png", {
      animations: "disabled",
      fullPage: false,
    });
  });

  test("ticket business template and conversation", async ({ page }) => {
    await preparePage(page, true);
    await page.goto("/#/dashboard/ticket");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { level: 1, name: "工单列表" })
    ).toBeVisible();
    await expect(
      page.getByText("Unable to connect after renewal")
    ).toBeVisible();
    await page.getByRole("button", { exact: true, name: "回复" }).click();
    await expect(
      page.getByRole("dialog", { name: "Unable to connect after renewal" })
    ).toBeVisible();
    await stabilizeVisuals(page);
    await expect(page).toHaveScreenshot("ticket-conversation-sheet.png", {
      animations: "disabled",
      fullPage: false,
    });
  });

  test("payment business template and provider form", async ({ page }) => {
    await preparePage(page, true);
    await page.goto("/#/dashboard/payment");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { level: 1, name: "支付管理" })
    ).toBeVisible();
    await expect(page.getByText("Stripe Card")).toBeVisible();
    await page
      .getByRole("button", { exact: true, name: "添加支付方式" })
      .click();
    await expect(
      page.getByRole("dialog", { name: "添加支付方式" })
    ).toBeVisible();
    await stabilizeVisuals(page);
    await expect(page).toHaveScreenshot("payment-detail-sheet.png", {
      animations: "disabled",
      fullPage: false,
    });
  });

  test("server workspace and protocol editor", async ({ page }) => {
    await preparePage(page, true);
    await page.goto("/#/dashboard/servers");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { level: 1, name: "服务器" })
    ).toBeVisible();
    await expect(page.getByText("Hong Kong Edge 01")).toBeVisible();
    await page.getByRole("button", { exact: true, name: "创建" }).click();
    await expect(
      page.getByRole("dialog", { name: "创建服务器" })
    ).toBeVisible();
    await stabilizeVisuals(page);
    await expect(page).toHaveScreenshot("server-protocol-sheet.png", {
      animations: "disabled",
      fullPage: false,
    });
  });

  test("node workspace and endpoint editor", async ({ page }) => {
    await preparePage(page, true);
    await page.goto("/#/dashboard/nodes");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { level: 1, name: "节点" })
    ).toBeVisible();
    await expect(page.getByText("HK Premium Gateway")).toBeVisible();
    await page.getByRole("button", { exact: true, name: "创建" }).click();
    await expect(page.getByRole("dialog", { name: "创建节点" })).toBeVisible();
    await stabilizeVisuals(page);
    await expect(page).toHaveScreenshot("node-endpoint-sheet.png", {
      animations: "disabled",
      fullPage: false,
    });
  });

  test("subscription delivery workspace and client editor", async ({
    page,
  }) => {
    await preparePage(page, true);
    await page.goto("/#/dashboard/subscribe");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { level: 1, name: "订阅配置" })
    ).toBeVisible();
    await expect(page.getByText("Clash Meta")).toBeVisible();
    await page.getByRole("button", { exact: true, name: "添加" }).click();
    await expect(
      page.getByRole("dialog", { name: "添加客户端" })
    ).toBeVisible();
    await stabilizeVisuals(page);
    await expect(page).toHaveScreenshot("subscription-client-sheet.png", {
      animations: "disabled",
      fullPage: false,
    });
  });

  test("product composition workspace and plan editor", async ({ page }) => {
    await preparePage(page, true);
    await page.goto("/#/dashboard/product");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { level: 1, name: "商品管理" })
    ).toBeVisible();
    await expect(page.getByText("Pro Annual")).toBeVisible();
    await page.getByRole("button", { exact: true, name: "创建" }).click();
    await expect(page.getByRole("dialog", { name: "创建订阅" })).toBeVisible();
    await stabilizeVisuals(page);
    await expect(page).toHaveScreenshot("product-composition-sheet.png", {
      animations: "disabled",
      fullPage: false,
    });
  });

  test("authentication workspace and channel configuration", async ({
    page,
  }) => {
    await preparePage(page, true);
    await page.goto("/#/dashboard/auth-control");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { level: 1, name: "认证方式" })
    ).toBeVisible();
    await page.getByText("邮箱设置", { exact: true }).click();
    await expect(page.getByRole("dialog", { name: "邮箱设置" })).toBeVisible();
    await stabilizeVisuals(page);
    await expect(page).toHaveScreenshot("authentication-channel-sheet.png", {
      animations: "disabled",
      fullPage: false,
    });
  });

  test("plugin lifecycle workspace and runtime detail", async ({ page }) => {
    await preparePage(page, true);
    await page.goto("/#/dashboard/plugin");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { level: 1, name: "插件" })
    ).toBeVisible();
    await expect(page.getByText("traffic-insights")).toBeVisible();
    await page.getByRole("button", { exact: true, name: "详情" }).click();
    await expect(
      page.getByRole("dialog", { name: "traffic-insights" })
    ).toBeVisible();
    await stabilizeVisuals(page);
    await expect(page).toHaveScreenshot("plugin-runtime-sheet.png", {
      animations: "disabled",
      fullPage: false,
    });
  });

  test("observability workspace refresh control and record detail", async ({
    page,
  }) => {
    await preparePage(page, true);
    await page.goto("/#/dashboard/log/login");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { level: 1, name: "登录日志" })
    ).toBeVisible();

    await page.getByRole("button", { name: "每 30 秒" }).click();
    await page.getByRole("menuitemradio", { name: "每 15 秒" }).click();
    await expect(page.getByRole("button", { name: "每 15 秒" })).toBeVisible();

    await page.getByRole("button", { name: "查看详情" }).click();
    await expect(
      page.getByRole("dialog", { name: "记录详情 #705" })
    ).toBeVisible();
    await stabilizeVisuals(page);
    await expect(page).toHaveScreenshot("log-record-detail-sheet.png", {
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
