import { screen, fireEvent } from "@testing-library/react";
import { render } from "@/test/render";
import { describe, it, expect, vi } from "vitest";
import { AddressForm } from "./AddressForm";

describe("AddressForm", () => {
  it("renders all required fields", () => {
    render(<AddressForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText("Label (optional)")).toBeInTheDocument();
    expect(screen.getByLabelText("Address line 1")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Address line 2 (optional)"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("City")).toBeInTheDocument();
    expect(screen.getByLabelText("Postal code")).toBeInTheDocument();
    expect(screen.getByLabelText("Country")).toBeInTheDocument();
  });

  it("hides label field when showLabel is false", () => {
    render(<AddressForm onSubmit={vi.fn()} showLabel={false} />);

    expect(screen.queryByLabelText("Label (optional)")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Address line 1")).toBeInTheDocument();
  });

  it("renders with initial values", () => {
    render(
      <AddressForm
        onSubmit={vi.fn()}
        initialValues={{
          label: "Home",
          line1: "Rue de la Loi 1",
          city: "Bruxelles",
          postalCode: "1000",
          countryIso: "BE",
        }}
      />,
    );

    expect(
      (screen.getByLabelText("Label (optional)") as HTMLInputElement).value,
    ).toBe("Home");
    expect(
      (screen.getByLabelText("Address line 1") as HTMLInputElement).value,
    ).toBe("Rue de la Loi 1");
    expect((screen.getByLabelText("City") as HTMLInputElement).value).toBe(
      "Bruxelles",
    );
  });

  it("uses custom submit label", () => {
    render(<AddressForm onSubmit={vi.fn()} submitLabel="Pay €50.00" />);

    expect(screen.getByText("Pay €50.00")).toBeInTheDocument();
  });

  it("shows cancel button when onCancel is provided", () => {
    const handleCancel = vi.fn();
    render(<AddressForm onSubmit={vi.fn()} onCancel={handleCancel} />);

    const cancelButton = screen.getByText("Back to cart");
    expect(cancelButton).toBeInTheDocument();

    fireEvent.click(cancelButton);
    expect(handleCancel).toHaveBeenCalledOnce();
  });

  it("does not show cancel button when onCancel is not provided", () => {
    render(<AddressForm onSubmit={vi.fn()} />);

    expect(screen.queryByText("Back to cart")).not.toBeInTheDocument();
  });

  it("defaults country to BE", () => {
    render(<AddressForm onSubmit={vi.fn()} />);

    const countrySelect = screen.getByLabelText("Country") as HTMLSelectElement;
    expect(countrySelect.value).toBe("BE");
  });
});
