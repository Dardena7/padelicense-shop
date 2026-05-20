import { graphql } from "@/gql";
import { getClient, localizedContext } from "@/lib/apollo";
import { nonNullable } from "@/lib/utils";

const GET_PRODUCTS = graphql(`
  query GetInitialProducts {
    products {
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

export const getInitialProducts = async (locale: string) => {
  const { data } = await getClient().query({
    query: GET_PRODUCTS,
    ...localizedContext(locale),
  });

  return (data?.products?.nodes ?? []).filter(nonNullable);
};
