import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Breadcrumb } from "./Breadcrumb";

vi.mock("@/i18n/navigation", () => ({
  Link: (props: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={props.href} className={props.className}>
      {props.children}
    </a>
  ),
}));

describe("Breadcrumb", () => {
  it("renders all items", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Rackets", href: "/categories/rackets" },
          { label: "Control" },
        ]}
      />,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Rackets")).toBeInTheDocument();
    expect(screen.getByText("Control")).toBeInTheDocument();
  });

  it("renders links for all items except the last", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Rackets", href: "/categories/rackets" },
          { label: "Control" },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Rackets" })).toHaveAttribute(
      "href",
      "/categories/rackets",
    );
    expect(
      screen.queryByRole("link", { name: "Control" }),
    ).not.toBeInTheDocument();
  });

  it("renders JSON-LD structured data", () => {
    render(
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Rackets" }]}
      />,
    );

    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const jsonLd = JSON.parse(script!.textContent!);
    expect(jsonLd["@type"]).toBe("BreadcrumbList");
    expect(jsonLd.itemListElement).toHaveLength(2);
    expect(jsonLd.itemListElement[0].name).toBe("Home");
    expect(jsonLd.itemListElement[0].position).toBe(1);
  });
});
