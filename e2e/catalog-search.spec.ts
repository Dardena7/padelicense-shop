import { test, expect } from "@playwright/test";

test.describe("Catalog search and filters", () => {
  test("search, sort, and filter products", async ({ page }) => {
    await page.goto("/en/products");

    // Should show seeded products
    await expect(page.getByText("Head Speed Pro")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Bullpadel Vertex 04")).toBeVisible();
    await expect(page.getByText("Asics Gel-Padel Pro 5")).toBeVisible();

    // --- 1. Search by name ---
    await page.getByPlaceholder("Search products...").fill("Head Speed");

    await expect(page.getByText("Head Speed Pro")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Bullpadel Vertex 04")).not.toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByText("Asics Gel-Padel Pro 5")).not.toBeVisible();

    // --- 2. Clear search ---
    await page.getByPlaceholder("Search products...").fill("");

    await expect(page.getByText("Bullpadel Vertex 04")).toBeVisible({
      timeout: 10000,
    });

    // --- 3. Search partial match ---
    await page.getByPlaceholder("Search products...").fill("Overgrip");

    await expect(page.getByText("Bullpadel Overgrip Pack x3")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Head Speed Pro")).not.toBeVisible({
      timeout: 5000,
    });

    // Clear search for next tests
    await page.getByPlaceholder("Search products...").fill("");
    await expect(page.getByText("Head Speed Pro")).toBeVisible({
      timeout: 10000,
    });

    // --- 4. Sort by price low to high ---
    await page.getByLabel("Sort by").selectOption("PRICE_ASC");

    // Cheapest seeded product (Head Pro S balls at 699 cents) should appear first
    const allProducts = page.locator("a[href*='/products/']");
    await expect(allProducts.first()).toContainText("Head Pro S", {
      timeout: 10000,
    });

    // --- 5. Sort by price high to low ---
    await page.getByLabel("Sort by").selectOption("PRICE_DESC");

    // Most expensive seeded product (Bullpadel Vertex at 34990 cents)
    await expect(allProducts.first()).toContainText("Bullpadel Vertex", {
      timeout: 10000,
    });

    // --- 6. Sort by name A to Z ---
    await page.getByLabel("Sort by").selectOption("NAME_ASC");

    await expect(allProducts.first()).toContainText("Adidas Metalbone", {
      timeout: 10000,
    });

    // Reset sort
    await page.getByLabel("Sort by").selectOption("");

    // --- 7. Filter by min price ---
    await page.getByPlaceholder("Min (cents)").fill("20000");

    // Cheap products should disappear (balls at 699, overgrip at 890)
    await expect(page.getByText("Head Pro S")).not.toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Bullpadel Overgrip")).not.toBeVisible();
    // Expensive products should remain
    await expect(page.getByText("Head Speed Pro")).toBeVisible();
    await expect(page.getByText("Bullpadel Vertex 04")).toBeVisible();

    // --- 8. Filter by max price ---
    await page.getByPlaceholder("Min (cents)").fill("");
    await page.getByPlaceholder("Max (cents)").fill("10000");

    // Only cheap products should be visible
    await expect(page.getByText("Head Pro S")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Asics Gel-Padel Pro 5")).toBeVisible();
    await expect(page.getByText("Bullpadel Vertex 04")).not.toBeVisible({
      timeout: 5000,
    });

    // --- 9. Price range ---
    await page.getByPlaceholder("Min (cents)").fill("20000");
    await page.getByPlaceholder("Max (cents)").fill("30000");

    await expect(page.getByText("Head Speed Pro")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Wilson Bela Pro v2")).toBeVisible();
    await expect(page.getByText("Adidas Metalbone")).toBeVisible();
    // Out of range
    await expect(page.getByText("Bullpadel Vertex 04")).not.toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByText("Head Pro S")).not.toBeVisible();

    // --- 10. Combine search + price range ---
    await page.getByPlaceholder("Search products...").fill("Adidas");
    await page.getByPlaceholder("Min (cents)").fill("");
    await page.getByPlaceholder("Max (cents)").fill("");

    await expect(page.getByText("Adidas Metalbone")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Head Speed Pro")).not.toBeVisible({
      timeout: 5000,
    });
  });
});
