import { graphql } from "@/gql";

export const CLAIM_GUEST_CART = graphql(`
  mutation ClaimGuestCart($input: ClaimGuestCartInput!) {
    claimGuestCart(input: $input) {
      cart {
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
            product {
              id
              name
            }
            images {
              imageUrl
              altText
            }
          }
        }
      }
    }
  }
`);
