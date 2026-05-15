import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";

const GET_MY_ORDER = graphql(`
  query GetMyOrder($id: ID!) {
    node(id: $id) {
      ... on Order {
        id
        uuid
        number
        status
        totalCents
        createdAt
        shippingAddressSnapshot
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

export const useMyOrder = (id: string) => {
  const { data, loading } = useQuery(GET_MY_ORDER, {
    variables: { id },
  });

  const order = data?.node?.__typename === "Order" ? data.node : null;

  return { order, loading };
};
