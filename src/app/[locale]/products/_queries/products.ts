import { graphql } from "@/gql";

export const GET_PRODUCTS = graphql(`
  query GetProducts($first: Int, $categorySlug: String, $featured: Boolean) {
    products(first: $first, categorySlug: $categorySlug, featured: $featured) {
      nodes {
        id
        name
        slug
        brand
        basePriceCents
        featured
        rating
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
