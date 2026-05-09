import { screen } from "@testing-library/react";
import { render } from "@/test/render";
import { describe, it, expect, vi } from "vitest";
import { CheckoutContent } from "./CheckoutContent";

const mockUseAuth = vi.fn();
const mockUseCart = vi.fn();
const mockUseVerifyCart = vi.fn();
const mockUseMyAddresses = vi.fn();

vi.mock("@/lib/auth", () => ({
  useAuthContext: () => mockUseAuth(),
}));

vi.mock("@/lib/cart", () => ({
  useCartContext: () => mockUseCart(),
}));

vi.mock("@/lib/cart/storage", () => ({
  cartStorage: { getGuestUuid: () => null, clearGuestUuid: vi.fn() },
}));

vi.mock("../_hooks", () => ({
  useVerifyCart: () => mockUseVerifyCart(),
  useCreateUserOrder: () => ({ createUserOrder: vi.fn(), loading: false }),
  useCreateGuestOrder: () => ({ createGuestOrder: vi.fn(), loading: false }),
}));

vi.mock("../../account/_hooks", () => ({
  useMyAddresses: () => mockUseMyAddresses(),
  useCreateAddress: () => ({ createAddress: vi.fn(), loading: false }),
}));

vi.mock("@/lib/stripe", () => ({
  stripePromise: Promise.resolve(null),
}));

vi.mock("@/i18n/navigation", () => ({
  Link: (props: { children: React.ReactNode; href: string }) => (
    <a href={props.href}>{props.children}</a>
  ),
  useRouter: () => ({ push: vi.fn() }),
}));

const validCart = {
  verifyCart: vi.fn(),
  result: { valid: true, issues: [] },
  loading: false,
};
const emptyAddresses = { addresses: [], loading: false, refetch: vi.fn() };

