import { test, expect } from "@playwright/test";
import { site } from "../content/site";

test("/ responds 200 and renders the hero <h1>", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    site.hero.heading
  );
});

test("/privacy responds 200 and renders its <h1>", async ({ page }) => {
  const response = await page.goto("/privacy");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Privacy");
});

test("security headers are present", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();
  expect(headers["content-security-policy"]).toContain("default-src 'self'");
  expect(headers["strict-transport-security"]).toContain("max-age=");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toContain("camera=()");
});

test("layout shows masthead wordmark and footer inquiries link", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("banner")).toContainText(site.name);
  await expect(
    page.getByRole("contentinfo").getByRole("link", { name: site.inquiries.label })
  ).toBeVisible();
});
