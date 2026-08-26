import { test, expect } from "@playwright/test";
import { site } from "../content/site";

test.describe("single-page sections", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders every section's copy in order", async ({ page }) => {
    // Hero: vectorized monogram (CSS-masked, exposed as role="img") + H1.
    await expect(
      page.getByRole("main").getByRole("img", { name: site.name }).first()
    ).toBeVisible();
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

  test("the principals section shows all five leaders in order, with photos and titles", async ({
    page,
  }) => {
    const section = page.locator("section", {
      has: page.locator("#principals-heading"),
    });
    // exact order: CEO → General Counsel → President → COO → CFO
    await expect(section.getByRole("heading", { level: 3 })).toHaveText(
      site.principals.items.map((p) => p.name)
    );
    for (const person of site.principals.items) {
      await expect(section.getByRole("img", { name: person.name })).toBeAttached();
      if (person.role) {
        await expect(section.getByText(person.role)).toBeAttached();
      }
    }
  });

  test("bios stay hidden until the Biography toggle expands them (aria-expanded flips)", async ({
    page,
  }) => {
    const section = page.locator("section", {
      has: page.locator("#principals-heading"),
    });
    const toggles = section.getByRole("button", { name: "Biography" });
    await expect(toggles).toHaveCount(site.principals.items.length);
    for (const [i, person] of site.principals.items.entries()) {
      const toggle = toggles.nth(i);
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      // Collapsed: the disclosure region is clipped to zero height (the
      // grid-rows 0fr technique) and aria-hidden. Playwright's visibility
      // heuristic can't see overflow clipping, so assert the box directly.
      const regionId = await toggle.getAttribute("aria-controls");
      const region = page.locator(`[id="${regionId}"]`);
      await toggle.scrollIntoViewIfNeeded();
      expect((await region.boundingBox())!.height).toBeLessThan(1);
      await expect(region.locator("[aria-hidden]")).toHaveAttribute(
        "aria-hidden",
        "true"
      );
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(region.locator("[aria-hidden]")).toHaveAttribute(
        "aria-hidden",
        "false"
      );
      for (const para of person.bio) {
        await expect(page.getByText(para)).toBeVisible();
      }
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

  test("mobile viewport renders the full page; principals stack 1-col with tappable toggles", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("form", { name: /private inquiry/i })).toBeAttached();
    const section = page.locator("section", {
      has: page.locator("#principals-heading"),
    });
    // 1-col grid on phones: the first two cards sit at the same x, stacked
    const first = await section
      .getByRole("heading", { level: 3 })
      .nth(0)
      .boundingBox();
    const second = await section
      .getByRole("heading", { level: 3 })
      .nth(1)
      .boundingBox();
    expect(first!.x).toBeCloseTo(second!.x, 0);
    expect(second!.y).toBeGreaterThan(first!.y);
    // 44px minimum touch target on the Biography toggle
    const toggle = await section
      .getByRole("button", { name: "Biography" })
      .first()
      .boundingBox();
    expect(toggle!.height).toBeGreaterThanOrEqual(44);
  });
});
