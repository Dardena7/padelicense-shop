import { graphql } from "@/gql";

export const UPDATE_CART_ITEM = graphql(`
  mutation UpdateCartItem($input: UpdateCartItemInput!) {
    updateCartItem(input: $input) {
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
          }            images {
              imageUrl
              altText
            }
          }
        }
      }
    }
  }
`);
