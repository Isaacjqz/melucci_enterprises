import { test, expect } from "@playwright/test";

// The Playwright web server runs with INQUIRY_TEST_MODE=1: the API route
// validates and rate-limits normally but stubs out Resend delivery, and
// reports `delivered` so the honeypot drop is observable.

const fillForm = async (
  page: import("@playwright/test").Page,
  overrides: Partial<Record<"firstName" | "lastName" | "email" | "phone" | "message", string>> = {}
) => {
  const values = {
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    phone: "+1 212 555 0100",
    message: "I would like to discuss a defined mandate.",
    ...overrides,
  };
  await page.getByLabel("First name").fill(values.firstName);
  await page.getByLabel("Last name").fill(values.lastName);
  await page.getByLabel(/^Email/).fill(values.email);
  await page.getByLabel(/^Phone/).fill(values.phone);
  await page.getByLabel(/^Message/).fill(values.message);
};

test.describe("private inquiry form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#contact");
  });

  test("happy path submits and shows the confidential confirmation", async ({
    page,
  }) => {
    await fillForm(page);
    const [response] = await Promise.all([
      page.waitForResponse("**/api/inquiry"),
      page.getByRole("button", { name: /submit inquiry/i }).click(),
    ]);
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ ok: true, delivered: true });
    await expect(page.getByText("Thank you.")).toBeVisible();
    await expect(
      page.getByText(/reviewed with discretion/i)
    ).toBeVisible();
  });

  test("client-side validation blocks an empty submit", async ({ page }) => {
    await page.getByRole("button", { name: /submit inquiry/i }).click();
    await expect(page.getByRole("alert").first()).toBeVisible();
    await expect(page.getByText("Thank you.")).not.toBeVisible();
  });

  test("invalid email is rejected by the server too", async ({ page }) => {
    // Bypass client-side validation by posting directly.
    const response = await page.request.post("/api/inquiry", {
      data: {
        firstName: "Ada",
        lastName: "Lovelace",
        email: "not-an-email",
        message: "I would like to discuss a defined mandate.",
        company: "",
      },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.fields.email).toBeTruthy();
    // No submitted values echoed back.
    expect(JSON.stringify(body)).not.toContain("not-an-email");
  });

  test("honeypot submissions are silently dropped", async ({ page }) => {
    const response = await page.request.post("/api/inquiry", {
      data: {
        firstName: "Bot",
        lastName: "Bot",
        email: "bot@example.com",
        message: "Automated spam message content here.",
        company: "Spam Corp",
      },
    });
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ ok: true, delivered: false });
  });

  test("GET is not allowed on the inquiry endpoint", async ({ page }) => {
    const response = await page.request.get("/api/inquiry");
    expect(response.status()).toBe(405);
  });

  test("rate limiting kicks in after repeated posts", async ({ page }) => {
    // 5 allowed per 10 min per IP; these direct posts share the webserver IP
    // with other tests, so simulate a distinct client via X-Forwarded-For.
    const headers = { "X-Forwarded-For": "203.0.113.77" };
    const data = {
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      message: "I would like to discuss a defined mandate.",
      company: "",
    };
    let limited = false;
    for (let i = 0; i < 6; i++) {
      const response = await page.request.post("/api/inquiry", { data, headers });
      if (response.status() === 429) {
        limited = true;
        break;
      }
    }
    expect(limited).toBe(true);
  });
});
