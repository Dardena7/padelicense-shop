import { screen } from "@testing-library/react";
import { render } from "@/test/render";
import { describe, it, expect, vi } from "vitest";
import { OrdersTab } from "./OrdersTab";

const mockUseMyOrders = vi.fn();

vi.mock("../_hooks", () => ({
  useMyOrders: () => mockUseMyOrders(),
}));

describe("OrdersTab", () => {
  it("shows loading state", () => {
    mockUseMyOrders.mockReturnValue({ orders: [], loading: true });

    render(<OrdersTab />);

    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    mockUseMyOrders.mockReturnValue({ orders: [], loading: false });

    render(<OrdersTab />);

    expect(screen.getByText("No orders yet.")).toBeInTheDocument();
  });

  it("renders orders with details", () => {
    mockUseMyOrders.mockReturnValue({
      orders: [
        {
          id: "order-1",
          number: "PAD-20260506-ABC123",
          status: "PAID",
          totalCents: 7500,
          createdAt: "2026-05-06T10:00:00Z",
          lineItems: [
            {
              id: "li-1",
              productName: "Pro Racket",
              variantName: "Blue",
              unitPriceCents: 2500,
              quantity: 3,
            },
          ],
        },
      ],
      loading: false,
    });

    render(<OrdersTab />);

    expect(screen.getByText("Order #PAD-20260506-ABC123")).toBeInTheDocument();
    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(screen.getByText("Pro Racket — Blue x3")).toBeInTheDocument();
    expect(screen.getByText("€75.00")).toBeInTheDocument();
  });

  it("renders multiple orders", () => {
    mockUseMyOrders.mockReturnValue({
      orders: [
        {
          id: "order-1",
          number: "PAD-001",
          status: "PAID",
          totalCents: 5000,
          createdAt: "2026-05-06T10:00:00Z",
          lineItems: [],
        },
        {
          id: "order-2",
          number: "PAD-002",
          status: "SHIPPED",
          totalCents: 3000,
          createdAt: "2026-05-05T10:00:00Z",
          lineItems: [],
        },
      ],
      loading: false,
    });

    render(<OrdersTab />);

    expect(screen.getByText("Order #PAD-001")).toBeInTheDocument();
    expect(screen.getByText("Order #PAD-002")).toBeInTheDocument();
    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(screen.getByText("Shipped")).toBeInTheDocument();
  });
});
