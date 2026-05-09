import "@testing-library/jest-dom/vitest";
import { createElement } from "react";
import { vi, beforeAll } from "vitest";

// Mock next/dynamic — pre-load dynamic components so they render synchronously in tests
const dynamicLoaders: Promise<unknown>[] = vi.hoisted(() => []);

vi.mock("next/dynamic", () => ({
  default: (loader: () => Promise<unknown>) => {
    let Component: React.ComponentType | null = null;
    dynamicLoaders.push(
      loader().then((mod) => {
        // mod can be a component directly (when .then(m => m.X) is used)
        // or a module with default export
        if (typeof mod === "function") {
          Component = mod as React.ComponentType;
        } else {
          const m = mod as Record<string, unknown>;
          Component = (m.default ?? Object.values(m)[0]) as React.ComponentType;
        }
      }),
    );
    return (props: Record<string, unknown>) =>
      Component ? createElement(Component, props) : null;
  },
}));

beforeAll(async () => {
  await Promise.all(dynamicLoaders);
});

vi.mock("@/i18n/navigation", () => ({
  Link: (props: Record<string, unknown>) =>
    createElement("a", { href: props.href }, props.children),
  redirect: vi.fn(),
  usePathname: vi.fn(() => "/"),
  useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn() })),
}));
