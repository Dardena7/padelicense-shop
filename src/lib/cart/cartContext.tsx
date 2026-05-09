"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useMutation, useLazyQuery } from "@apollo/client/react";
import {
  GET_CART,
  ADD_ITEM_TO_CART,
  UPDATE_CART_ITEM,
  REMOVE_ITEM_FROM_CART,
  CLAIM_GUEST_CART,
} from "./_queries";
import { useAuthContext } from "../auth";
import { cartStorage } from "./storage";
import type { GetCartQuery } from "@/gql/graphql";

type CartData = NonNullable<GetCartQuery["cart"]>;
type CartItem = CartData["items"][number];

type CartContextType = {
  items: CartItem[];
  totalCents: number;
  itemCount: number;
  isLoading: boolean;
  addItem: (productVariantId: string, quantity?: number) => Promise<void>;
  updateItem: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType>({
  items: [],
  totalCents: 0,
  itemCount: 0,
  isLoading: true,
  addItem: async () => {},
  updateItem: async () => {},
  removeItem: async () => {},
  clearCart: () => {},
});

export const CartProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const { user } = useAuthContext();

  const [items, setItems] = useState<CartItem[]>([]);
  const [totalCents, setTotalCents] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [fetchCart] = useLazyQuery(GET_CART);
  const [addItemMutation] = useMutation(ADD_ITEM_TO_CART);
  const [updateItemMutation] = useMutation(UPDATE_CART_ITEM);
  const [removeItemMutation] = useMutation(REMOVE_ITEM_FROM_CART);
  const [claimCartMutation] = useMutation(CLAIM_GUEST_CART);

  const clearCart = useCallback(() => {
    setItems([]);
    setTotalCents(0);
  }, []);

  const syncCartState = useCallback((cart: CartData) => {
    setItems(cart.items ?? []);
    setTotalCents(cart.totalCents);

    if (cart.guestUuid) {
      cartStorage.setGuestUuid(cart.guestUuid);
    }
  }, []);

  const guestUuid = user ? undefined : cartStorage.getGuestUuid() ?? undefined;

  const loadCart = useCallback(async () => {
    const guestUuid = cartStorage.getGuestUuid();

    if (!user && !guestUuid) {
      setIsLoading(false);
      return;
    }

    const { data } = await fetchCart({
      variables: { guestUuid: user ? undefined : guestUuid },
    });

    if (data?.cart) {
      syncCartState(data.cart);
    }
    setIsLoading(false);
  }, [user, fetchCart, syncCartState]);

  const claimGuestCart = useCallback(async (guestUuid: string) => {
    try {
      const { data } = await claimCartMutation({
        variables: { input: { guestUuid } },
      });
      if (data?.claimGuestCart?.cart) {
        syncCartState(data.claimGuestCart.cart);
      }
      cartStorage.clearGuestUuid();
      setIsLoading(false);
    } catch {
      cartStorage.clearGuestUuid();
      loadCart();
    }
  }, [claimCartMutation, syncCartState, loadCart]);

  // Sync cart with auth state (login, logout, page load)
  useEffect(() => {
    const guestUuid = cartStorage.getGuestUuid();

    if (user && guestUuid) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      claimGuestCart(guestUuid);
      return;
    }

    if (!user && !guestUuid) {
      clearCart();
      setIsLoading(false);
      return;
    }

    loadCart();
  }, [user, claimGuestCart, clearCart, loadCart]);

  const addItem = useCallback(
    async (productVariantId: string, quantity = 1) => {
      const { data } = await addItemMutation({
        variables: {
          input: {
            productVariantId,
            quantity,
            guestUuid: guestUuid,
          },
        },
      });

      if (data?.addItemToCart?.cart) {
        syncCartState(data.addItemToCart.cart);
      }
    },
    [guestUuid, addItemMutation, syncCartState],
  );

  const updateItem = useCallback(
    async (cartItemId: string, quantity: number) => {
      const { data } = await updateItemMutation({
        variables: {
          input: {
            cartItemId,
            quantity,
            guestUuid: guestUuid,
          },
        },
      });

      if (data?.updateCartItem?.cart) {
        syncCartState(data.updateCartItem.cart);
      }
    },
    [guestUuid, updateItemMutation, syncCartState],
  );

  const removeItem = useCallback(
    async (cartItemId: string) => {
      const { data } = await removeItemMutation({
        variables: {
          input: {
            cartItemId,
            guestUuid: guestUuid,
          },
        },
      });

      if (data?.removeItemFromCart?.cart) {
        syncCartState(data.removeItemFromCart.cart);
      }
    },
    [guestUuid, removeItemMutation, syncCartState],
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalCents,
        itemCount,
        isLoading,
        addItem,
        updateItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
