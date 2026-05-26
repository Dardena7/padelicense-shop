import { graphql } from "@/gql";
import { getClient, localizedContext } from "@/lib/apollo";
import { nonNullable } from "@/lib/utils";
import { CATALOG_PAGE_SIZE } from "@/lib/constants";

const GET_CATEGORY_PRODUCTS = graphql(`
  query GetCategoryProducts($filters: ProductSearchInput, $first: Int) {
    products(filters: $filters, first: $first) {
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

export const getCategoryProducts = async (slug: string, locale: string) => {
  const { data } = await getClient().query({
    query: GET_CATEGORY_PRODUCTS,
    variables: { filters: { categorySlug: slug }, first: CATALOG_PAGE_SIZE },
    ...localizedContext(locale),
  });
  return {
    products: (data?.products?.nodes ?? []).filter(nonNullable),
    pageInfo: data?.products?.pageInfo ?? {
      hasNextPage: false,
      endCursor: null,
    },
  };
};
