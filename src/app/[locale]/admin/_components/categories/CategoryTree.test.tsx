import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { render } from "@/test/render";
import { type CategoryNode } from "./utils";
import { CategoryTree } from "./CategoryTree";

// --- Mocks ---

const mockDeleteCategory = vi.fn();
const mockCategories: CategoryNode[] = [];
let mockLoading = false;
let mockDeleting = false;

vi.mock("../../_hooks/useAdminCategories", () => ({
  useAdminCategories: () => ({
    categories: mockCategories,
    loading: mockLoading,
  }),
}));

vi.mock("../../_hooks/useDeleteCategory", () => ({
  useDeleteCategory: () => ({
    deleteCategory: mockDeleteCategory,
    loading: mockDeleting,
  }),
}));

// --- Fixtures ---

const rootCategory: CategoryNode = {
  id: "cat-1",
  name: "Rackets",
  productsCount: 12,
  subcategories: [
    {
      id: "cat-1-1",
      name: "Pro Rackets",
      productsCount: 5,
      subcategories: [],
    },
  ],
};

const emptyCategory: CategoryNode = {
  id: "cat-2",
  name: "Accessories",
  productsCount: 0,
  subcategories: [],
};

// --- Tests ---

describe("CategoryTree", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockCategories.length = 0;
    mockLoading = false;
    mockDeleting = false;
  });

  it("shows a loading indicator while fetching", () => {
    mockLoading = true;

    render(<CategoryTree />);

    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("shows an empty message when there are no categories", () => {
    render(<CategoryTree />);

    expect(screen.getByText("No categories yet.")).toBeInTheDocument();
  });

  it("renders the title and add link", () => {
    render(<CategoryTree />);

    expect(
      screen.getByRole("heading", { name: "Categories" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Add category" }),
    ).toBeInTheDocument();
  });

  it("renders categories with their names", () => {
    mockCategories.push(rootCategory, emptyCategory);

    render(<CategoryTree />);

    expect(screen.getByText("Rackets")).toBeInTheDocument();
    expect(screen.getByText("Accessories")).toBeInTheDocument();
  });

  it("renders subcategories hierarchically", () => {
    mockCategories.push(rootCategory);

    render(<CategoryTree />);

    expect(screen.getByText("Rackets")).toBeInTheDocument();
    // Subcategories are prefixed with "└ "
    expect(screen.getByText(/Pro Rackets/)).toBeInTheDocument();
  });

  it("displays the products count for each category", () => {
    mockCategories.push(rootCategory, emptyCategory);

    render(<CategoryTree />);

    expect(screen.getByText("12 products")).toBeInTheDocument();
    expect(screen.getByText("0 products")).toBeInTheDocument();
  });

  it("renders edit links for each category", () => {
    mockCategories.push(rootCategory);

    render(<CategoryTree />);

    const editLinks = screen.getAllByRole("link", { name: "Edit" });
    // One for root, one for subcategory
    expect(editLinks).toHaveLength(2);
    expect(editLinks[0]).toHaveAttribute(
      "href",
      "/admin/categories/cat-1/edit",
    );
  });

  it("calls deleteCategory when delete is confirmed", async () => {
    mockCategories.push(emptyCategory);
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<CategoryTree />);

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this category?",
    );
    expect(mockDeleteCategory).toHaveBeenCalledWith({
      variables: { input: { categoryId: "cat-2" } },
    });
  });

  it("does not call deleteCategory when delete is cancelled", async () => {
    mockCategories.push(emptyCategory);
    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<CategoryTree />);

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(mockDeleteCategory).not.toHaveBeenCalled();
  });

  it("disables delete buttons while deleting", () => {
    mockCategories.push(emptyCategory);
    mockDeleting = true;

    render(<CategoryTree />);

    expect(screen.getByRole("button", { name: "Delete" })).toBeDisabled();
  });
});
