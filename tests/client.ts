import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client/core";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "apollo-link-context";
import fetch from "node-fetch";

const _localUrl = "http://localhost:4000/test/graphql";

const httpLink = createUploadLink({
  uri: _localUrl,
  fetch,
});

const getAuthLinkLoggedInUser = (token: string) => {
  return setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    };
  });
};
const publicAuthLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    },
  };
});

function createApolloClientInstance(token: string) {
  return new ApolloClient({
    link: ApolloLink.from([getAuthLinkLoggedInUser(token), httpLink]),
    cache: new InMemoryCache(),
  });
}

const publicClient = new ApolloClient({
  link: ApolloLink.from([publicAuthLink, httpLink]),
  cache: new InMemoryCache(),
});
export { createApolloClientInstance, publicClient };
