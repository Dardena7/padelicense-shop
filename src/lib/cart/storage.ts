const GUEST_CART_KEY = "padelicense_guest_cart_uuid";

export const cartStorage = {
  getGuestUuid: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(GUEST_CART_KEY);
  },

  setGuestUuid: (uuid: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(GUEST_CART_KEY, uuid);
  },

  clearGuestUuid: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(GUEST_CART_KEY);
  },
};
