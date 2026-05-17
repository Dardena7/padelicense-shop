import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";
import { ProductStatus, ProductOrderBy } from "@/gql/graphql";
import { nonNullable } from "@/lib/utils";

const ADMIN_PRODUCTS_QUERY = graphql(`
  query AdminProducts(
    $status: ProductStatus
    $search: String
    $orderBy: ProductOrderBy
    $minPrice: Int
    $maxPrice: Int
  ) {
    products(
      status: $status
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

type AdminProductsFilters = {
  status?: ProductStatus;
  search?: string;
  orderBy?: ProductOrderBy;
  minPrice?: number;
  maxPrice?: number;
};

export const useAdminProducts = (filters: AdminProductsFilters = {}) => {
  const { data, loading } = useQuery(ADMIN_PRODUCTS_QUERY, {
    variables: {
      status: filters.status ?? null,
      search: filters.search || null,
      orderBy: filters.orderBy ?? null,
      minPrice: filters.minPrice ?? null,
      maxPrice: filters.maxPrice ?? null,
    },
    fetchPolicy: "cache-and-network",
  });

  const products = (data?.products?.nodes ?? []).filter(nonNullable);

  return { products, loading };
};
