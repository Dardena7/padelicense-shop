import { useMutation } from "@apollo/client/react";
import { graphql } from "@/gql";

const UPDATE_PRODUCT_MUTATION = graphql(`
  mutation AdminUpdateProduct($input: AdminUpdateProductInput!) {
    adminUpdateProduct(input: $input) {
      product {
        id
        name
        translations {
          locale
          name
          slug
          description
        }
      }
    }
  }
`);

export const useUpdateProduct = () => {
  const [mutate, { loading }] = useMutation(UPDATE_PRODUCT_MUTATION);

  return { updateProduct: mutate, loading };
};
