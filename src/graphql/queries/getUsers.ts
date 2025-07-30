import { UserModel } from "../../models/User";
import { AppError } from "../../utils/errors";

export const getUsers = async (_: any, __: any, context: any) => {
  if (!context.isAuthenticated || context.user?.role !== "ADMIN") {
    throw new AppError("Access denied.", 403);
  }
  return await UserModel.find();
};
