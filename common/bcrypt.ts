import bcrypt from "bcrypt";
const COST = 11;

export const getHash = (data) => {
  const salt = bcrypt.genSaltSync(COST);
  const hash = bcrypt.hashSync(data, salt);
  return hash;
};

export const compareHash = (data, hash) => {
  return bcrypt.compareSync(data, hash);
};
