import { useMutation } from "@apollo/client/react";
import { graphql } from "@/gql";
import { cartStorage } from "@/lib/cart/storage";

const CREATE_GUEST_ORDER = graphql(`
  mutation CreateGuestOrder($input: CreateGuestOrderInput!) {
    createGuestOrder(input: $input) {
      order {
        id
        uuid
        number
        status
        totalCents
      }
      clientSecret
    }
  }
`);

type ShippingAddress = {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  countryIso: string;
};

export const useCreateGuestOrder = () => {
  const [mutate, { loading }] = useMutation(CREATE_GUEST_ORDER);

  const createGuestOrder = async (
    guestEmail: string,
    shippingAddress: ShippingAddress,
  ) => {
    const guestUuid = cartStorage.getGuestUuid();
    if (!guestUuid) return null;

    const { data } = await mutate({
      variables: {
        input: { guestUuid, guestEmail, shippingAddress },
      },
    });
    return data?.createGuestOrder ?? null;
  };

  return { createGuestOrder, loading };
};
