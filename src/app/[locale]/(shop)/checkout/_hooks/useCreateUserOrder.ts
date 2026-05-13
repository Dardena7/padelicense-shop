import { useMutation } from "@apollo/client/react";
import { graphql } from "@/gql";

const CREATE_USER_ORDER = graphql(`
  mutation CreateUserOrder($input: CreateUserOrderInput!) {
    createUserOrder(input: $input) {
      order {
        id
        uuid
        number
        status
        totalCents
      }
      clientSecret
    }
  }
`);

export const useCreateUserOrder = () => {
  const [mutate, { loading }] = useMutation(CREATE_USER_ORDER);

  const createUserOrder = async (addressId: string) => {
    const { data } = await mutate({ variables: { input: { addressId } } });
    return data?.createUserOrder ?? null;
  };

  return { createUserOrder, loading };
};
