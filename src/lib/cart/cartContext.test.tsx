import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CartProvider, useCartContext } from "./cartContext";
import { UserRole } from "@/gql/graphql";
import { cartStorage } from "./storage";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../../messages/en.json";

const mockFetchCart = vi.fn();
const mockAddItem = vi.fn();
const mockUpdateItem = vi.fn();
const mockRemoveItem = vi.fn();
const mockClaimCart = vi.fn();

vi.mock("@apollo/client/react", () => ({
  useLazyQuery: () => [mockFetchCart],
  useMutation: (query: unknown) => {
    const name = (query as { definitions: { name: { value: string } }[] })
      ?.definitions?.[0]?.name?.value;
    if (name === "AddItemToCart") return [mockAddItem];
    if (name === "UpdateCartItem") return [mockUpdateItem];
    if (name === "RemoveItemFromCart") return [mockRemoveItem];
    if (name === "ClaimGuestCart") return [mockClaimCart];
    return [vi.fn()];
  },
}));

vi.mock("../auth", () => ({
  useAuthContext: vi.fn(() => ({ user: null, isLoading: false })),
}));

vi.mock("./storage", () => ({
  cartStorage: {
    getGuestUuid: vi.fn(() => null),
    setGuestUuid: vi.fn(),
    clearGuestUuid: vi.fn(),
  },
}));

const { useAuthContext } = await import("../auth");
const mockedUseAuth = vi.mocked(useAuthContext);

const cartData = {
  id: "cart-1",
  guestUuid: "guest-uuid-123",
  totalCents: 24990,
  items: [
    {
      id: "item-1",
      quantity: 1,
      productVariant: {
        id: "variant-1",
        name: "340g",
        effectivePrice: 24990,
        stockQuantity: 10,
        images: [],
      },
    },
  ],
};

const TestConsumer = () => {
  const { items, totalCents, itemCount, isLoading, addItem } = useCartContext();

  if (isLoading) return <p>Loading cart</p>;

  return (
    <div>
      <p>Items: {itemCount}</p>
      <p>Total: {totalCents}</p>
      {items.map((item) => (
        <p key={item.id}>{item.productVariant.name}</p>
      ))}
      <button onClick={() => addItem("variant-1")}>Add</button>
    </div>
  );
};

const renderCart = () => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    </NextIntlClientProvider>,
  );
};

describe("CartContext", () => {
  beforeEach(() => {
    vi.mocked(cartStorage.getGuestUuid).mockReturnValue(null);
    vi.mocked(cartStorage.setGuestUuid).mockClear();
    vi.mocked(cartStorage.clearGuestUuid).mockClear();
    mockFetchCart.mockReset();
    mockAddItem.mockReset();
    mockClaimCart.mockReset();
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
    });
  });

  describe("visitor without guest cart", () => {
    it("shows empty cart without fetching", async () => {
      renderCart();

      await waitFor(() => {
        expect(screen.getByText("Items: 0")).toBeInTheDocument();
        expect(screen.getByText("Total: 0")).toBeInTheDocument();
      });

      expect(mockFetchCart).not.toHaveBeenCalled();
    });
  });

  describe("visitor with existing guest cart", () => {
    it("fetches cart using guest uuid", async () => {
      vi.mocked(cartStorage.getGuestUuid).mockReturnValue("guest-uuid-123");
      mockFetchCart.mockResolvedValue({ data: { cart: cartData } });

      renderCart();

      await waitFor(() => {
        expect(mockFetchCart).toHaveBeenCalledWith({
          variables: { guestUuid: "guest-uuid-123" },
        });
        expect(screen.getByText("Items: 1")).toBeInTheDocument();
        expect(screen.getByText("340g")).toBeInTheDocument();
      });
    });
  });

  describe("visitor adding item", () => {
    it("calls addItem mutation and stores guest uuid", async () => {
      const newCartData = { ...cartData, guestUuid: "new-guest-uuid" };
      mockAddItem.mockResolvedValue({
        data: { addItemToCart: { cart: newCartData } },
      });

      renderCart();

      await waitFor(() => {
        expect(screen.getByText("Items: 0")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Add"));

      await waitFor(() => {
        expect(screen.getByText("Items: 1")).toBeInTheDocument();
        expect(cartStorage.setGuestUuid).toHaveBeenCalledWith("new-guest-uuid");
      });
    });
  });

  describe("authenticated user", () => {
    it("fetches cart without guest uuid", async () => {
      mockedUseAuth.mockReturnValue({
        user: {
          publicId: "user-1",
          email: "test@test.com",
          firstName: "Test",
          lastName: "User",
          role: UserRole.Customer,
          phone: null,
        },
        isLoading: false,
        login: vi.fn(),
        signup: vi.fn(),
        logout: vi.fn(),
        updateUser: vi.fn(),
      });

      mockFetchCart.mockResolvedValue({
        data: { cart: { ...cartData, guestUuid: null } },
      });

      renderCart();

      await waitFor(() => {
        expect(mockFetchCart).toHaveBeenCalledWith({
          variables: { guestUuid: undefined },
        });
        expect(screen.getByText("Items: 1")).toBeInTheDocument();
      });
    });
  });

  describe("claiming guest cart on login", () => {
    it("claims guest cart and clears uuid from storage", async () => {
      vi.mocked(cartStorage.getGuestUuid).mockReturnValue("guest-uuid-123");

      mockedUseAuth.mockReturnValue({
        user: {
          publicId: "user-1",
          email: "test@test.com",
          firstName: "Test",
          lastName: "User",
          role: UserRole.Customer,
          phone: null,
        },
        isLoading: false,
        login: vi.fn(),
        signup: vi.fn(),
        logout: vi.fn(),
        updateUser: vi.fn(),
      });

      mockClaimCart.mockResolvedValue({
        data: {
          claimGuestCart: {
            cart: { ...cartData, guestUuid: null },
          },
        },
      });

      renderCart();

      await waitFor(() => {
        expect(mockClaimCart).toHaveBeenCalledWith({
          variables: { input: { guestUuid: "guest-uuid-123" } },
        });
        expect(cartStorage.clearGuestUuid).toHaveBeenCalled();
        expect(screen.getByText("Items: 1")).toBeInTheDocument();
      });
    });
  });

  describe("logout clears cart", () => {
    it("empties cart state when user logs out", async () => {
      const authUser = {
        publicId: "user-1",
        email: "test@test.com",
        firstName: "Test",
        lastName: "User",
        role: "customer",
        phone: null,
      };

      mockedUseAuth.mockReturnValue({
        user: authUser,
        isLoading: false,
        login: vi.fn(),
        signup: vi.fn(),
        logout: vi.fn(),
        updateUser: vi.fn(),
      });

      mockFetchCart.mockResolvedValue({
        data: { cart: { ...cartData, guestUuid: null } },
      });

      const { rerender } = renderCart();

      await waitFor(() => {
        expect(screen.getByText("Items: 1")).toBeInTheDocument();
      });

      // Simulate logout
      mockedUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
        login: vi.fn(),
        signup: vi.fn(),
        logout: vi.fn(),
        updateUser: vi.fn(),
      });

      rerender(
        <NextIntlClientProvider locale="en" messages={messages}>
          <CartProvider>
            <TestConsumer />
          </CartProvider>
        </NextIntlClientProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText("Items: 0")).toBeInTheDocument();
        expect(screen.getByText("Total: 0")).toBeInTheDocument();
      });
    });
  });
});
