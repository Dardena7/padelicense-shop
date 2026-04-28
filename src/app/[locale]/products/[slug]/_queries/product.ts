import { graphql } from "@/gql";

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
    }
  }
`);
