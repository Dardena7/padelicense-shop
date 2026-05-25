import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";
import { type ProductSearchInput } from "@/gql/graphql";
import { nonNullable } from "@/lib/utils";

export const PAGE_SIZE = 12;

const PRODUCTS_QUERY = graphql(`
  query ShopProducts(
    $filters: ProductSearchInput
    $first: Int
    $after: String
  ) {
    products(filters: $filters, first: $first, after: $after) {
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
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`);

export const useProducts = (filters: ProductSearchInput = {}) => {
  const { data, loading, fetchMore } = useQuery(PRODUCTS_QUERY, {
    variables: { filters, first: PAGE_SIZE },
  });

  const products = (data?.products?.nodes ?? []).filter(nonNullable);
  const pageInfo = data?.products?.pageInfo;
  const hasNextPage = pageInfo?.hasNextPage ?? false;

  const endCursor = pageInfo?.endCursor;
  const loadMore = () => {
    if (!endCursor) return;
    fetchMore({ variables: { after: endCursor } });
  };

  return { products, loading, hasNextPage, loadMore };
};
