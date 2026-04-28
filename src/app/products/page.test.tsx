import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProductsPage from "./page";

vi.mock("@/lib/apollo", () => ({
  query: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: { alt: string }) => <img alt={alt} {...props} />,
}));

const { query } = await import("@/lib/apollo");
const mockedQuery = vi.mocked(query);

function mockProducts(products: object[]) {
  mockedQuery.mockResolvedValue({
    data: {
      products: {
        nodes: products,
        pageInfo: { hasNextPage: false, endCursor: null },
      },
    },
  } as any);
}

const productInStock = {
  id: "1",
  name: "Head Speed Pro",
  slug: "head-speed-pro",
  brand: "Head",
  basePriceCents: 24990,
  featured: false,
  category: { name: "Rackets", slug: "rackets" },
  variants: [{ id: "v1", name: "Default", effectivePrice: 24990, stockQuantity: 10 }],
  images: [],
};

const productFeatured = {
  ...productInStock,
  id: "2",
  name: "Bullpadel Vertex",
  slug: "bullpadel-vertex",
  featured: true,
};

const productOutOfStock = {
  ...productInStock,
  id: "3",
  name: "Nox AT10",
  slug: "nox-at10",
  variants: [{ id: "v3", name: "Default", effectivePrice: 19990, stockQuantity: 0 }],
};

describe("ProductsPage", () => {
  it("displays products from the API", async () => {
    mockProducts([productInStock, productFeatured]);
    const page = await ProductsPage();
    render(page);

    expect(screen.getByText("Head Speed Pro")).toBeInTheDocument();
    expect(screen.getByText("Bullpadel Vertex")).toBeInTheDocument();
  });

  it("shows featured badge on featured products", async () => {
    mockProducts([productFeatured]);
    const page = await ProductsPage();
    render(page);

    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("does not show featured badge on non-featured products", async () => {
    mockProducts([productInStock]);
    const page = await ProductsPage();
    render(page);

    expect(screen.queryByText("Featured")).not.toBeInTheDocument();
  });

  it("shows out of stock badge when variant has no stock", async () => {
    mockProducts([productOutOfStock]);
    const page = await ProductsPage();
    render(page);

    expect(screen.getByText("Out of stock")).toBeInTheDocument();
  });

  it("shows empty state when no products", async () => {
    mockProducts([]);
    const page = await ProductsPage();
    render(page);

    expect(screen.getByText("No products found.")).toBeInTheDocument();
  });
});
