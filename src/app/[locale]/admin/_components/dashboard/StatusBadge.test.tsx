import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { render } from "@/test/render";
import { OrderStatus, ProductStatus } from "@/gql/graphql";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders status text", () => {
    render(<StatusBadge status={OrderStatus.Paid} />);

    expect(screen.getByText("PAID")).toBeInTheDocument();
  });

  it("applies green style for delivered", () => {
    render(<StatusBadge status={OrderStatus.Delivered} />);

    const badge = screen.getByText("DELIVERED");
    expect(badge.className).toContain("bg-green-100");
  });

  it("applies red style for cancelled", () => {
    render(<StatusBadge status={OrderStatus.Cancelled} />);

    const badge = screen.getByText("CANCELLED");
    expect(badge.className).toContain("bg-red-100");
  });

  it("works with product statuses", () => {
    render(<StatusBadge status={ProductStatus.Draft} />);

    const badge = screen.getByText("DRAFT");
    expect(badge.className).toContain("bg-gray-100");
  });
});
