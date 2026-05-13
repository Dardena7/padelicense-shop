import { screen } from "@testing-library/react";
import { render } from "@/test/render";
import { describe, it, expect, vi } from "vitest";
import { AddToCartButton } from "./AddToCartButton";

vi.mock("@/lib/cart", () => ({
  useCartContext: () => ({
    addItem: vi.fn(),
  }),
}));

describe("AddToCartButton", () => {
  it("shows add to cart when in stock", () => {
    render(<AddToCartButton productVariantId="v1" inStock={true} />);

    expect(screen.getByText("Add to cart")).toBeInTheDocument();
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("shows out of stock and is disabled when not in stock", () => {
    render(<AddToCartButton productVariantId="v1" inStock={false} />);

    expect(screen.getByText("Out of stock")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
