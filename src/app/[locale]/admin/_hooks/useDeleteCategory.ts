import { useMutation } from "@apollo/client/react";
import { graphql } from "@/gql";

const DELETE_CATEGORY_MUTATION = graphql(`
  mutation AdminDeleteCategory($input: AdminDeleteCategoryInput!) {
    adminDeleteCategory(input: $input) {
      deletedId
    }
  }
`);

export const useDeleteCategory = () => {
  const [mutate, { loading }] = useMutation(DELETE_CATEGORY_MUTATION, {
    refetchQueries: ["AdminCategories"],
    awaitRefetchQueries: true,
  });

  return { deleteCategory: mutate, loading };
};
