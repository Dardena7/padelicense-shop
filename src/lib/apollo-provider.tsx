"use client";

import { HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";
import { tokenStore } from "./token-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/graphql";

function makeClient() {
  const httpLink = new HttpLink({ uri: API_URL });

  const authLink = new SetContextLink((prevContext) => {
    const token = tokenStore.getAccessToken();

    return {
      headers: {
        ...prevContext.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });
}

export default function ApolloClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
