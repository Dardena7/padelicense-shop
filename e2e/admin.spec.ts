import { test, expect } from "@playwright/test";
import { clickAndWaitForURL } from "./helpers/navigation";

const ADMIN_EMAIL = "admin@padelicense.com";
const ADMIN_PASSWORD = "password123";
const CUSTOMER_PASSWORD = "Password123!";
const uniqueEmail = () => `admin-e2e-${Date.now()}@e2e-test.com`;

test.describe("Admin back-office", () => {
  test("guard, role check, admin access, and sidebar navigation", async ({
    page,
  }) => {
    // --- 1. Try to access admin without being logged in ---
    await page.goto("/en/admin");

    // AdminGuard redirects to login
    await expect(page).toHaveURL(/\/en\/login/, { timeout: 10000 });

    // --- 2. Sign up as a regular customer ---
    const customerEmail = uniqueEmail();

    await clickAndWaitForURL(
      page,
      page.getByRole("link", { name: "Sign up" }),
      /\/signup/,
    );
    await page.getByLabel("First name").fill("Customer");
    await page.getByLabel("Last name").fill("Test");
    await page.getByLabel("Email").fill(customerEmail);
    await page.getByLabel("Password", { exact: true }).fill(CUSTOMER_PASSWORD);
    await page.getByLabel("Confirm password").fill(CUSTOMER_PASSWORD);
    await page.getByRole("button", { name: "Create account" }).click();

    // Should redirect to home after signup
    await expect(page).toHaveURL(/\/en$/, { timeout: 10000 });
    await expect(page.getByRole("link", { name: "Account" })).toBeVisible({
      timeout: 10000,
    });

    // Customer should NOT see the Admin link in navbar
    await expect(page.getByRole("link", { name: "Admin" })).not.toBeVisible();

    // --- 3. Try to access admin as customer → unauthorized ---
    await page.goto("/en/admin");

    await expect(
      page.getByText("You must be an admin to access this page."),
    ).toBeVisible({ timeout: 10000 });

    // --- 4. Go back to shop and logout ---
    await page.goto("/en");
    await clickAndWaitForURL(
      page,
      page.getByRole("link", { name: "Account" }),
      /\/account/,
    );
    await page.getByRole("button", { name: "Log out" }).click();

    // Should redirect to home, show login link
    await expect(page.getByRole("link", { name: "Log in" })).toBeVisible({
      timeout: 10000,
    });

    // --- 5. Login as admin ---
    await clickAndWaitForURL(
      page,
      page.getByRole("link", { name: "Log in" }),
      /\/login/,
    );
    await page.getByLabel("Email").fill(ADMIN_EMAIL);
    await page.getByLabel("Password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Log in" }).click();

    // Should redirect to home
    await expect(page).toHaveURL(/\/en$/, { timeout: 10000 });

    // Admin should see the Admin link in navbar
    const adminLink = page.getByRole("link", { name: "Admin" });
    await expect(adminLink).toBeVisible({ timeout: 10000 });

    // --- 6. Navigate to admin dashboard ---
    await clickAndWaitForURL(page, adminLink, /\/admin/);

    await expect(
      page.getByRole("heading", { name: "Dashboard" }),
    ).toBeVisible();

    // Verify sidebar is present
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Products" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Categories" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Orders" })).toBeVisible();

    // Verify header shows admin name
    await expect(page.getByText("Admin Padelicense")).toBeVisible();

    // --- 7. Verify dashboard data loaded ---
    await expect(page.getByText("Revenue today")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Revenue this week")).toBeVisible();
    await expect(page.getByText("Revenue this month")).toBeVisible();
    await expect(page.getByText("Total orders")).toBeVisible();
    await expect(page.getByText("Recent orders")).toBeVisible();
    await expect(page.getByText("Low stock alerts")).toBeVisible();

    // Verify actual data from seeds
    // Recent orders table should have order numbers (PAD-YYYYMMDD-XXXX format)
    await expect(page.locator("text=/PAD-/").first()).toBeVisible();

    // Status badges should be present
    await expect(
      page.locator("text=/pending|paid|shipped|delivered/i").first(),
    ).toBeVisible();

    // Revenue should show € amounts (not €0.00 since seeds have orders)
    await expect(page.locator("text=/€[1-9]/").first()).toBeVisible();

    // --- 7. Navigate through all admin pages via sidebar ---
    await clickAndWaitForURL(
      page,
      page.getByRole("navigation").getByRole("link", { name: "Products" }),
      /\/admin\/products/,
    );
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();

    await clickAndWaitForURL(
      page,
      page.getByRole("navigation").getByRole("link", { name: "Categories" }),
      /\/admin\/categories/,
    );
    await expect(
      page.getByRole("heading", { name: "Categories" }),
    ).toBeVisible();

    await clickAndWaitForURL(
      page,
      page.getByRole("navigation").getByRole("link", { name: "Orders" }),
      /\/admin\/orders/,
    );
    await expect(page.getByRole("heading", { name: "Orders" })).toBeVisible();

    // --- 8. Verify orders list loaded ---
    // Should show the "All" filter button as active
    await expect(page.getByRole("button", { name: "All" })).toBeVisible();

    // Should have order rows from seeds
    await expect(page.locator("text=/PAD-/").first()).toBeVisible({
      timeout: 10000,
    });

    // --- 9. Filter by status ---
    await page.getByRole("button", { name: "Paid" }).click();
    await expect(page.locator("text=/PAD-/").first()).toBeVisible({
      timeout: 10000,
    });

    // Reset filter
    await page.getByRole("button", { name: "All" }).click();

    // --- 10. Click on an order to see detail ---
    const firstOrderLink = page.locator("a[href*='/admin/orders/']").first();
    await firstOrderLink.click();
    await expect(page).toHaveURL(/\/admin\/orders\//, { timeout: 10000 });

    // Order detail should show order number, items, and shipping address
    await expect(page.locator("text=/PAD-/").first()).toBeVisible();
    await expect(page.getByText("Items")).toBeVisible();
    await expect(page.getByText("Shipping address")).toBeVisible();

    // --- 11. Navigate back to dashboard ---
    await clickAndWaitForURL(
      page,
      page.getByRole("navigation").getByRole("link", { name: "Dashboard" }),
      /\/en\/admin$/,
    );
    await expect(
      page.getByRole("heading", { name: "Dashboard" }),
    ).toBeVisible();
  });
});
