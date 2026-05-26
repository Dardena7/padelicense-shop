import { graphql } from "@/gql";
import { getClient, localizedContext } from "@/lib/apollo";
import { nonNullable } from "@/lib/utils";

const GET_NAV_CATEGORIES = graphql(`
  query GetNavCategories {
    categories {
      id
      name
      slug
      subcategories {
        id
        name
        slug
      }
    }
  }
`);

export const getNavCategories = async (locale: string) => {
  const { data } = await getClient().query({
    query: GET_NAV_CATEGORIES,
    ...localizedContext(locale),
  });

  return (data?.categories ?? []).filter(nonNullable);
};
