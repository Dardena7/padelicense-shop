import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { render } from "@/test/render";
import { LowStockAlerts } from "./LowStockAlerts";

const mockVariants = [
  {
    id: "1",
    name: "EU 42",
    sku: "SHOE-42",
    stockQuantity: 1,
    product: { id: "p1", name: "Asics Gel" },
  },
  {
    id: "2",
    name: "Limited",
    sku: "RACKET-LTD",
    stockQuantity: 0,
    product: { id: "p2", name: "Bullpadel Vertex" },
  },
];

describe("LowStockAlerts", () => {
  it("renders variant details", () => {
    render(<LowStockAlerts variants={mockVariants} />);

    expect(screen.getByText("Asics Gel")).toBeInTheDocument();
    expect(screen.getByText("EU 42 — SHOE-42")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("highlights out of stock in red", () => {
    render(<LowStockAlerts variants={mockVariants} />);

    const zeroStock = screen.getByText("0");
    expect(zeroStock.className).toContain("text-red-600");
  });

  it("highlights low stock in orange", () => {
    render(<LowStockAlerts variants={mockVariants} />);

    const lowStock = screen.getByText("1");
    expect(lowStock.className).toContain("text-orange-500");
  });

  it("renders nothing when no variants", () => {
    const { container } = render(<LowStockAlerts variants={[]} />);

    expect(container.innerHTML).toBe("");
  });
});
