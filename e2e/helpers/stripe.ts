import { Page, expect } from "@playwright/test";

export const fillStripeCardAndPay = async (page: Page) => {
  await expect(page.getByText("Payment")).toBeVisible({ timeout: 15000 });

  // Wait for the Stripe accessory-target frame to appear (not a fixed timeout)
  await page.waitForFunction(
    () => {
      const frames = document.querySelectorAll("iframe");
      return Array.from(frames).some((f) =>
        f.src.includes("elements-inner-accessory-target"),
      );
    },
    { timeout: 20000 },
  );

  // Find the accessory-target frame
  const paymentFrame = page
    .frames()
    .find((f) => f.url().includes("elements-inner-accessory-target"));
  if (!paymentFrame) throw new Error("Stripe payment frame not found");

  // Click on Card accordion button
  await paymentFrame
    .locator('[data-value="card"][role="button"]')
    .click({ timeout: 10000 });

  // Wait for card fields to render
  await paymentFrame
    .locator("#payment-numberInput")
    .waitFor({ timeout: 10000 });

  // Fill test card
  await paymentFrame.locator("#payment-numberInput").fill("4242424242424242");
  await paymentFrame.locator("#payment-expiryInput").fill("1230");
  await paymentFrame.locator("#payment-cvcInput").fill("123");

  // Fill ZIP code if visible (Stripe shows it for US-based IPs, e.g. GitHub Actions runners)
  const zipInput = paymentFrame.locator("#payment-postalCodeInput");
  if ((await zipInput.count()) > 0) {
    await zipInput.fill("10001");
  }

  // Close Stripe Link popup
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1000);

  // Submit payment (dispatchEvent bypasses Stripe overlay)
  await page.getByTestId("pay-button").dispatchEvent("click");
};
