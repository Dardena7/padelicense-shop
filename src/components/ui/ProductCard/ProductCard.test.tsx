import { screen } from "@testing-library/react";
import { render } from "@/test/render";
import { describe, it, expect, vi } from "vitest";
import { ProductCard } from "./ProductCard";

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: { alt: string }) => <img alt={alt} {...props} />,
}));

const defaultProps = {
  name: "Head Speed Pro",
  brand: "Head",
  slug: "head-speed-pro",
  priceCents: 24990,
};

describe("ProductCard", () => {
  it("formats price from cents", () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByText("€249.90")).toBeInTheDocument();
  });

  it("shows featured badge only when featured", () => {
    const { rerender } = render(<ProductCard {...defaultProps} />);
    expect(screen.queryByText("Featured")).not.toBeInTheDocument();

    rerender(<ProductCard {...defaultProps} featured />);
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("shows out of stock badge and overlay when not in stock", () => {
    const { rerender } = render(<ProductCard {...defaultProps} />);
    expect(screen.queryByText("Out of stock")).not.toBeInTheDocument();

    rerender(<ProductCard {...defaultProps} inStock={false} />);
    expect(screen.getByText("Out of stock")).toBeInTheDocument();
  });

  it("links to the correct product page", () => {
    render(<ProductCard {...defaultProps} />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/products/head-speed-pro");
  });
});
