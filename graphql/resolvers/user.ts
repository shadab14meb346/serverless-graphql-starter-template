import { ApolloError, UserInputError } from "apollo-server-lambda";
import { compareHash } from "../../common/bcrypt";
import { getJWT } from "../../common/jwt";
import { User } from "../../model/user";
import { registerInputValidator } from "../../utils/validators";

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
export const UserResolver = {
  Query: {
    getAllUsers: async (_parent, _args, ctx, _info) => {
      ctx.assertAuthenticated();
      ctx.adminAuthorization();
      return await User.getAll();
    },
    getMe: async (_parent, _args, ctx, _info) => {
      const user = ctx.assertAuthenticated();
      const result = await User.findById(user.id);
      if (!result) {
        throw new ApolloError("User does not exist", "USER_NOT_FOUND");
      }
      return result;
    },
  },
  Mutation: {
    register: async (_parent, args) => {
      validateRegisterInput(args.input);
      await validateNotADuplicateEmail(args.input.email);
      const result = await User.create(args.input);
      const insertedRowId = result[0].id;
      const userDataForJWT = {
        id: insertedRowId,
        email: args.input.email,
        name: args.input.name,
        admin: false,
      };
      const jwt = getJWT(userDataForJWT);
      return {
        user: userDataForJWT,
        token: jwt,
      };
    },
    login: async (_parent, args) => {
      const { email, password } = args.input;
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
    },
  },
};
