import { Page, Locator } from "@playwright/test";

/**
 * Clicks a link and waits for navigation.
 * Retries the click if the page doesn't navigate (hydration issue).
 *
 * Next.js pre-renders links as HTML <a> tags, but the client-side
 * navigation handler may not be attached yet when Playwright clicks.
 * This helper retries until the navigation actually happens.
 */
export const clickAndWaitForURL = async (
  page: Page,
  locator: Locator,
  urlPattern: string | RegExp,
  maxRetries = 3,
) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    await locator.click();
    try {
      await page.waitForURL(urlPattern, { timeout: 15000 });
      return;
    } catch {
      // Navigation didn't happen — retry click
    }
  }
  // Final attempt — let it fail with a proper error
  await locator.click();
  await page.waitForURL(urlPattern, { timeout: 20000 });
};
