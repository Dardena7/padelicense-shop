import { graphql } from "@/gql";

export const GET_CART = graphql(`
  query GetCart($guestUuid: String) {
    cart(guestUuid: $guestUuid) {
      id
      guestUuid
      totalCents
      items {
        id
        quantity
        productVariant {
          id
          name
          effectivePrice
          stockQuantity
          images {
            imageUrl
            altText
          }
        }
      }
    }
  }
`);
