import { useMutation } from "@apollo/client/react";
import { graphql } from "@/gql";

const UPDATE_CATEGORY_MUTATION = graphql(`
  mutation AdminUpdateCategory($input: AdminUpdateCategoryInput!) {
    adminUpdateCategory(input: $input) {
      category {
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

export const useUpdateCategory = () => {
  const [mutate, { loading }] = useMutation(UPDATE_CATEGORY_MUTATION);

  return { updateCategory: mutate, loading };
};
