import { useLazyQuery } from "@apollo/client/react";
import { graphql } from "@/gql";
import { cartStorage } from "@/lib/cart/storage";

const VERIFY_CART = graphql(`
  query VerifyCart($guestUuid: String) {
    verifyCart(guestUuid: $guestUuid) {
      valid
      issues {
        type
        cartItemId
        productName
        requested
        available
      }
    }
  }
`);

export const useVerifyCart = () => {
  const [verify, { data, loading }] = useLazyQuery(VERIFY_CART);

  const verifyCart = () => {
    const guestUuid = cartStorage.getGuestUuid();
    verify({ variables: { guestUuid } });
  };

  const result = data?.verifyCart ?? null;

  return { verifyCart, result, loading };
};
