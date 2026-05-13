import { screen, fireEvent } from "@testing-library/react";
import { render } from "@/test/render";
import { describe, it, expect, vi } from "vitest";
import { PaymentForm } from "./PaymentForm";

const mockConfirmPayment = vi.fn();
const mockStripe = { confirmPayment: mockConfirmPayment };
const mockElements = {};

vi.mock("@stripe/react-stripe-js", () => ({
  PaymentElement: () => (
    <div data-testid="payment-element">Stripe Payment Element</div>
  ),
  useStripe: () => mockStripe,
  useElements: () => mockElements,
}));

describe("PaymentForm", () => {
  it("renders payment element and submit button", () => {
    render(<PaymentForm amount="€50.00" onSuccess={vi.fn()} />);

    expect(screen.getByTestId("payment-element")).toBeInTheDocument();
    expect(screen.getByText("Pay €50.00")).toBeInTheDocument();
  });

  it("calls onSuccess after successful payment", async () => {
    mockConfirmPayment.mockResolvedValue({ error: null });
    const onSuccess = vi.fn();

    render(<PaymentForm amount="€50.00" onSuccess={onSuccess} />);

    fireEvent.submit(screen.getByText("Pay €50.00").closest("form")!);

    await vi.waitFor(() => {
      expect(mockConfirmPayment).toHaveBeenCalledWith({
        elements: mockElements,
        redirect: "if_required",
      });
      expect(onSuccess).toHaveBeenCalledOnce();
    });
  });

  it("shows error on payment failure", async () => {
    mockConfirmPayment.mockResolvedValue({
      error: { message: "Card declined" },
    });

    render(<PaymentForm amount="€50.00" onSuccess={vi.fn()} />);

    fireEvent.submit(screen.getByText("Pay €50.00").closest("form")!);

    await vi.waitFor(() => {
      expect(screen.getByText("Card declined")).toBeInTheDocument();
    });
  });
});
