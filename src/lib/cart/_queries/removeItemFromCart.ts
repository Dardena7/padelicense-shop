import { graphql } from "@/gql";

export const REMOVE_ITEM_FROM_CART = graphql(`
  mutation RemoveItemFromCart($input: RemoveItemFromCartInput!) {
    removeItemFromCart(input: $input) {
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
