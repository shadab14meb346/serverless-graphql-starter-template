import { ApolloError } from "apollo-server-lambda";

import { IUser } from "../types/user";
import { PostGrace } from "../core/db-connection";
import { getHash } from "../common/bcrypt";

export async function getAll() {
  const results = await PostGrace.DB().select("*").from("users");
  return results;
}

export type CreateOpts = {
  email: string;
  password: string;
};

export async function create(opts: CreateOpts) {
  try {
    const { email, password } = opts;
    const encryptedPassword = getHash(password);
    const results = await PostGrace.DB()
      .insert({
        email,
        encrypted_password: encryptedPassword,
      })
      .returning("id")
      .into("users");
    return results;
  } catch (error) {
    throw new ApolloError("Couldn't create user", "DBError");
  }
}

export async function findById(id: number): Promise<IUser> {
  try {
    const results = await PostGrace.DB()
      .select("id", "email", "name", "admin")
      .from("users")
      .where({ id });
    return results[0];
  } catch (error) {
    throw new ApolloError("Couldn't find user", "DBError");
  }
}

export async function findByEmail(email: string) {
  try {
    const results = await PostGrace.DB()
      .select("encrypted_password", "id", "email", "name", "admin")
      .from("users")
      .where({ email });
    return results[0];
  } catch (error) {
    throw new ApolloError("Couldn't find user", "DBError");
  }
}
export * as User from "./user";
