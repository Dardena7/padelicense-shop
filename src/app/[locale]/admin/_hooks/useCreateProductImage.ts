import { useMutation } from "@apollo/client/react";
import { graphql } from "@/gql";

const CREATE_PRODUCT_IMAGE_MUTATION = graphql(`
  mutation AdminCreateProductImage($input: AdminCreateProductImageInput!) {
    adminCreateProductImage(input: $input) {
      image {
        id
        imageUrl
        position
        altText
      }
    }
  }
`);

export const useCreateProductImage = () => {
  const [mutate, { loading }] = useMutation(CREATE_PRODUCT_IMAGE_MUTATION, {
    refetchQueries: ["AdminProduct"],
    awaitRefetchQueries: true,
  });

  return { createImage: mutate, loading };
};
