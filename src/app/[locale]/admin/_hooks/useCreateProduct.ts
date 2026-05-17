import { useMutation } from "@apollo/client/react";
import { graphql } from "@/gql";

const CREATE_PRODUCT_MUTATION = graphql(`
  mutation AdminCreateProduct($input: AdminCreateProductInput!) {
    adminCreateProduct(input: $input) {
      product {
        id
        name
      }
    }
  }
`);

export const useCreateProduct = () => {
  const [mutate, { loading }] = useMutation(CREATE_PRODUCT_MUTATION);

  return { createProduct: mutate, loading };
};
