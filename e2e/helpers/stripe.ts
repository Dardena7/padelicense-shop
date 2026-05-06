import { Page, expect } from "@playwright/test";

export const fillStripeCardAndPay = async (page: Page) => {
  await expect(page.getByText("Payment")).toBeVisible({ timeout: 15000 });

  // Wait for Stripe to render payment methods
  await page.waitForTimeout(5000);

  // Find the accessory-target frame (contains accordion + card inputs)
  const paymentFrame = page.frames().find((f) => f.url().includes("elements-inner-accessory-target"));
  if (!paymentFrame) throw new Error("Stripe payment frame not found");

  // Click on Card accordion button
  await paymentFrame.locator('[data-value="card"][role="button"]').click();

  // Wait for card fields to render
  await paymentFrame.locator("#payment-numberInput").waitFor({ timeout: 10000 });

  // Fill test card
  await paymentFrame.locator("#payment-numberInput").fill("4242424242424242");
  await paymentFrame.locator("#payment-expiryInput").fill("1230");
  await paymentFrame.locator("#payment-cvcInput").fill("123");

  // Close Stripe Link popup
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // Submit payment (dispatchEvent bypasses Stripe overlay)
  await page.getByTestId("pay-button").dispatchEvent("click");
};
