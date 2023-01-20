import { ApolloError, UserInputError } from "apollo-server-lambda";
import { compareHash } from "../common/bcrypt";
import { getJWT } from "../common/jwt";
import { User } from "../model/user";
import { registerInputValidator } from "../utils/validators";

const validateRegisterInput = (input: User.CreateOpts) => {
  const { error } = registerInputValidator(input);
  if (error) {
    throw new UserInputError(
      "Failed to register user due to input validation errors",
      {
        validationErrors: error.details,
      }
    );
  }
};
const validateNotADuplicateEmail = async (email: string) => {
  const user = await User.findByEmail(email);
  if (user && user.encrypted_password) {
    throw new ApolloError("email is already used", "EMAIL_EXISTS");
  }
};

export const getAll = () => {
  return User.getAll();
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApolloError("User does not exist", "USER_NOT_FOUND");
  }
  return user;
};

export const register = async (input) => {
  validateRegisterInput(input);
  await validateNotADuplicateEmail(input.email);
  const result = await User.create(input);
  const insertedRowId = result[0].id;
  const userDataForJWT = {
    id: insertedRowId,
    email: input.email,
    name: input.name,
    admin: false,
  };
  const jwt = getJWT(userDataForJWT);
  return {
    user: userDataForJWT,
    token: jwt,
  };
};

export const login = async (input) => {
  const { email, password } = input;
  const user = await User.findByEmail(email);
  if (!user) {
    throw new ApolloError(
      "User does not exist with this email",
      "UserInputError"
    );
  }
  const isMatch = compareHash(password, user.encrypted_password);
  if (!isMatch) {
    throw new ApolloError("Invalid password", "UserInputError");
  }
  const userDataForJWT = {
    id: user.id,
    email: user.email,
    name: user.name,
    admin: user.admin,
  };
  const jwt = getJWT(userDataForJWT);
  return {
    user,
    token: jwt,
  };
};
