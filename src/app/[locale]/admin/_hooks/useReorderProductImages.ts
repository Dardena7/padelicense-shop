import { useMutation } from "@apollo/client/react";
import { graphql } from "@/gql";

const REORDER_PRODUCT_IMAGES_MUTATION = graphql(`
  mutation AdminReorderProductImages(
    $input: AdminReorderProductImagesInput!
  ) {
    adminReorderProductImages(input: $input) {
      images {
        id
        position
      }
    }
  }
`);

export const useReorderProductImages = () => {
  const [mutate, { loading }] = useMutation(REORDER_PRODUCT_IMAGES_MUTATION);

  return { reorderImages: mutate, loading };
};
