import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";
import { OrderStatus } from "@/gql/graphql";
import { nonNullable } from "@/lib/utils";

const ADMIN_ORDERS_QUERY = graphql(`
  query AdminOrders($status: OrderStatus) {
    adminOrders(status: $status) {
      nodes {
        id
        number
        status
        totalCents
        createdAt
        user {
          id
          firstName
          lastName
          email
        }
        guestEmail
      }
    }
  }
`);

export const useAdminOrders = (status?: OrderStatus) => {
  const { data, loading } = useQuery(ADMIN_ORDERS_QUERY, {
    variables: { status: status ?? null },
  });

  const orders = (data?.adminOrders?.nodes ?? []).filter(nonNullable);

  return { orders, loading };
};