describe("CheckoutContent", () => {
  it("shows loading state while cart loads", () => {
    mockUseAuth.mockReturnValue({ user: null });
    mockUseCart.mockReturnValue({
      items: [],
      totalCents: 0,
      isLoading: true,
      clearCart: vi.fn(),
    });
    mockUseVerifyCart.mockReturnValue({
      verifyCart: vi.fn(),
      result: null,
      loading: false,
    });
    mockUseMyAddresses.mockReturnValue(emptyAddresses);

    render(<CheckoutContent />);

    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("shows cart issues when verification fails", () => {
    mockUseAuth.mockReturnValue({ user: null });
    mockUseCart.mockReturnValue({
      items: [{ id: "1" }],
      totalCents: 1000,
      isLoading: false,
      clearCart: vi.fn(),
    });
    mockUseVerifyCart.mockReturnValue({
      verifyCart: vi.fn(),
      result: {
        valid: false,
        issues: [
          {
            type: "PRODUCT_UNAVAILABLE",
            productName: "Old Racket",
            cartItemId: "1",
            requested: null,
            available: null,
          },
        ],
      },
      loading: false,
    });
    mockUseMyAddresses.mockReturnValue(emptyAddresses);

    render(<CheckoutContent />);

    expect(
      screen.getByText("Some items in your cart need attention"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Old Racket is no longer available"),
    ).toBeInTheDocument();
  });

  it("shows insufficient stock issue", () => {
    mockUseAuth.mockReturnValue({ user: null });
    mockUseCart.mockReturnValue({
      items: [{ id: "1" }],
      totalCents: 1000,
      isLoading: false,
      clearCart: vi.fn(),
    });
    mockUseVerifyCart.mockReturnValue({
      verifyCart: vi.fn(),
      result: {
        valid: false,
        issues: [
          {
            type: "INSUFFICIENT_STOCK",
            productName: "Racket",
            cartItemId: "1",
            requested: 5,
            available: 2,
          },
        ],
      },
      loading: false,
    });
    mockUseMyAddresses.mockReturnValue(emptyAddresses);

    render(<CheckoutContent />);

    expect(
      screen.getByText("Racket: only 2 left (you requested 5)"),
    ).toBeInTheDocument();
  });

  it("shows empty cart state", () => {
    mockUseAuth.mockReturnValue({ user: null });
    mockUseCart.mockReturnValue({
      items: [],
      totalCents: 0,
      isLoading: false,
      clearCart: vi.fn(),
    });
    mockUseVerifyCart.mockReturnValue(validCart);
    mockUseMyAddresses.mockReturnValue(emptyAddresses);

    render(<CheckoutContent />);

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  it("shows address form for guest with email field", () => {
    mockUseAuth.mockReturnValue({ user: null });
    mockUseCart.mockReturnValue({
      items: [{ id: "1" }],
      totalCents: 5000,
      isLoading: false,
      clearCart: vi.fn(),
    });
    mockUseVerifyCart.mockReturnValue(validCart);
    mockUseMyAddresses.mockReturnValue(emptyAddresses);

    render(<CheckoutContent />);

    expect(screen.getByText("Shipping address")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Address line 1")).toBeInTheDocument();
  });

  it("shows saved addresses for logged-in user", () => {
    mockUseAuth.mockReturnValue({
      user: {
        publicId: "1",
        email: "test@test.com",
        firstName: "John",
        lastName: "Doe",
        role: "customer",
      },
    });
    mockUseCart.mockReturnValue({
      items: [{ id: "1" }],
      totalCents: 3000,
      isLoading: false,
      clearCart: vi.fn(),
    });
    mockUseVerifyCart.mockReturnValue(validCart);
    mockUseMyAddresses.mockReturnValue({
      addresses: [
        {
          id: "addr-1",
          label: "Home",
          line1: "Rue de la Loi 1",
          line2: null,
          city: "Bruxelles",
          postalCode: "1000",
          countryIso: "BE",
          default: true,
        },
        {
          id: "addr-2",
          label: "Work",
          line1: "Av Louise 5",
          line2: null,
          city: "Bruxelles",
          postalCode: "1050",
          countryIso: "BE",
          default: false,
        },
      ],
      loading: false,
      refetch: vi.fn(),
    });

    render(<CheckoutContent />);

    expect(screen.getByText("Rue de la Loi 1")).toBeInTheDocument();
    expect(screen.getByText("Av Louise 5")).toBeInTheDocument();
    expect(screen.getByText("Use this address")).toBeInTheDocument();
    expect(screen.getByText("New address")).toBeInTheDocument();
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
  });

  it("shows address form for logged-in user with no saved addresses", () => {
    mockUseAuth.mockReturnValue({
      user: {
        publicId: "1",
        email: "test@test.com",
        firstName: "John",
        lastName: "Doe",
        role: "customer",
      },
    });
    mockUseCart.mockReturnValue({
      items: [{ id: "1" }],
      totalCents: 3000,
      isLoading: false,
      clearCart: vi.fn(),
    });
    mockUseVerifyCart.mockReturnValue(validCart);
    mockUseMyAddresses.mockReturnValue(emptyAddresses);

    render(<CheckoutContent />);

    expect(screen.getByText("Shipping address")).toBeInTheDocument();
    expect(screen.getByLabelText("Address line 1")).toBeInTheDocument();
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
  });

  it("pre-selects the default address", () => {
    mockUseAuth.mockReturnValue({
      user: {
        publicId: "1",
        email: "test@test.com",
        firstName: "John",
        lastName: "Doe",
        role: "customer",
      },
    });
    mockUseCart.mockReturnValue({
      items: [{ id: "1" }],
      totalCents: 3000,
      isLoading: false,
      clearCart: vi.fn(),
    });
    mockUseVerifyCart.mockReturnValue(validCart);
    mockUseMyAddresses.mockReturnValue({
      addresses: [
        {
          id: "addr-1",
          label: "Home",
          line1: "Rue 1",
          line2: null,
          city: "Bruxelles",
          postalCode: "1000",
          countryIso: "BE",
          default: false,
        },
        {
          id: "addr-2",
          label: "Work",
          line1: "Rue 2",
          line2: null,
          city: "Bruxelles",
          postalCode: "1050",
          countryIso: "BE",
          default: true,
        },
      ],
      loading: false,
      refetch: vi.fn(),
    });

    render(<CheckoutContent />);

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios[0].checked).toBe(false);
    expect(radios[1].checked).toBe(true);
  });
});
