import { test, expect } from "@playwright/test";
import { site } from "../content/site";

// The signature hero: plays on every page load (it IS the introduction),
// skippable, and renders its finished state for reduced-motion visitors. The
// section exposes data-hero-state ("static" → "playing" → "done") for
// determinism, and a scroll cue appears once the animation settles.

const hero = (page: import("@playwright/test").Page) =>
  page.locator("section[data-hero-state]");

test.describe("signature hero", () => {
  test("plays on load; a tap skips to the finished state and shows the scroll cue", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(hero(page)).toHaveAttribute("data-hero-state", "playing", {
      timeout: 15_000,
    });
    // a tap anywhere skips
    await page.mouse.down();
    await expect(hero(page)).toHaveAttribute("data-hero-state", "done");
    // finished state: mark canvas exposed as the brand image + full wordmark
    await expect(
      page.getByRole("main").getByRole("img", { name: site.name }).first()
    ).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      site.hero.heading
    );
    // the cue invites the scroll and actually performs it
    const cue = page.getByRole("button", { name: /scroll to introduction/i });
    await expect(cue).toBeVisible();
    await cue.click();
    await expect
      .poll(() => page.evaluate(() => window.scrollY), { timeout: 5_000 })
      .toBeGreaterThan(100);
  });

  test("replays on every visit: a reload starts the animation again", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(hero(page)).toHaveAttribute("data-hero-state", "playing", {
      timeout: 15_000,
    });
    await page.mouse.down();
    await expect(hero(page)).toHaveAttribute("data-hero-state", "done");
    await page.reload();
    await expect(hero(page)).toHaveAttribute("data-hero-state", "playing", {
      timeout: 15_000,
    });
  });

  test("prefers-reduced-motion renders the finished hero without animating", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(hero(page)).toHaveAttribute("data-hero-state", "done", {
      timeout: 15_000,
    });
    // never passed through "playing": letters are fully visible
    const firstLetter = page.locator("[data-ch]").first();
    await expect(firstLetter).toHaveCSS("opacity", "1");
  });

  test("page content below the hero is server-rendered regardless of animation", async ({
    page,
  }) => {
    // fetch raw HTML — no JS execution at all
    const res = await page.request.get("/");
    const html = await res.text();
    expect(html).toContain(site.hero.heading);
    expect(html).toContain(site.name);
    expect(html).toContain(site.principal.body);
    expect(html).toContain(site.confidential.body);
    // SSR ships the veiled state, so the wordmark cannot paint unpositioned
    // at the top of the band before hydration
    expect(html).toContain('data-hero-state="static"');
  });

  test("without JavaScript the noscript style lifts the hero veil", async ({
    browser,
  }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCSS(
      "opacity",
      "1"
    );
    await ctx.close();
  });
});
