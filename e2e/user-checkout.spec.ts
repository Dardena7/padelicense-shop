import { test, expect } from "@playwright/test";
import { fillStripeCardAndPay } from "./helpers/stripe";
import { simulatePaymentSucceeded } from "./helpers/simulate-webhook";
import { clickAndWaitForURL } from "./helpers/navigation";

const TEST_PASSWORD = "Password123!";
const uniqueEmail = () => `checkout-${Date.now()}@e2e-test.com`;

test.describe("User checkout (guest → signup → checkout → verify order)", () => {
  test("add to cart as guest, signup, checkout with saved address, verify order", async ({
    page,
  }) => {
    const email = uniqueEmail();

    // --- Add first product as guest ---
    await page.goto("/en/products/head-speed-pro");
    await page
      .getByRole("button", { name: "Add to cart" })
      .click({ timeout: 15000 });
    await expect(page.getByText("Added!")).toBeVisible();

    // --- Add second product ---
    await page.goto("/en/products/asics-gel-padel-pro-5");
    await page.getByRole("button", { name: "Add to cart" }).click();
    await expect(page.getByText("Added!")).toBeVisible();

    // Badge should show 2
    await expect(
      page.getByRole("link", { name: /Cart/ }).getByText("2"),
    ).toBeVisible();

    // --- Signup (cart should be claimed) ---
    await clickAndWaitForURL(
      page,
      page.getByRole("link", { name: "Log in" }),
      /\/login/,
    );
    await clickAndWaitForURL(
      page,
      page.getByRole("link", { name: "Sign up" }),
      /\/signup/,
    );

    await page.getByLabel("First name").fill("Jane");
    await page.getByLabel("Last name").fill("Smith");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(TEST_PASSWORD);
    await page.getByLabel("Confirm password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Create account" }).click();

    // Should redirect to home
    await expect(page).toHaveURL(/\/en$/, { timeout: 10000 });
    await expect(page.getByRole("link", { name: "Account" })).toBeVisible({
      timeout: 10000,
    });

    // Cart should still have 2 items (claimed from guest)
    await expect(
      page.getByRole("link", { name: /Cart/ }).getByText("2"),
    ).toBeVisible({ timeout: 10000 });

    // --- Create an address via account ---
    await clickAndWaitForURL(
      page,
      page.getByRole("link", { name: "Account" }),
      /\/account/,
    );
    await page.getByRole("button", { name: "My addresses" }).click();
    await page.getByRole("button", { name: "Add address" }).click();
    await page.getByLabel("Label (optional)").fill("Home");
    await page.getByLabel("Address line 1").fill("Grand Place 1");
    await page.getByLabel("City").fill("Bruxelles");
    await page.getByLabel("Postal code").fill("1000");
    await page.getByLabel("Country").selectOption("BE");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Grand Place 1")).toBeVisible();

    // --- Go to checkout ---
    await clickAndWaitForURL(
      page,
      page.getByRole("link", { name: /Cart/ }),
      /\/cart/,
    );
    await clickAndWaitForURL(
      page,
      page.getByRole("link", { name: "Proceed to checkout" }),
      /\/checkout/,
    );
    await expect(page.getByRole("heading", { name: "Checkout" })).toBeVisible();

    // --- Should show saved address, no email field ---
    await expect(page.getByText("Grand Place 1")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Use this address" }),
    ).toBeVisible();
    await expect(page.getByLabel("Email")).not.toBeVisible();

    // --- Use saved address ---
    await page.getByRole("button", { name: "Use this address" }).click();

    // --- Fill card and pay ---
    await fillStripeCardAndPay(page);

    // --- Should redirect to confirmation ---
    await expect(
      page.getByRole("heading", { name: "Order confirmed!" }),
    ).toBeVisible({ timeout: 20000 });
    const orderText = await page.getByText(/Order #PAD-/).textContent();
    const orderNumber = orderText?.match(/PAD-[\w-]+/)?.[0];

    // --- Simulate webhook (CI only, in local stripe listen handles it) ---
    const url = new URL(page.url());
    const orderUuid = url.searchParams.get("uuid");
    if (orderUuid) {
      await simulatePaymentSucceeded(orderUuid);
    }

    // --- Verify order in account ---
    await clickAndWaitForURL(
      page,
      page.getByRole("link", { name: "Account" }),
      /\/account/,
    );
    await page.getByRole("button", { name: "My orders" }).click();

    await expect(page.getByText(`Order #${orderNumber}`)).toBeVisible();
    await expect(page.getByText("Paid")).toBeVisible();
    await expect(page.getByText("Head Speed Pro")).toBeVisible();

    // --- Click on order to see detail page ---
    await page.getByText(`Order #${orderNumber}`).click();
    await expect(page).toHaveURL(/\/account\/orders\//, { timeout: 10000 });

    // Order detail should show order info
    await expect(page.getByText(`Order #${orderNumber}`)).toBeVisible();
    await expect(page.getByText("Grand Place 1")).toBeVisible();
    await expect(page.getByText("Head Speed Pro")).toBeVisible();
    await expect(page.getByText("Asics Gel-Padel Pro 5")).toBeVisible();
  });
});
