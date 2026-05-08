import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";

const GET_MY_ORDERS = graphql(`
  query GetMyOrders {
    me {
      id
      orders {
        id
        uuid
        number
        status
        totalCents
        createdAt
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

export const useMyOrders = () => {
  const { data, loading } = useQuery(GET_MY_ORDERS);

  const orders = data?.me?.orders ?? [];

  return { orders, loading };
};
