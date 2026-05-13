import { useMutation } from "@apollo/client/react";
import { graphql } from "@/gql";

const UPDATE_ADDRESS = graphql(`
  mutation UpdateAddress($input: UpdateAddressInput!) {
    updateAddress(input: $input) {
      address {
        id
        label
        line1
        line2
        city
        postalCode
        countryIso
        default
      }
    }
  }
`);

type AddressInput = {
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  countryIso: string;
  default?: boolean;
};

export const useUpdateAddress = () => {
  const [mutate, { loading }] = useMutation(UPDATE_ADDRESS);

  const updateAddress = async (addressId: string, input: AddressInput) => {
    return mutate({ variables: { input: { addressId, input } } });
  };

  return { updateAddress, loading };
};
