import { graphql } from "@/gql";

export const GET_PRODUCTS = graphql(`
  query GetProducts(
    $first: Int
    $categorySlug: String
    $featured: Boolean
    $search: String
    $orderBy: ProductOrderBy
    $minPrice: Int
    $maxPrice: Int
  ) {
    products(
      first: $first
      categorySlug: $categorySlug
      featured: $featured
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
