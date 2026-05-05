import { graphql } from "@/gql";

export const ADD_ITEM_TO_CART = graphql(`
  mutation AddItemToCart($input: AddItemToCartInput!) {
    addItemToCart(input: $input) {
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
