import { UserModel } from "../../models/User";
import { AppError } from "../../utils/errors";

export const addUser = async (_: any, { input }: any, context: any) => {
  if (!context.isAuthenticated || context.user?.role !== "ADMIN") {
    throw new AppError("Access denied.", 403);
  }
  const { name, email } = input;
  const exists = await UserModel.findOne({ email });
  if (exists) throw new AppError("Email already exists", 400);
  const user = new UserModel({ name, email });
  await user.save();
  return user;
};
