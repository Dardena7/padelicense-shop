import { HttpLink } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/graphql";

// For Server Components (public queries only, no auth)
export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({ uri: API_URL }),
  });
});
