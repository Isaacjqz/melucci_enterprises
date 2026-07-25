import { test, expect } from "@playwright/test";
import { site } from "../content/site";

test.describe("single-page sections", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders every section's copy in order", async ({ page }) => {
    await expect(page.getByText(site.masthead)).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      site.hero.heading
    );
    for (const text of [
      site.principal.body,
      site.bridge.body,
      site.about.body,
      site.approach.approach,
      site.approach.reputation,
      site.confidential.body,
    ]) {
      await expect(page.getByText(text)).toBeAttached();
    }
    for (const mandate of site.mandates.items) {
      await expect(page.getByRole("listitem").filter({ hasText: mandate })).toBeAttached();
    }
    for (const service of site.services.items) {
      await expect(
        page.getByRole("heading", { level: 3, name: service.title })
      ).toBeAttached();
      await expect(page.getByText(service.body)).toBeAttached();
    }
  });

  test("hero link and #contact anchor reach the inquiry form", async ({ page }) => {
    await page.getByRole("main").getByRole("link", { name: /private inquiries/i }).click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.getByRole("form", { name: /private inquiry/i })).toBeVisible();
  });

  test("confidential band uses the inverted panel", async ({ page }) => {
    const band = page.locator("section.bg-ink-panel");
    await expect(band).toHaveCount(1);
    await expect(band).toContainText(site.confidential.body);
  });

  test("no secrets or env values leak into rendered HTML", async ({ page }) => {
    const html = await page.content();
    expect(html).not.toMatch(/RESEND_API_KEY|re_[A-Za-z0-9]{8,}|INQUIRY_TEST_MODE/);
  });

  test("mobile viewport renders the full page", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("form", { name: /private inquiry/i })).toBeAttached();
  });
});
