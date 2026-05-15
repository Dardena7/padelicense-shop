import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import { render } from "@/test/render";
import { OrderStatus } from "@/gql/graphql";
import { StatusFilter } from "./StatusFilter";

describe("StatusFilter", () => {
  it("renders all filter buttons", () => {
    render(<StatusFilter value={undefined} onChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pending" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Paid" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Shipped" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delivered" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cancelled" }),
    ).toBeInTheDocument();
  });

  it("highlights the active filter", () => {
    render(<StatusFilter value={OrderStatus.Paid} onChange={vi.fn()} />);

    const paidButton = screen.getByRole("button", { name: "Paid" });
    const allButton = screen.getByRole("button", { name: "All" });

    expect(paidButton.className).toContain("bg-gray-900");
    expect(allButton.className).not.toContain("bg-gray-900");
  });

  it("calls onChange with status when clicking a filter", async () => {
    const onChange = vi.fn();
    render(<StatusFilter value={undefined} onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: "Shipped" }));

    expect(onChange).toHaveBeenCalledWith(OrderStatus.Shipped);
  });

  it("calls onChange with undefined when clicking All", async () => {
    const onChange = vi.fn();
    render(<StatusFilter value={OrderStatus.Paid} onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: "All" }));

    expect(onChange).toHaveBeenCalledWith(undefined);
  });
});
