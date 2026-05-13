import { useMutation } from "@apollo/client/react";
import { graphql } from "@/gql";

const UPDATE_PROFILE = graphql(`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      user {
        id
        publicId
        firstName
        lastName
        email
        phone
      }
    }
  }
`);

type ProfileInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export const useUpdateProfile = () => {
  const [mutate, { loading }] = useMutation(UPDATE_PROFILE);

  const updateProfile = async (input: ProfileInput) => {
    const { data } = await mutate({ variables: { input } });
    return data?.updateProfile?.user ?? null;
  };

  return { updateProfile, loading };
};
