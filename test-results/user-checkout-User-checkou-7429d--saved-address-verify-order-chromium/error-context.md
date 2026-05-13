# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: user-checkout.spec.ts >> User checkout (guest → signup → checkout → verify order) >> add to cart as guest, signup, checkout with saved address, verify order
- Location: e2e/user-checkout.spec.ts:12:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Paid')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Paid')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e4]:
        - link "Padelicense" [ref=e5] [cursor=pointer]:
          - /url: /en
        - link "Products" [ref=e7] [cursor=pointer]:
          - /url: /en/products
      - generic [ref=e8]:
        - generic [ref=e9]:
          - button "EN" [ref=e10] [cursor=pointer]
          - button "FR" [ref=e11] [cursor=pointer]
          - button "NL" [ref=e12] [cursor=pointer]
        - link "Cart" [ref=e13] [cursor=pointer]:
          - /url: /en/cart
        - link "Account" [ref=e14] [cursor=pointer]:
          - /url: /en/account
  - main [ref=e15]:
    - heading "My account" [level=1] [ref=e16]
    - generic [ref=e17]:
      - generic [ref=e18]:
        - button "Profile" [ref=e19]
        - button "My addresses" [ref=e20]
        - button "My orders" [active] [ref=e21]
      - generic [ref=e24]:
        - generic [ref=e25]:
          - 'heading "Order #PAD-20260513-53AC93" [level=3] [ref=e26]'
          - generic [ref=e27]: Pending
        - generic [ref=e28]:
          - paragraph [ref=e29]: "Date: 5/13/2026"
          - paragraph [ref=e30]: "Total: €339.80"
        - generic [ref=e31]:
          - paragraph [ref=e32]: Items
          - generic [ref=e33]:
            - generic [ref=e34]: Head Speed Pro — Default x1
            - generic [ref=e35]: €249.90
          - generic [ref=e36]:
            - generic [ref=e37]: Asics Gel-Padel Pro 5 — Default x1
            - generic [ref=e38]: €89.90
  - contentinfo [ref=e39]:
    - paragraph [ref=e41]: © 2026 Padelicense. All rights reserved.
  - button "Open Next.js Dev Tools" [ref=e47] [cursor=pointer]:
    - img [ref=e48]
  - alert [ref=e51]: Padelicense Shop
  - iframe [ref=e52]:
    - button "Open Stripe Developer Tools" [ref=f3e5] [cursor=pointer]:
      - banner [ref=f3e8]:
        - generic "View Errors" [ref=f3e9]:
          - status [ref=f3e10]: "1"
        - img [ref=f3e11]
        - img [ref=f3e13]
```

# Test source

```ts
  29  |         page.getByRole("link", { name: /Cart/ }).getByText("2"),
  30  |       ).toBeVisible();
  31  | 
  32  |       // --- Signup (cart should be claimed) ---
  33  |       await clickAndWaitForURL(
  34  |         page,
  35  |         page.getByRole("link", { name: "Log in" }),
  36  |         /\/login/,
  37  |       );
  38  |       await clickAndWaitForURL(
  39  |         page,
  40  |         page.getByRole("link", { name: "Sign up" }),
  41  |         /\/signup/,
  42  |       );
  43  | 
  44  |       await page.getByLabel("First name").fill("Jane");
  45  |       await page.getByLabel("Last name").fill("Smith");
  46  |       await page.getByLabel("Email").fill(email);
  47  |       await page.getByLabel("Password", { exact: true }).fill(TEST_PASSWORD);
  48  |       await page.getByLabel("Confirm password").fill(TEST_PASSWORD);
  49  |       await page.getByRole("button", { name: "Create account" }).click();
  50  | 
  51  |       // Should redirect to home
  52  |       await expect(page).toHaveURL(/\/en$/, { timeout: 10000 });
  53  |       await expect(page.getByRole("link", { name: "Account" })).toBeVisible({
  54  |         timeout: 10000,
  55  |       });
  56  | 
  57  |       // Cart should still have 2 items (claimed from guest)
  58  |       await expect(
  59  |         page.getByRole("link", { name: /Cart/ }).getByText("2"),
  60  |       ).toBeVisible({ timeout: 10000 });
  61  | 
  62  |       // --- Create an address via account ---
  63  |       await clickAndWaitForURL(
  64  |         page,
  65  |         page.getByRole("link", { name: "Account" }),
  66  |         /\/account/,
  67  |       );
  68  |       await page.getByRole("button", { name: "My addresses" }).click();
  69  |       await page.getByRole("button", { name: "Add address" }).click();
  70  |       await page.getByLabel("Label (optional)").fill("Home");
  71  |       await page.getByLabel("Address line 1").fill("Grand Place 1");
  72  |       await page.getByLabel("City").fill("Bruxelles");
  73  |       await page.getByLabel("Postal code").fill("1000");
  74  |       await page.getByLabel("Country").selectOption("BE");
  75  |       await page.getByRole("button", { name: "Save" }).click();
  76  |       await expect(page.getByText("Grand Place 1")).toBeVisible();
  77  | 
  78  |       // --- Go to checkout ---
  79  |       await clickAndWaitForURL(
  80  |         page,
  81  |         page.getByRole("link", { name: /Cart/ }),
  82  |         /\/cart/,
  83  |       );
  84  |       await clickAndWaitForURL(
  85  |         page,
  86  |         page.getByRole("link", { name: "Proceed to checkout" }),
  87  |         /\/checkout/,
  88  |       );
  89  |       await expect(
  90  |         page.getByRole("heading", { name: "Checkout" }),
  91  |       ).toBeVisible();
  92  | 
  93  |       // --- Should show saved address, no email field ---
  94  |       await expect(page.getByText("Grand Place 1")).toBeVisible();
  95  |       await expect(
  96  |         page.getByRole("button", { name: "Use this address" }),
  97  |       ).toBeVisible();
  98  |       await expect(page.getByLabel("Email")).not.toBeVisible();
  99  | 
  100 |       // --- Use saved address ---
  101 |       await page.getByRole("button", { name: "Use this address" }).click();
  102 | 
  103 |       // --- Fill card and pay ---
  104 |       await fillStripeCardAndPay(page);
  105 | 
  106 |       // --- Should redirect to confirmation ---
  107 |       await expect(
  108 |         page.getByRole("heading", { name: "Order confirmed!" }),
  109 |       ).toBeVisible({ timeout: 20000 });
  110 |       const orderText = await page.getByText(/Order #PAD-/).textContent();
  111 |       const orderNumber = orderText?.match(/PAD-[\w-]+/)?.[0];
  112 | 
  113 |       // --- Simulate webhook (CI only, in local stripe listen handles it) ---
  114 |       const url = new URL(page.url());
  115 |       const orderUuid = url.searchParams.get("uuid");
  116 |       if (orderUuid) {
  117 |         await simulatePaymentSucceeded(orderUuid);
  118 |       }
  119 | 
  120 |       // --- Verify order in account ---
  121 |       await clickAndWaitForURL(
  122 |         page,
  123 |         page.getByRole("link", { name: "Account" }),
  124 |         /\/account/,
  125 |       );
  126 |       await page.getByRole("button", { name: "My orders" }).click();
  127 | 
  128 |       await expect(page.getByText(`Order #${orderNumber}`)).toBeVisible();
> 129 |       await expect(page.getByText("Paid")).toBeVisible();
      |                                            ^ Error: expect(locator).toBeVisible() failed
  130 |       await expect(page.getByText("Head Speed Pro")).toBeVisible();
  131 |     });
  132 |   },
  133 | );
  134 | 
```