import { cache } from "react";
import { graphql } from "@/gql";
import { getClient, localizedContext } from "@/lib/apollo";

const GET_CATEGORY = graphql(`
  query GetCategory($slug: String!) {
    category(slug: $slug) {
      id
      name
      slug
      description
      productsCount
      alternateSlugs {
        locale
        value
      }
      parent {
        name
        slug
        parent {
          name
          slug
        }
      }
      subcategories {
        id
        name
        slug
        description
        productsCount
      }
    }
  }
`);

export const getCategory = cache(async (slug: string, locale: string) => {
  const { data } = await getClient().query({
    query: GET_CATEGORY,
    variables: { slug },
    ...localizedContext(locale),
  });
  return data?.category ?? null;
});
