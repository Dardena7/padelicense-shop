import { test, expect } from "@playwright/test";
import { fillStripeCardAndPay } from "./helpers/stripe";
import { clickAndWaitForURL } from "./helpers/navigation";

test.describe("Guest checkout", () => {
  test("add products, modify cart, checkout as guest, pay, confirm", async ({
    page,
  }) => {
    // --- Add first product ---
    await page.goto("/en/products/head-speed-pro");
    await page.getByRole("button", { name: "Add to cart" }).click();
    await expect(page.getByText("Added!")).toBeVisible();

    // --- Add second product ---
    await page.goto("/en/products/bullpadel-overgrip-pack");
    await page.getByRole("button", { name: "Add to cart" }).click();
    await expect(page.getByText("Added!")).toBeVisible();

    // Badge should show 2
    await expect(
      page.getByRole("link", { name: /Cart/ }).getByText("2"),
    ).toBeVisible();

    // --- Go to cart ---
    await clickAndWaitForURL(
      page,
      page.getByRole("link", { name: /Cart/ }),
      /\/cart/,
    );
    await expect(
      page.getByRole("heading", { name: "Your cart" }),
    ).toBeVisible();
    await expect(page.getByTestId("cart-item")).toHaveCount(2);

    // --- Increase quantity of Head Speed Pro ---
    const headSpeedRow = page
      .getByTestId("cart-item")
      .filter({ hasText: "Head Speed Pro" });
    await expect(headSpeedRow.getByTestId("cart-item-quantity")).toHaveText(
      "1",
    );
    await headSpeedRow.getByTestId(/cart-item-increase/).click();
    await expect(headSpeedRow.getByTestId("cart-item-quantity")).toHaveText(
      "2",
      { timeout: 10000 },
    );

    // --- Remove Bullpadel Overgrip ---
    const overgripRow = page
      .getByTestId("cart-item")
      .filter({ hasText: "Bullpadel Overgrip" });
    await overgripRow.getByRole("button", { name: "Remove" }).click();
    await expect(page.getByTestId("cart-item")).toHaveCount(1);

    // --- Proceed to checkout ---
    await clickAndWaitForURL(
      page,
      page.getByRole("link", { name: "Proceed to checkout" }),
      /\/checkout/,
    );
    await expect(
      page.getByRole("heading", { name: "Checkout" }),
    ).toBeVisible();

    // --- Fill guest email + address ---
    await page.getByLabel("Email").fill("guest-checkout@e2e-test.com");
    await page.getByLabel("Address line 1").fill("Test Street 42");
    await page.getByLabel("City").fill("Antwerp");
    await page.getByLabel("Postal code").fill("2000");
    await page.getByLabel("Country").selectOption("BE");

    // --- Submit address (creates order + shows Stripe) ---
    await page.getByRole("button", { name: /Pay/ }).click();

    // --- Fill card and pay ---
    await fillStripeCardAndPay(page);

    // --- Should redirect to confirmation ---
    await expect(
      page.getByRole("heading", { name: "Order confirmed!" }),
    ).toBeVisible({ timeout: 20000 });
    await expect(page.getByText(/Order #PAD-/)).toBeVisible();

    // Cart should be empty
    await clickAndWaitForURL(
      page,
      page.getByRole("link", { name: /Cart/ }),
      /\/cart/,
    );
    await expect(page.getByText("Your cart is empty")).toBeVisible();
  });
});
