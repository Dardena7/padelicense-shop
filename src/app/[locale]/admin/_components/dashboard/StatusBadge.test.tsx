import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { render } from "@/test/render";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders status text", () => {
    render(<StatusBadge status="paid" />);

    expect(screen.getByText("paid")).toBeInTheDocument();
  });

  it("applies green style for delivered", () => {
    render(<StatusBadge status="delivered" />);

    const badge = screen.getByText("delivered");
    expect(badge.className).toContain("bg-green-100");
  });

  it("applies red style for cancelled", () => {
    render(<StatusBadge status="cancelled" />);

    const badge = screen.getByText("cancelled");
    expect(badge.className).toContain("bg-red-100");
  });

  it("handles uppercase statuses", () => {
    render(<StatusBadge status="PAID" />);

    const badge = screen.getByText("PAID");
    expect(badge.className).toContain("bg-blue-100");
  });
});
