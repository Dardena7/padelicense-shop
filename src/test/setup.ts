import "@testing-library/jest-dom/vitest";
import { createElement } from "react";
import { vi } from "vitest";

vi.mock("@/i18n/navigation", () => ({
  Link: (props: Record<string, unknown>) =>
    createElement("a", { href: props.href }, props.children),
  redirect: vi.fn(),
  usePathname: vi.fn(() => "/"),
  useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn() })),
}));
