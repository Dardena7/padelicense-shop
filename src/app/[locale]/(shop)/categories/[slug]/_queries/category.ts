import { cache } from "react";
import { graphql } from "@/gql";
import { getClient, localizedContext } from "@/lib/apollo";
import { nonNullable } from "@/lib/utils";
import { PAGE_SIZE } from "@/app/[locale]/(shop)/products/_hooks/useProducts";

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

export const getCategory = cache(async (slug: string, locale: string) => {
  const { data } = await getClient().query({
    query: GET_CATEGORY,
    variables: { slug },
    ...localizedContext(locale),
  });
  return data?.category ?? null;
});

export const getCategoryProducts = async (slug: string, locale: string) => {
  const { data } = await getClient().query({
    query: GET_CATEGORY_PRODUCTS,
    variables: { filters: { categorySlug: slug }, first: PAGE_SIZE },
    ...localizedContext(locale),
  });
  return {
    products: (data?.products?.nodes ?? []).filter(nonNullable),
    pageInfo: data?.products?.pageInfo ?? { hasNextPage: false, endCursor: null },
  };
};
