import Joi, { ValidationResult } from "joi";
import { User } from "../model/user";

export const registerInputValidator = (
  input: User.CreateOpts
): ValidationResult => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  return schema.validate(input, { abortEarly: false });
};
