import { screen } from "@testing-library/react";
import { render } from "@/test/render";
import { describe, it, expect, vi } from "vitest";
import { CartContent } from "./CartContent";

const mockUseCart = vi.fn();

vi.mock("@/lib/cart", () => ({
  useCartContext: () => mockUseCart(),
}));

vi.mock("@/i18n/navigation", () => ({
  Link: (props: { children: React.ReactNode; href: string }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

describe("CartContent", () => {
  it("shows empty state when no items", () => {
    mockUseCart.mockReturnValue({
      items: [],
      totalCents: 0,
      isLoading: false,
    });

    render(<CartContent />);

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    expect(screen.getByText("Continue shopping")).toBeInTheDocument();
  });

  it("shows items and total when cart has items", () => {
    mockUseCart.mockReturnValue({
      items: [
        {
          id: "item-1",
          quantity: 2,
          productVariant: {
            id: "v1",
            name: "340g",
            effectivePrice: 24990,
            stockQuantity: 10,
            product: { id: "p1", name: "Head Speed Pro" },
            images: [],
          },
        },
      ],
      totalCents: 49980,
      isLoading: false,
    });

    render(<CartContent />);

    expect(screen.getByText("Head Speed Pro — 340g")).toBeInTheDocument();
    expect(screen.getByText("Total: €499.80")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    mockUseCart.mockReturnValue({
      items: [],
      totalCents: 0,
      isLoading: true,
    });

    render(<CartContent />);

    expect(screen.getByText("...")).toBeInTheDocument();
  });
});
