import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import { render } from "@/test/render";
import { OrderStatus } from "@/gql/graphql";
import { StatusTransition } from "./StatusTransition";

describe("StatusTransition", () => {
  it("shows transition buttons for paid orders", () => {
    render(
      <StatusTransition
        currentStatus={OrderStatus.Paid}
        onTransition={vi.fn()}
        loading={false}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Mark as shipped" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cancel order" }),
    ).toBeInTheDocument();
  });

  it("shows transition buttons for shipped orders", () => {
    render(
      <StatusTransition
        currentStatus={OrderStatus.Shipped}
        onTransition={vi.fn()}
        loading={false}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Mark as delivered" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cancel order" }),
    ).toBeInTheDocument();
  });

  it("renders nothing for delivered orders", () => {
    const { container } = render(
      <StatusTransition
        currentStatus={OrderStatus.Delivered}
        onTransition={vi.fn()}
        loading={false}
      />,
    );

    expect(container.innerHTML).toBe("");
  });

  it("renders nothing for cancelled orders", () => {
    const { container } = render(
      <StatusTransition
        currentStatus={OrderStatus.Cancelled}
        onTransition={vi.fn()}
        loading={false}
      />,
    );

    expect(container.innerHTML).toBe("");
  });

  it("calls onTransition with the selected status", async () => {
    const onTransition = vi.fn();
    render(
      <StatusTransition
        currentStatus={OrderStatus.Paid}
        onTransition={onTransition}
        loading={false}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Mark as shipped" }),
    );

    expect(onTransition).toHaveBeenCalledWith(OrderStatus.Shipped);
  });

  it("disables buttons when loading", () => {
    render(
      <StatusTransition
        currentStatus={OrderStatus.Paid}
        onTransition={vi.fn()}
        loading={true}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Mark as shipped" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel order" })).toBeDisabled();
  });
});
