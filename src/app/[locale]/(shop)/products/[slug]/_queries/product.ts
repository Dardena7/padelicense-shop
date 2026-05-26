import { cache } from "react";
import { graphql } from "@/gql";
import { getClient, localizedContext } from "@/lib/apollo";

export const GET_PRODUCT = graphql(`
  query GetProduct($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      description
      brand
      basePriceCents
      status
      featured
      category {
        name
        slug
        parent {
          name
          slug
          parent {
            name
            slug
          }
        }
      }
      variants {
        id
        name
        sku
        effectivePrice
        stockQuantity
      }
      images {
        imageUrl
        altText
        position
      }
      alternateSlugs {
        locale
        value
      }
    }
  }
`);

export const getProduct = cache(async (slug: string, locale: string) => {
  const { data } = await getClient().query({
    query: GET_PRODUCT,
    variables: { slug },
    ...localizedContext(locale),
  });
  return data?.product ?? null;
});
