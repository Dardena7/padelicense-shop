import { test, expect } from "@playwright/test";
import { clickAndWaitForURL } from "./helpers/navigation";

const ADMIN_EMAIL = "admin@padelicense.com";
const ADMIN_PASSWORD = "password123";
const CUSTOMER_PASSWORD = "Password123!";
const uniqueEmail = () => `admin-e2e-${Date.now()}@e2e-test.com`;
const uniqueSuffix = () => Date.now().toString().slice(-6);

test.describe("Admin back-office", () => {
  test("guard, role check, admin access, and sidebar navigation", async ({
    page,
  }) => {
    // Accept all confirm dialogs throughout the test
    page.on("dialog", (dialog) => dialog.accept());

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
    await expect(page.locator("text=/PAD-/").first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Items")).toBeVisible();
    await expect(page.getByText("Shipping address")).toBeVisible();

    // --- 11. Navigate to categories ---
    await clickAndWaitForURL(
      page,
      page.getByRole("navigation").getByRole("link", { name: "Categories" }),
      /\/admin\/categories/,
    );
    await expect(
      page.getByRole("heading", { name: "Categories" }),
    ).toBeVisible();

    // Should show seeded categories
    await expect(page.getByText("Rackets")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Balls")).toBeVisible();

    // --- 12. Create a new category ---
    await clickAndWaitForURL(
      page,
      page.getByRole("link", { name: "Add category" }),
      /\/admin\/categories\/new/,
    );
    await expect(
      page.getByRole("heading", { name: "New category" }),
    ).toBeVisible();

    // Fill EN fields (default tab)
    await page.getByLabel("Name").fill("Bags");
    await page.getByLabel("Slug").fill("bags");
    await page.getByLabel("Description").fill("Padel bags and backpacks");

    // Switch to FR tab and fill
    await page.getByRole("button", { name: "FR" }).click();
    await page.getByLabel("Name").fill("Sacs");
    await page.getByLabel("Slug").fill("sacs");
    await page.getByLabel("Description").fill("Sacs et sacs à dos de padel");

    // Switch to NL tab and fill
    await page.getByRole("button", { name: "NL" }).click();
    await page.getByLabel("Name").fill("Tassen");
    await page.getByLabel("Slug").fill("tassen");
    await page.getByLabel("Description").fill("Padel tassen en rugzakken");

    // Submit
    await page.getByRole("button", { name: "Save" }).click();

    // Should redirect to categories list with new category
    await expect(page).toHaveURL(/\/admin\/categories$/, { timeout: 10000 });
    await expect(page.getByText("Bags")).toBeVisible({ timeout: 10000 });

    // --- 13. Edit the category ---
    const bagsRow = page.getByText("Bags").locator("../..");
    await bagsRow.getByRole("link", { name: "Edit" }).click();
    await expect(page).toHaveURL(/\/admin\/categories\/.*\/edit/, {
      timeout: 10000,
    });

    // EN tab should be pre-filled
    await expect(page.getByLabel("Name")).toHaveValue("Bags");

    // Update the name
    await page.getByLabel("Name").fill("Bags & Cases");
    await page.getByRole("button", { name: "Save" }).click();

    // Should redirect to list with updated name
    await expect(page).toHaveURL(/\/admin\/categories$/, { timeout: 10000 });
    await expect(page.getByText("Bags & Cases")).toBeVisible({
      timeout: 10000,
    });

    // --- 14. Delete the category ---
    const updatedRow = page.getByText("Bags & Cases").locator("../..");
    await updatedRow.getByRole("button", { name: "Delete" }).click();

    // Category should disappear
    await expect(page.getByText("Bags & Cases")).not.toBeVisible({
      timeout: 10000,
    });

    // --- 15. Navigate to products ---
    await clickAndWaitForURL(
      page,
      page.getByRole("navigation").getByRole("link", { name: "Products" }),
      /\/admin\/products/,
    );
    await expect(
      page.getByRole("heading", { name: "Products" }),
    ).toBeVisible();

    // Should show seeded products
    await expect(page.getByText("Head Speed Pro")).toBeVisible({
      timeout: 10000,
    });

    // --- 16. Filter products by status ---
    await page.getByRole("button", { name: "Draft" }).click();
    await expect(page.getByText("Babolat Counter Viper")).toBeVisible({
      timeout: 10000,
    });

    // Reset filter
    await page.getByRole("button", { name: "All" }).click();

    // --- 16b. Search products ---
    await page.getByPlaceholder("Search products...").fill("Head Speed");
    await expect(page.getByText("Head Speed Pro")).toBeVisible({
      timeout: 10000,
    });
    // Other products should not be visible
    await expect(page.getByText("Bullpadel Vertex 04")).not.toBeVisible({
      timeout: 5000,
    });

    // Clear search
    await page.getByPlaceholder("Search products...").fill("");
    await expect(page.getByText("Bullpadel Vertex 04")).toBeVisible({
      timeout: 10000,
    });

    // --- 17. Create a new product ---
    await clickAndWaitForURL(
      page,
      page.getByRole("link", { name: "Add product" }),
      /\/admin\/products\/new/,
    );
    await expect(
      page.getByRole("heading", { name: "New product" }),
    ).toBeVisible();

    // Fill product fields
    const suffix = uniqueSuffix();
    const productName = `Test Product ${suffix}`;

    await page.getByLabel("Category").selectOption({ index: 1 });
    await page.getByLabel("Base price (cents)").fill("15990");
    await page.getByLabel("Brand").fill("TestBrand");

    // Fill EN translations (default tab)
    await page.getByLabel("Name").fill(productName);
    // Slug should auto-fill
    await expect(page.getByLabel("Slug")).toHaveValue(
      `test-product-${suffix}`,
    );

    // Switch to FR tab
    await page.getByRole("button", { name: "FR" }).click();
    await page.locator("#name-FR").fill(`Produit Test ${suffix}`);

    // Switch to NL tab
    await page.getByRole("button", { name: "NL" }).click();
    await page.locator("#name-NL").fill(`Test Product ${suffix} NL`);

    // Submit
    await page.getByRole("button", { name: "Save" }).click();

    // Should redirect to products list
    await expect(page).toHaveURL(/\/admin\/products(\?|$)/, { timeout: 10000 });
    await expect(page.getByText(`Test Product ${suffix}`)).toBeVisible({
      timeout: 10000,
    });

    // --- 18. Edit the product ---
    const productRow = page.getByText(`Test Product ${suffix}`).locator("../..");
    await productRow.getByRole("link", { name: "Edit" }).click();
    await expect(page).toHaveURL(/\/admin\/products\/.*\/edit/, {
      timeout: 10000,
    });

    // EN tab should be pre-filled
    await expect(page.getByLabel("Name")).toHaveValue(`Test Product ${suffix}`);

    // Update the brand
    await page.getByLabel("Brand").fill("UpdatedBrand");
    await page.getByRole("button", { name: "Save" }).click();

    // Should redirect to list
    await expect(page).toHaveURL(/\/admin\/products(\?|$)/, { timeout: 10000 });

    // --- 19. Go back to edit to manage variants ---
    const updatedProductRow = page
      .getByText(`Test Product ${suffix}`)
      .locator("../..");
    await updatedProductRow.getByRole("link", { name: "Edit" }).click();
    await expect(page).toHaveURL(/\/admin\/products\/.*\/edit/, {
      timeout: 10000,
    });

    // --- 20. Add a variant ---
    await page.getByText("Add variant").click();

    // Fill variant fields in the new row
    await page.getByPlaceholder("Name").fill("Large");
    await page.getByPlaceholder("SKU").fill(`TEST-E2E-${suffix}`);
    await page.getByPlaceholder("Stock").fill("10");

    await page.locator("tr").last().getByText("Save").click();

    // Variant should appear in the table
    await expect(page.getByText("Large")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(`TEST-E2E-${suffix}`)).toBeVisible();

    // --- 20b. Upload images ---
    // Create a test image buffer
    const testImageBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64",
    );

    // Upload first image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "test-image-1.png",
      mimeType: "image/png",
      buffer: testImageBuffer,
    });

    // Image should appear in the gallery
    await expect(page.locator("img[alt='']").first()).toBeVisible({
      timeout: 15000,
    });

    // Upload second image
    await fileInput.setInputFiles({
      name: "test-image-2.png",
      mimeType: "image/png",
      buffer: testImageBuffer,
    });

    // Should now have 2 images (plus the default seed images)
    await expect(page.locator(".group.relative").first()).toBeVisible({
      timeout: 15000,
    });

    // --- 20c. Reorder images via drag and drop ---
    const images = page.locator("[draggable='true']");
    const imageCount = await images.count();

    if (imageCount >= 2) {
      const firstImage = images.first();
      const secondImage = images.nth(1);
      await firstImage.dragTo(secondImage);
    }

    // --- 20d. Delete an image ---
    // Hover to reveal delete button, then click
    const firstImageCard = page.locator(".group.relative").first();
    await firstImageCard.hover();
    await firstImageCard.locator("button").click();

    // --- 21. Delete the product ---
    await clickAndWaitForURL(
      page,
      page.getByRole("navigation").getByRole("link", { name: "Products" }),
      /\/admin\/products/,
    );

    const productToDelete = page
      .getByText(`Test Product ${suffix}`)
      .locator("../..");
    await productToDelete.getByRole("button", { name: "Delete" }).click();

    await expect(page.getByText(`Test Product ${suffix}`)).not.toBeVisible({
      timeout: 10000,
    });

    // --- 22. Navigate back to dashboard ---
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
