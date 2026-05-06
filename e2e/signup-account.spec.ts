import { test, expect } from "@playwright/test";
import { cleanupTestData } from "./helpers/cleanup";

const TEST_EMAIL = "signup-test@e2e-test.com";
const TEST_PASSWORD = "Password123!";

test.describe("Signup + Account management", () => {
  test.beforeAll(() => {
    cleanupTestData();
  });

  test("signup, manage addresses, change default", async ({ page }) => {
    // --- Signup ---
    await page.goto("/en/signup");
    await page.getByLabel("First name").fill("John");
    await page.getByLabel("Last name").fill("Doe");
    await page.getByLabel("Email").fill(TEST_EMAIL);
    await page.getByLabel("Password", { exact: true }).fill(TEST_PASSWORD);
    await page.getByLabel("Confirm password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Create account" }).click();

    // Should redirect to home after signup
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.getByRole("link", { name: "Account" })).toBeVisible();

    // --- Navigate to account ---
    await page.getByRole("link", { name: "Account" }).click();
    await expect(page.getByRole("heading", { name: "My account" })).toBeVisible();
    await expect(page.getByText("John Doe")).toBeVisible();
    await expect(page.getByText(TEST_EMAIL)).toBeVisible();

    // --- Addresses tab (default) - empty ---
    await expect(page.getByText("No addresses saved yet.")).toBeVisible();

    // --- Add first address ---
    await page.getByRole("button", { name: "Add address" }).click();
    await page.getByLabel("Label (optional)").fill("Home");
    await page.getByLabel("Address line 1").fill("Rue de la Loi 1");
    await page.getByLabel("City").fill("Bruxelles");
    await page.getByLabel("Postal code").fill("1000");
    await page.getByLabel("Country").selectOption("BE");
    await page.getByRole("button", { name: "Save" }).click();

    // First address should be visible and default
    await expect(page.getByText("Home")).toBeVisible();
    await expect(page.getByText("Rue de la Loi 1")).toBeVisible();
    await expect(page.getByText("Default")).toBeVisible();

    // --- Add second address ---
    await page.getByRole("button", { name: "Add address" }).click();
    await page.getByLabel("Label (optional)").fill("Work");
    await page.getByLabel("Address line 1").fill("Avenue Louise 5");
    await page.getByLabel("City").fill("Bruxelles");
    await page.getByLabel("Postal code").fill("1050");
    await page.getByLabel("Country").selectOption("BE");
    await page.getByRole("button", { name: "Save" }).click();

    // Both addresses should be visible
    await expect(page.getByText("Home")).toBeVisible();
    await expect(page.getByText("Work")).toBeVisible();
    await expect(page.getByText("Avenue Louise 5")).toBeVisible();

    // --- Update second address (second Edit button) ---
    await page.getByRole("button", { name: "Edit" }).nth(1).click();
    await page.getByLabel("Address line 1").fill("Avenue Louise 10");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Avenue Louise 5")).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Avenue Louise 10")).toBeVisible();

    // --- Change default to second address ---
    const radios = page.getByRole("radio");
    await expect(radios).toHaveCount(2);
    await expect(radios.nth(0)).toBeChecked();
    await expect(radios.nth(1)).not.toBeChecked();

    // Click second radio to set Work as default
    await radios.nth(1).click();
    await expect(radios.nth(1)).toBeChecked();
    await expect(radios.nth(0)).not.toBeChecked();

    // --- Check orders tab ---
    await page.getByRole("button", { name: "My orders" }).click();
    await expect(page.getByText("No orders yet.")).toBeVisible();
  });
});
