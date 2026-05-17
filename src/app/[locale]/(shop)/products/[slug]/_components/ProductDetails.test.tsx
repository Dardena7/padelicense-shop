import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import { render } from "@/test/render";
import { ProductDetails } from "./ProductDetails";

vi.mock("@/lib/cart", () => ({
  useCartContext: () => ({
    addItem: vi.fn(),
  }),
}));

const singleVariant = [
  { id: "v1", name: "Default", effectivePrice: 19990, stockQuantity: 5 },
];

const multipleVariants = [
  { id: "v1", name: "Standard", effectivePrice: 19990, stockQuantity: 5 },
  { id: "v2", name: "Premium", effectivePrice: 29990, stockQuantity: 3 },
  { id: "v3", name: "Limited", effectivePrice: 39990, stockQuantity: 0 },
];

describe("ProductDetails", () => {
  it("displays product info", () => {
    render(
      <ProductDetails
        name="Test Racket"
        brand="Head"
        description="A great racket"
        basePriceCents={19990}
        featured={false}
        variants={singleVariant}
      />,
    );

    expect(screen.getByText("Test Racket")).toBeInTheDocument();
    expect(screen.getByText("Head")).toBeInTheDocument();
    expect(screen.getByText("A great racket")).toBeInTheDocument();
  });

  it("does not show variant selector for single variant", () => {
    render(
      <ProductDetails
        name="Test"
        brand={null}
        description={null}
        basePriceCents={19990}
        featured={false}
        variants={singleVariant}
      />,
    );

    expect(screen.queryByText("Variants")).not.toBeInTheDocument();
  });

  it("shows variant selector for multiple variants", () => {
    render(
      <ProductDetails
        name="Test"
        brand={null}
        description={null}
        basePriceCents={19990}
        featured={false}
        variants={multipleVariants}
      />,
    );

    expect(screen.getByText("Standard")).toBeInTheDocument();
    expect(screen.getByText("Premium")).toBeInTheDocument();
    expect(screen.getByText("Limited")).toBeInTheDocument();
  });

  it("updates main price when selecting a variant", async () => {
    render(
      <ProductDetails
        name="Test"
        brand={null}
        description={null}
        basePriceCents={19990}
        featured={false}
        variants={multipleVariants}
      />,
    );

    expect(screen.getByText(/199\.90/, { selector: "p" })).toBeInTheDocument();

    await userEvent.click(screen.getByText("Premium"));

    expect(screen.getByText(/299\.90/, { selector: "p" })).toBeInTheDocument();
  });

  it("disables add to cart when variant is out of stock", () => {
    render(
      <ProductDetails
        name="Test"
        brand={null}
        description={null}
        basePriceCents={19990}
        featured={false}
        variants={[
          {
            id: "v1",
            name: "Default",
            effectivePrice: 19990,
            stockQuantity: 0,
          },
        ]}
      />,
    );

    expect(screen.getByRole("button", { name: "Out of stock" })).toBeDisabled();
  });
});
