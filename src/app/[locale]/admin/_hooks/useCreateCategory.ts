import { useMutation } from "@apollo/client/react";
import { graphql } from "@/gql";

const CREATE_CATEGORY_MUTATION = graphql(`
  mutation AdminCreateCategory($input: AdminCreateCategoryInput!) {
    adminCreateCategory(input: $input) {
      category {
        id
        name
      }
    }
  }
`);

export const useCreateCategory = () => {
  const [mutate, { loading }] = useMutation(CREATE_CATEGORY_MUTATION);

  return { createCategory: mutate, loading };
};
