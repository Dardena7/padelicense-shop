import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";

const ADMIN_ORDER_QUERY = graphql(`
  query AdminOrder($id: ID!) {
    node(id: $id) {
      ... on Order {
        id
        uuid
        number
        status
        totalCents
        createdAt
        shippingAddressSnapshot
        user {
          id
          firstName
          lastName
          email
        }
        guestEmail
        lineItems {
          id
          productName
          variantName
          unitPriceCents
          quantity
        }
      }
    }
  }
`);

export const useAdminOrder = (id: string) => {
  const { data, loading } = useQuery(ADMIN_ORDER_QUERY, {
    variables: { id },
  });

  const order = data?.node?.__typename === "Order" ? data.node : null;

  return { order, loading };
};
