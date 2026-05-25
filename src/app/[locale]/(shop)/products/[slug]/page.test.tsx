import { screen } from "@testing-library/react";
import { render } from "@/test/render";
import { describe, it, expect, vi } from "vitest";
import "@/test/mocks/next-intl-server";
import ProductPage from "./page";

const mockQuery = vi.fn();

vi.mock("@/lib/apollo", () => ({
  getClient: () => ({ query: mockQuery }),
  localizedContext: (locale: string) => ({
    context: { headers: { "Accept-Language": locale } },
  }),
}));

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: { alt: string }) => <img alt={alt} {...props} />,
}));

vi.mock("@/components/layout", () => ({
  AlternateUrlsSync: () => null,
}));

class NotFoundError extends Error {}
class RedirectError extends Error {
  constructor(public url: string) {
    super(`Redirect to ${url}`);
  }
}

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new NotFoundError();
  }),
  redirect: vi.fn((url: string) => {
    throw new RedirectError(url);
  }),
}));

const { notFound, redirect } = await import("next/navigation");
const mockedNotFound = vi.mocked(notFound);
const mockedRedirect = vi.mocked(redirect);

const fullProduct = {
  id: "1",
  name: "Head Speed Pro",
  slug: "head-speed-pro",
  description: "A great racket for control players.",
  brand: "Head",
  basePriceCents: 24990,
  status: "ACTIVE",
  featured: true,
  category: { name: "Rackets", slug: "rackets", parent: null },
  variants: [
    {
      id: "v1",
      name: "340g",
      sku: "HSP-340",
      effectivePrice: 24990,
      stockQuantity: 10,
    },
    {
      id: "v2",
      name: "370g Limited",
      sku: "HSP-370",
      effectivePrice: 29990,
      stockQuantity: 0,
    },
  ],
  images: [
    {
      imageUrl: "https://example.com/img.jpg",
      altText: "Front view",
      position: 0,
    },
  ],
  alternateSlugs: [
    { locale: "EN", value: "head-speed-pro" },
    { locale: "FR", value: "head-speed-pro-fr" },
    { locale: "NL", value: "head-speed-pro-nl" },
  ],
};

const mockProduct = (product: object | null) => {
  mockQuery.mockResolvedValue({ data: { product } });
};

const makeParams = (slug: string) => Promise.resolve({ locale: "en", slug });

describe("ProductPage", () => {
  it("displays product details", async () => {
    mockProduct(fullProduct);
    const page = await ProductPage({ params: makeParams("head-speed-pro") });
    render(page);

    expect(
      screen.getByRole("heading", { name: "Head Speed Pro" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Head")).toBeInTheDocument();
    expect(screen.getByText("€249.90")).toBeInTheDocument();
    expect(
      screen.getByText("A great racket for control players."),
    ).toBeInTheDocument();
  });

  it("shows featured badge when product is featured", async () => {
    mockProduct(fullProduct);
    const page = await ProductPage({ params: makeParams("head-speed-pro") });
    render(page);

    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("displays variants when more than one", async () => {
    mockProduct(fullProduct);
    const page = await ProductPage({ params: makeParams("head-speed-pro") });
    render(page);

    expect(screen.getByText("340g")).toBeInTheDocument();
    expect(screen.getByText("370g Limited")).toBeInTheDocument();
  });

  it("shows variant price when different from base price", async () => {
    mockProduct(fullProduct);
    const page = await ProductPage({ params: makeParams("head-speed-pro") });
    render(page);

    expect(screen.getByText("€299.90")).toBeInTheDocument();
  });

  it("shows out of stock badge on variant with zero stock", async () => {
    mockProduct(fullProduct);
    const page = await ProductPage({ params: makeParams("head-speed-pro") });
    render(page);

    expect(screen.getByText("Out of stock")).toBeInTheDocument();
  });

  it("renders breadcrumb with category hierarchy", async () => {
    mockProduct(fullProduct);
    const page = await ProductPage({ params: makeParams("head-speed-pro") });
    render(page);

    const breadcrumb = screen.getByRole("navigation", { name: "breadcrumb" });
    expect(breadcrumb).toBeInTheDocument();
    expect(breadcrumb).toHaveTextContent("Products");
    expect(breadcrumb).toHaveTextContent("Rackets");
    expect(breadcrumb).toHaveTextContent("Head Speed Pro");
  });

  it("calls notFound when product does not exist", async () => {
    mockProduct(null);

    await expect(
      ProductPage({ params: makeParams("does-not-exist") }),
    ).rejects.toThrow(NotFoundError);

    expect(mockedNotFound).toHaveBeenCalled();
  });

  it("redirects archived product to category page", async () => {
    mockProduct({ ...fullProduct, status: "ARCHIVED" });

    await expect(
      ProductPage({ params: makeParams("head-speed-pro") }),
    ).rejects.toThrow(RedirectError);

    expect(mockedRedirect).toHaveBeenCalledWith("/en/categories/rackets");
  });
});
