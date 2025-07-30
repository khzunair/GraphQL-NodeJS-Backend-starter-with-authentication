import { hash } from "bcryptjs";
import { UserModel } from "../../models/User";
import { AppError } from "../../utils/errors";

export const registerUser = async (_: any, { email, password, name }: any) => {
  const existing = await UserModel.findOne({ email });
  if (existing) throw new AppError("Email already in use", 400);

  const hashed = await hash(password, 10);
  const user = await UserModel.create({ email, password: hashed, name });

  return user;
};
