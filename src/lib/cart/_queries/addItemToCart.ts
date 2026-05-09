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
