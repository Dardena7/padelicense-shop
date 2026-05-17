import { useMutation } from "@apollo/client/react";
import { graphql } from "@/gql";

const UPDATE_VARIANT_MUTATION = graphql(`
  mutation AdminUpdateVariant($input: AdminUpdateVariantInput!) {
    adminUpdateVariant(input: $input) {
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

export const useUpdateVariant = () => {
  const [mutate, { loading }] = useMutation(UPDATE_VARIANT_MUTATION, {
    refetchQueries: ["AdminProduct"],
    awaitRefetchQueries: true,
  });

  return { updateVariant: mutate, loading };
};
