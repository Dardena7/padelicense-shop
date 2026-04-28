import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(dirname, ".storybook") })],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
      {
        extends: true,
        plugins: [react()],
        test: {
          name: "unit",
          globals: true,
          environment: "jsdom",
          include: ["src/**/*.test.{ts,tsx}"],
          setupFiles: ["src/test/setup.ts"],
          server: {
            deps: {
              inline: ["next-intl"],
            },
          },
        },
        resolve: {
          alias: {
            "@": path.resolve(dirname, "src"),
          },
        },
      },
    ],
  },
});
