import { expect, test } from "@playwright/test";

test("UI Lab renders tokens, components, and preferences", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-08-24T12:00:00.000Z"));
  test.setTimeout(60_000);
  await page.addInitScript(() => {
    window.localStorage.setItem("language", "zh-CN");
    document.cookie = "theme=light; path=/";
    document.cookie = "density=comfortable; path=/";
  });

  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.protocol.startsWith("http") && url.hostname !== "127.0.0.1") {
      await route.abort();
      return;
    }
    await route.continue();
  });

  await page.route("**/v1/**", async (route) => {
    await route.fulfill({
      body: JSON.stringify({
        code: 0,
        data: {
          site: {
            site_name: "Perfect Panel UI Lab",
            site_desc: "Design system verification",
            site_logo: "/favicon.svg",
            keywords: "",
          },
        },
        msg: "ok",
      }),
      contentType: "application/json",
      status: 200,
    });
  });

  await page.goto("/#/ui-lab");
  await page.waitForLoadState("networkidle");
  await expect(
    page.getByRole("heading", { level: 1, name: "Perfect Panel UI Lab" })
  ).toBeVisible();

  await expect(page).toHaveScreenshot("ui-lab-light-comfortable.png", {
    animations: "disabled",
    fullPage: true,
  });

  await page.getByRole("button", { exact: true, name: "新建节点" }).click();
  const detailSheet = page.getByRole("dialog", { name: "编辑节点" });
  await expect(detailSheet).toBeVisible();
  await expect(page).toHaveScreenshot("ui-lab-detail-sheet.png", {
    animations: "disabled",
    fullPage: false,
  });
  await detailSheet.getByRole("button", { exact: true, name: "取消" }).click();

  await page.getByRole("button", { exact: true, name: "深色" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { exact: true, name: "紧凑" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-density", "compact");

  await expect(page).toHaveScreenshot("ui-lab-dark-compact.png", {
    animations: "disabled",
    fullPage: true,
  });
});
