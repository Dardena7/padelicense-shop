import { useMutation } from "@apollo/client/react";
import { graphql } from "@/gql";

const CREATE_VARIANT_MUTATION = graphql(`
  mutation AdminCreateVariant($input: AdminCreateVariantInput!) {
    adminCreateVariant(input: $input) {
      variant {
        id
        name
        sku
        priceCents
        stockQuantity
      }
    }
  }
`);

export const useCreateVariant = () => {
  const [mutate, { loading }] = useMutation(CREATE_VARIANT_MUTATION, {
    refetchQueries: ["AdminProduct"],
    awaitRefetchQueries: true,
  });

  return { createVariant: mutate, loading };
};
