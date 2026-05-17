import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { render } from "@/test/render";
import { ProductStatus } from "@/gql/graphql";
import { ProductList } from "./ProductList";

// --- Mocks ---

const mockDeleteProduct = vi.fn();
let mockProducts: Array<{
  id: string;
  name: string;
  basePriceCents: number;
  status: ProductStatus;
  category: { name: string };
  variants: Array<{ id: string }>;
}> = [];
let mockLoading = false;
let mockDeleting = false;

vi.mock("../../_hooks/useAdminProducts", () => ({
  useAdminProducts: () => ({
    products: mockProducts,
    loading: mockLoading,
  }),
}));

vi.mock("../../_hooks/useDeleteProduct", () => ({
  useDeleteProduct: () => ({
    deleteProduct: mockDeleteProduct,
    loading: mockDeleting,
  }),
}));

// --- Fixtures ---

const sampleProducts = [
  {
    id: "prod-1",
    name: "Pro Racket X",
    basePriceCents: 15999,
    status: ProductStatus.Active,
    category: { name: "Rackets" },
    variants: [{ id: "v1" }, { id: "v2" }],
  },
  {
    id: "prod-2",
    name: "Padel Bag",
    basePriceCents: 4999,
    status: ProductStatus.Draft,
    category: { name: "Accessories" },
    variants: [{ id: "v3" }],
  },
];

// --- Tests ---

describe("ProductList", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockProducts = [];
    mockLoading = false;
    mockDeleting = false;
  });

  it("shows reduced opacity while fetching", () => {
    mockLoading = true;
    mockProducts = sampleProducts;

    const { container } = render(<ProductList />);

    const wrapper = container.querySelector(".opacity-50");
    expect(wrapper).toBeInTheDocument();
  });

  it("shows an empty message when there are no products", () => {
    render(<ProductList />);

    expect(screen.getByText("No products yet.")).toBeInTheDocument();
  });

  it("renders the title and add product link", () => {
    render(<ProductList />);

    expect(
      screen.getByRole("heading", { name: "Products" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Add product" }),
    ).toBeInTheDocument();
  });

  it("renders filter buttons for all statuses", () => {
    render(<ProductList />);

    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Draft" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Active" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Archived" }),
    ).toBeInTheDocument();
  });

  it("highlights the All filter by default", () => {
    render(<ProductList />);

    const allButton = screen.getByRole("button", { name: "All" });
    expect(allButton.className).toContain("bg-gray-900");
  });

  it("renders product names as links", () => {
    mockProducts = sampleProducts;

    render(<ProductList />);

    const racketLink = screen.getByRole("link", { name: "Pro Racket X" });
    expect(racketLink).toHaveAttribute("href", "/admin/products/prod-1/edit");

    expect(screen.getByRole("link", { name: "Padel Bag" })).toHaveAttribute(
      "href",
      "/admin/products/prod-2/edit",
    );
  });

  it("shows category names for each product", () => {
    mockProducts = sampleProducts;

    render(<ProductList />);

    expect(screen.getByText("Rackets")).toBeInTheDocument();
    expect(screen.getByText("Accessories")).toBeInTheDocument();
  });

  it("shows status badges for each product", () => {
    mockProducts = sampleProducts;

    render(<ProductList />);

    // Status text appears both in filter buttons and badges.
    // Badges are rendered as <span> elements, so we check for multiple matches.
    const activeTexts = screen.getAllByText("Active");
    expect(activeTexts.length).toBeGreaterThanOrEqual(2); // filter button + badge

    const draftTexts = screen.getAllByText("Draft");
    expect(draftTexts.length).toBeGreaterThanOrEqual(2); // filter button + badge
  });

  it("shows variant count for each product", () => {
    mockProducts = sampleProducts;

    render(<ProductList />);

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("renders edit links for each product", () => {
    mockProducts = sampleProducts;

    render(<ProductList />);

    const editLinks = screen.getAllByRole("link", { name: "Edit" });
    expect(editLinks).toHaveLength(2);
    expect(editLinks[0]).toHaveAttribute("href", "/admin/products/prod-1/edit");
  });

  it("calls deleteProduct when delete is confirmed", async () => {
    mockProducts = [sampleProducts[0]];
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<ProductList />);

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this product?",
    );
    expect(mockDeleteProduct).toHaveBeenCalledWith({
      variables: { input: { productId: "prod-1" } },
    });
  });

  it("does not call deleteProduct when delete is cancelled", async () => {
    mockProducts = [sampleProducts[0]];
    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<ProductList />);

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(mockDeleteProduct).not.toHaveBeenCalled();
  });

  it("disables delete buttons while deleting", () => {
    mockProducts = [sampleProducts[0]];
    mockDeleting = true;

    render(<ProductList />);

    expect(screen.getByRole("button", { name: "Delete" })).toBeDisabled();
  });
});
