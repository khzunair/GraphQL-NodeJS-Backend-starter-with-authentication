import { hash } from "bcryptjs";
import { UserModel } from "../../models/User";

export const registerUser = async (_: any, { email, password, name }: any) => {
  const existing = await UserModel.findOne({ email });
  if (existing) throw new Error("Email already in use");

  const hashed = await hash(password, 10);
  const user = await UserModel.create({ email, password: hashed, name });

  return user;
};
