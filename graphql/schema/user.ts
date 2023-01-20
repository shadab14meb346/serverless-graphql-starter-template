import { gql } from "apollo-server-lambda";

const userTypeDef = gql`
  type Query {
    getAllUsers: [User!]!
    getMe: User!
  }

  type Mutation {
    register(input: RegistrationInput!): RegistrationResponse!
    getAllUsers: [User!]!
    login(input: LoginInput!): LoginResponse!
  }

  input RegistrationInput {
    email: String!
  }

  type User {
    id: Int!
    email: String!
    name: String
    admin: Boolean!
  }
  type RegistrationResponse {
    user: User!
    token: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type LoginResponse {
    user: User!
    token: String!
  }
`;

export default userTypeDef;
