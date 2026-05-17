import { useMutation } from "@apollo/client/react";
import { graphql } from "@/gql";

const DELETE_VARIANT_MUTATION = graphql(`
  mutation AdminDeleteVariant($input: AdminDeleteVariantInput!) {
    adminDeleteVariant(input: $input) {
      deletedId
    }
  }
`);

export const useDeleteVariant = () => {
  const [mutate, { loading }] = useMutation(DELETE_VARIANT_MUTATION, {
    refetchQueries: ["AdminProduct"],
    awaitRefetchQueries: true,
  });

  return { deleteVariant: mutate, loading };
};
