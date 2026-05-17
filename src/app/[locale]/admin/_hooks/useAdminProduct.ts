import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";

const ADMIN_PRODUCT_QUERY = graphql(`
  query AdminProduct($id: ID!) {
    node(id: $id) {
      ... on Product {
        id
        name
        brand
        basePriceCents
        status
        featured
        category {
          id
          name
        }
        translations {
          locale
          name
          slug
          description
        }
        variants {
          id
          name
          sku
          priceCents
          stockQuantity
        }
        images {
          id
          imageUrl
          position
        }
      }
    }
  }
`);

export const useAdminProduct = (id: string) => {
  const { data, loading } = useQuery(ADMIN_PRODUCT_QUERY, {
    variables: { id },
  });

  const product = data?.node?.__typename === "Product" ? data.node : null;

  return { product, loading };
};
