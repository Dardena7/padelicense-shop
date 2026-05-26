import { test, expect } from "@playwright/test";

test.describe("Category pages", () => {
  test("navigate to category, see products, breadcrumb, and subcategories", async ({
    page,
  }) => {
    // --- 1. Navbar dropdown shows categories ---
    await page.goto("/en/products");
    await expect(page.getByRole("button", { name: "Categories" })).toBeVisible({
      timeout: 10000,
    });

    // Hover to open dropdown
    await page.getByRole("button", { name: "Categories" }).hover();
    await expect(page.locator("a[href*='/categories/']").first()).toBeVisible({
      timeout: 5000,
    });

    // --- 2. Navigate to a root category ---
    await page.goto("/en/categories/rackets");
    await expect(
      page.getByRole("heading", { name: "Rackets", level: 1 }),
    ).toBeVisible({ timeout: 10000 });

    // Breadcrumb should show Products > Rackets
    const breadcrumb = page.getByLabel("breadcrumb");
    await expect(breadcrumb.getByRole("link", { name: "Products" })).toBeVisible();

    // Should show products from this category and subcategories
    await expect(page.getByText("Head Speed Pro")).toBeVisible({
      timeout: 10000,
    });

    // --- 3. Subcategories should be navigable ---
    const subcategoryLinks = page.locator(
      "section a[href*='/categories/']",
    );
    const subcategoryCount = await subcategoryLinks.count();

    if (subcategoryCount > 0) {
      const firstSubcategory = subcategoryLinks.first();
      const subcategoryName = await firstSubcategory.locator("h3").textContent();
      await firstSubcategory.click();

      await expect(page).toHaveURL(/\/categories\//, { timeout: 10000 });

      // Breadcrumb should show Products > Rackets > subcategory
      await expect(
        page.getByRole("navigation", { name: "breadcrumb" }),
      ).toContainText("Rackets");

      if (subcategoryName) {
        await expect(
          page.getByRole("heading", { level: 1 }),
        ).toHaveText(subcategoryName.trim());
      }
    }

    // --- 4. Category filter on products page ---
    await page.goto("/en/products");
    await expect(page.getByText("Head Speed Pro")).toBeVisible({
      timeout: 10000,
    });

    // Select a category filter
    await page.locator("#categorySlug").selectOption("balls");
    await expect(page.getByText("Head Pro S")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Head Speed Pro")).not.toBeVisible({
      timeout: 5000,
    });

    // Reset filter
    await page.locator("#categorySlug").selectOption("");
    await expect(page.getByText("Head Speed Pro")).toBeVisible({
      timeout: 10000,
    });

    // --- 5. Product page breadcrumb ---
    await page.goto("/en/products/head-speed-pro");
    await expect(
      page.getByRole("navigation", { name: "breadcrumb" }),
    ).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByRole("navigation", { name: "breadcrumb" }),
    ).toContainText("Products");

    // --- 6. Locale switcher works on category page ---
    await page.goto("/en/categories/rackets");
    await expect(
      page.getByRole("heading", { level: 1 }),
    ).toBeVisible({ timeout: 10000 });

    // Switch to French
    await page.getByRole("button", { name: "FR" }).click();
    await expect(page).toHaveURL(/\/fr\/categories\//, { timeout: 10000 });

    // --- 7. 404 for non-existent category ---
    await page.goto("/en/categories/non-existent-slug");
    await expect(page.locator("text=404")).toBeVisible({ timeout: 10000 });
  });

  test("archived product redirects to category", async ({ page }) => {
    // Head Delta Pro 2024 is archived in seeds
    const response = await page.goto("/en/products/head-delta-pro-2024");

    // Should redirect to the category page
    await expect(page).toHaveURL(/\/categories\//, { timeout: 10000 });

    // Should not show the archived product page
    await expect(
      page.getByRole("heading", { name: "Head Delta Pro 2024" }),
    ).not.toBeVisible();
  });
});
