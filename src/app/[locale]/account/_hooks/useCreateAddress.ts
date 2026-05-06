import { useMutation } from "@apollo/client/react";
import { graphql } from "@/gql";

const CREATE_ADDRESS = graphql(`
  mutation CreateAddress($input: CreateAddressInput!) {
    createAddress(input: $input) {
      address {
        id
        label
        line1
        line2
        city
        postalCode
        countryIso
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
};

export const useCreateAddress = () => {
  const [mutate, { loading }] = useMutation(CREATE_ADDRESS);

  const createAddress = async (input: AddressInput) => {
    return mutate({ variables: { input: { input } } });
  };

  return { createAddress, loading };
};
