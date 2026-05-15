import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";

const ADMIN_CATEGORIES_QUERY = graphql(`
  query AdminCategories {
    categories {
      id
      name
      position
      productsCount
      translations {
        locale
        name
        slug
        description
      }
      subcategories {
        id
        name
        position
        productsCount
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

export const useAdminCategories = () => {
  const { data, loading } = useQuery(ADMIN_CATEGORIES_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const categories = data?.categories ?? [];

  return { categories, loading };
};
