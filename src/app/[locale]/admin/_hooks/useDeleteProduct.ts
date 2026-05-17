import { useMutation } from "@apollo/client/react";
import { graphql } from "@/gql";

const DELETE_PRODUCT_MUTATION = graphql(`
  mutation AdminDeleteProduct($input: AdminDeleteProductInput!) {
    adminDeleteProduct(input: $input) {
      deletedId
    }
  }
`);

export const useDeleteProduct = () => {
  const [mutate, { loading }] = useMutation(DELETE_PRODUCT_MUTATION, {
    refetchQueries: ["AdminProducts"],
    awaitRefetchQueries: true,
  });

  return { deleteProduct: mutate, loading };
};
