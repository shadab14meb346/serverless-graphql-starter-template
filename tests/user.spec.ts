import { gql } from "graphql-tag";
import { getJWT } from "../common/jwt";
import { User } from "../model/user";
import { createApolloClientInstance, publicClient } from "./client";

const REGISTER_USER_MUTATION = gql`
  mutation ($input: RegistrationInput!) {
    register(input: $input) {
      user {
        id
        email
        name
      }
      token
    }
  }
`;

const LOG_IN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
        name
      }
      token
    }
  }
`;

const GET_ALL_USERS_QUERY = gql`
  query GetAllUsers {
    getAllUsers {
      email
      id
      name
      admin
    }
  }
`;

const loginUserRequest = async (email: string, password: string) => {
  const payload = {
    email,
    password,
  };
  const loginResponse = await publicClient.mutate({
    mutation: LOG_IN_MUTATION,
    variables: {
      input: payload,
    },
  });
  return loginResponse;
};

const registerUserRequest = async (input: User.CreateOpts) => {
  const registerResponse = await publicClient.mutate({
    mutation: REGISTER_USER_MUTATION,
    variables: { input },
  });

  return registerResponse;
};
describe("test the registration mutation", () => {
  test("Should register a new user successfully", async () => {
    const input = {
      email: "newemail@gmail.com",
    };
    const response = await registerUserRequest(input);
    expect(typeof response.data.register.user.id).toBe("number");
    expect(response.data.register.token).toBeTruthy();
    expect(typeof response.data.register.token).toBe("string");
    expect(response.data.register.user.email).toStrictEqual(input.email);
  });
  test("Should throw an error when duplicate email is used to register, who password is not yet setup", async () => {
    const input = {
      email: "newemail@gmail.com",
    };
    await expect(registerUserRequest(input)).rejects.toThrowError(
      "set password"
    );
  });
  test("Should throw an error when duplicate email is used to register, who password is setup", async () => {
    //this user is inserted in the setup.ts
    const email = "totallynewuser@gmail.com";
    const input = {
      email,
    };
    await expect(registerUserRequest(input)).rejects.toThrowError(
      "login required"
    );
  });
});

describe("test the invalid input for registration", () => {
  test("Should throw an error about email being empty", async () => {
    const input = {
      email: "",
    };
    try {
      await registerUserRequest(input);
    } catch (error: any) {
      const validationErrors =
        error.graphQLErrors[0].extensions.validationErrors;
      expect(error.message).toBe(
        "Failed to register user due to input validation errors"
      );
      expect(validationErrors.length).toBe(1);
      expect(validationErrors[0].message).toBe(
        '"email" is not allowed to be empty'
      );
    }
  });
});

describe("test login", () => {
  //this user is inserted in the setup.ts
  const CORRECT_EMAIL = "totallynewuser@gmail.com";
  test("login with correct credentials", async () => {
    const CORRECT_PASSWORD = "12345";
    const response = await loginUserRequest(CORRECT_EMAIL, CORRECT_PASSWORD);
    expect(response.data.login.user).toBeTruthy();
    expect(response.data.login.user.email).toBe(CORRECT_EMAIL);
    expect(response.data.login.token).toBeTruthy();
  });
  test("login with incorrect password", async () => {
    const INCORRECT_PASSWORD = "123456781";
    await expect(
      loginUserRequest(CORRECT_EMAIL, INCORRECT_PASSWORD)
    ).rejects.toThrowError("Invalid password");
  });
  test("login with non existent email", async () => {
    const PASSWORD = "12345";
    const NONEXISTENT_EMAIL = "admin1@blah.com";
    await expect(
      loginUserRequest(NONEXISTENT_EMAIL, PASSWORD)
    ).rejects.toThrowError("User does not exist with this email");
  });
});

describe("test getAllUsers query", () => {
  test("Should return all users", async () => {
    const loginResponse = await loginUserRequest("admin@test.com", "12345");
    const token = loginResponse.data.login.token;
    const adminClient = createApolloClientInstance(token);
    const response = await adminClient.query({
      query: GET_ALL_USERS_QUERY,
    });
    expect(response.data.getAllUsers).toBeInstanceOf(Array);
    expect(response.data.getAllUsers.length).toBeTruthy();
  });
  test("Should throw error when a public user query the getAllUsers", async () => {
    await expect(
      publicClient.query({ query: GET_ALL_USERS_QUERY })
    ).rejects.toThrowError("Not authenticated");
  });
  test("Should throw error when an un authorized user query the getAllUsers", async () => {
    const response = await registerUserRequest({
      email: "maytheforce@gmail.com",
    });
    const nonAdminUserClient = createApolloClientInstance(
      response.data.register.token
    );
    await expect(
      nonAdminUserClient.query({ query: GET_ALL_USERS_QUERY })
    ).rejects.toThrowError("Not authorized");
  });
});

const GET_ME_QUERY = gql`
  query GetMe {
    getMe {
      id
      email
      name
      admin
    }
  }
`;
const getMeRequest = async (token: string) => {
  const client = createApolloClientInstance(token);
  const response = await client.query({
    query: GET_ME_QUERY,
  });
  return response.data.getMe;
};
describe("test getMe query", () => {
  test("Should return the user who is logged in", async () => {
    const TOKEN = getJWT({
      //this user is inserted in setup.ts
      id: 999,
      email: "userid999@gmail.com",
      name: "userid999",
      admin: false,
    });
    const user = await getMeRequest(TOKEN);
    expect(user.id).toBe(999);
    expect(user.email).toBe("userid999@gmail.com");
    expect(user.name).toBe("userid999");
    expect(user.admin).toBe(false);
  });
});
