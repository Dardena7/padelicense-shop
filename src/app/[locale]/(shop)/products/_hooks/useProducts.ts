import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";
import { type ProductSearchInput } from "@/gql/graphql";
import { nonNullable } from "@/lib/utils";

const PRODUCTS_QUERY = graphql(`
  query ShopProducts($filters: ProductSearchInput) {
    products(filters: $filters) {
      nodes {
        id
        name
        slug
        brand
        basePriceCents
        featured
        category {
          name
          slug
        }
        variants {
          id
          name
          effectivePrice
          stockQuantity
        }
        images {
          imageUrl
          altText
          position
        }
      }
    }
  }
`);

export const useProducts = (filters: ProductSearchInput = {}) => {
  const { data, loading } = useQuery(PRODUCTS_QUERY, {
    variables: { filters },
  });

  const products = (data?.products?.nodes ?? []).filter(nonNullable);

  return { products, loading };
};
