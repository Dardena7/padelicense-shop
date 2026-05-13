import { screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { render } from "@/test/render";
import { AdminSidebar } from "./AdminSidebar";

vi.mock("@/i18n/navigation", async () => {
  const { createElement } = await import("react");
  return {
    Link: (props: Record<string, unknown>) =>
      createElement(
        "a",
        { href: props.href, className: props.className },
        props.children as React.ReactNode,
      ),
    usePathname: () => "/admin/products",
  };
});

describe("AdminSidebar", () => {
  it("renders all navigation links", () => {
    render(<AdminSidebar />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
  });

  it("highlights the active link", () => {
    render(<AdminSidebar />);

    const productsLink = screen.getByText("Products");
    const dashboardLink = screen.getByText("Dashboard");

    expect(productsLink.className).toContain("bg-gray-900");
    expect(dashboardLink.className).not.toContain("bg-gray-900");
  });

  it("links to correct paths", () => {
    render(<AdminSidebar />);

    expect(screen.getByText("Dashboard")).toHaveAttribute("href", "/admin");
    expect(screen.getByText("Products")).toHaveAttribute(
      "href",
      "/admin/products",
    );
    expect(screen.getByText("Categories")).toHaveAttribute(
      "href",
      "/admin/categories",
    );
    expect(screen.getByText("Orders")).toHaveAttribute("href", "/admin/orders");
  });
});
