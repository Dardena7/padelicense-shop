import { useMutation } from "@apollo/client/react";
import { graphql } from "@/gql";

const DELETE_PRODUCT_IMAGE_MUTATION = graphql(`
  mutation AdminDeleteProductImage($input: AdminDeleteProductImageInput!) {
    adminDeleteProductImage(input: $input) {
      deletedId
    }
  }
`);

export const useDeleteProductImage = () => {
  const [mutate, { loading }] = useMutation(DELETE_PRODUCT_IMAGE_MUTATION);

  return { deleteImage: mutate, loading };
};
