import { useMutation } from "@apollo/client/react";
import { graphql } from "@/gql";
import { OrderStatus } from "@/gql/graphql";

const UPDATE_ORDER_STATUS_MUTATION = graphql(`
  mutation AdminUpdateOrderStatus($input: AdminUpdateOrderStatusInput!) {
    adminUpdateOrderStatus(input: $input) {
      order {
        id
        status
      }
    }
  }
`);

export const useUpdateOrderStatus = () => {
  const [mutate, { loading }] = useMutation(UPDATE_ORDER_STATUS_MUTATION);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    return mutate({
      variables: { input: { orderId, status } },
    });
  };

  return { updateStatus, loading };
};
