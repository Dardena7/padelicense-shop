import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";

const ADMIN_CATEGORY_QUERY = graphql(`
  query AdminCategory($id: ID!) {
    node(id: $id) {
      ... on Category {
        id
        name
        position
        parent {
          id
        }
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

export const useAdminCategory = (id: string) => {
  const { data, loading } = useQuery(ADMIN_CATEGORY_QUERY, {
    variables: { id },
  });

  const category = data?.node?.__typename === "Category" ? data.node : null;

  return { category, loading };
};
