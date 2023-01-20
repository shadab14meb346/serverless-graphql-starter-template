import { ApolloError } from "apollo-server-lambda";
import jwt from "jsonwebtoken";
import { UserForJWTGeneration } from "../types/user";
const JWT_SECRET = process.env.JWT_SECRET;

export const getJWT = (userData: UserForJWTGeneration): string => {
  const token = jwt.sign(userData, JWT_SECRET);
  return token;
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      throw new ApolloError("Not authenticated", "UNAUTHENTICATED");
    }
    return decoded;
  } catch (error) {}
};
