import { ApolloError } from "apollo-server-lambda";
import { UserForJWTGeneration } from "../types/user";

type Actor = UserActor | PublicActor;

type UserActor = {
  type: "user";
  properties: UserForJWTGeneration;
};

type PublicActor = {
  type: "public";
};

export function useContext(actor: Actor) {
  return {
    actor,
    assertAuthenticated() {
      if (actor.type === "public") {
        throw new ApolloError("Not authenticated", "UNAUTHENTICATED");
      }
      return actor.properties;
    },
    adminAuthorization() {
      if (actor.type === "public") {
        throw new ApolloError("Not authenticated", "UNAUTHENTICATED");
      }
      if (!actor.properties.admin) {
        throw new ApolloError("Not authorized", "UNAUTHORIZED");
      }
    },
  };
}

export type Context = ReturnType<typeof useContext>;
