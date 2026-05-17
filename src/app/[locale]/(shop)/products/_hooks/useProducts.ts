import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";
import { ProductOrderBy } from "@/gql/graphql";
import { nonNullable } from "@/lib/utils";

const PRODUCTS_QUERY = graphql(`
  query ShopProducts(
    $first: Int
    $categorySlug: String
    $search: String
    $orderBy: ProductOrderBy
    $minPrice: Int
    $maxPrice: Int
  ) {
    products(
      first: $first
      categorySlug: $categorySlug
      search: $search
      orderBy: $orderBy
      minPrice: $minPrice
      maxPrice: $maxPrice
    ) {
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

type ProductsFilters = {
  categorySlug?: string;
  search?: string;
  orderBy?: ProductOrderBy;
  minPrice?: number;
  maxPrice?: number;
};

export const useProducts = (filters: ProductsFilters = {}) => {
  const { data, loading } = useQuery(PRODUCTS_QUERY, {
    variables: {
      categorySlug: filters.categorySlug || null,
      search: filters.search || null,
      orderBy: filters.orderBy ?? null,
      minPrice: filters.minPrice ?? null,
      maxPrice: filters.maxPrice ?? null,
    },
  });

  const products = (data?.products?.nodes ?? []).filter(nonNullable);

  return { products, loading };
};
