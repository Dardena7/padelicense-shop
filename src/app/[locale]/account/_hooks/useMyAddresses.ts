import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";

const GET_MY_ADDRESSES = graphql(`
  query GetMyAddresses {
    me {
      id
      addresses {
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

type UseMyAddressesOptions = {
  skip?: boolean;
};

export const useMyAddresses = (options?: UseMyAddressesOptions) => {
  const { data, loading, refetch } = useQuery(GET_MY_ADDRESSES, {
    skip: options?.skip,
  });

  const addresses = data?.me?.addresses ?? [];

  return { addresses, loading, refetch };
};
