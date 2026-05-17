import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";
import { ProductStatus } from "@/gql/graphql";
import { nonNullable } from "@/lib/utils";

const ADMIN_PRODUCTS_QUERY = graphql(`
  query AdminProducts($status: ProductStatus) {
    products(status: $status) {
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

export const useAdminProducts = (status?: ProductStatus) => {
  const { data, loading } = useQuery(ADMIN_PRODUCTS_QUERY, {
    variables: { status: status ?? null },
    fetchPolicy: "cache-and-network",
  });

  const products = (data?.products?.nodes ?? []).filter(nonNullable);

  return { products, loading };
};
