import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";
import { type ProductSearchInput } from "@/gql/graphql";
import { nonNullable } from "@/lib/utils";

const ADMIN_PRODUCTS_QUERY = graphql(`
  query AdminProducts($filters: ProductSearchInput) {
    products(filters: $filters) {
      nodes {
        id
        name
        slug
        brand
        basePriceCents
        status
        featured
        createdAt
        category {
          id
          name
        }
        variants {
          id
          name
          sku
          stockQuantity
        }
        images {
          id
          imageUrl
        }
      }
    }
  }
`);

export const useAdminProducts = (filters: ProductSearchInput = {}) => {
  const { data, loading } = useQuery(ADMIN_PRODUCTS_QUERY, {
    variables: { filters },
    fetchPolicy: "cache-and-network",
  });

  const products = (data?.products?.nodes ?? []).filter(nonNullable);

  return { products, loading };
};
