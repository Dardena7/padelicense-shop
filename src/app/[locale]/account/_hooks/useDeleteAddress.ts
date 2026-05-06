import { useMutation } from "@apollo/client/react";
import { graphql } from "@/gql";

const DELETE_ADDRESS = graphql(`
  mutation DeleteAddress($input: DeleteAddressInput!) {
    deleteAddress(input: $input) {
      address {
        id
      }
    }
  }
`);

export const useDeleteAddress = () => {
  const [mutate, { loading }] = useMutation(DELETE_ADDRESS);

  const deleteAddress = async (addressId: string) => {
    return mutate({ variables: { input: { addressId } } });
  };

  return { deleteAddress, loading };
};
