import { ApolloError, ApolloServer } from "apollo-server-lambda";
import lambdaPlayground from "graphql-playground-middleware-lambda";
import { verifyToken } from "./common/jwt";
import { useContext } from "./core/context";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/schema";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event, context, express }) => {
    const auth = express.req.headers["authorization"] as string;
    if (auth) {
      const [_, token] = auth.split("Bearer ");
      try {
        const user = verifyToken(token);
        if (user) {
          return useContext({
            type: "user",
            properties: {
              ...user,
            },
          });
        } else {
          throw new ApolloError("Not authenticated", "UNAUTHENTICATED");
        }
      } catch (ex) {}
    }
    return useContext({
      type: "public",
    });
  },
});
export const handler = server.createHandler({});

// for local endpointURL is /graphql and for prod it is /stage/graphql
export const playgroundHandler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return lambdaPlayground({
    endpoint: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  })(event, context, callback);
};
