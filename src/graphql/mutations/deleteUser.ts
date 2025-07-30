import { UserModel } from "../../models/User";
import { AppError } from "../../utils/errors";

export const deleteUser = async (_: any, { id }: any, context: any) => {
  if (!context.isAuthenticated || context.user?.role !== "ADMIN") {
    throw new AppError("Access denied.", 403);
  }
  const res = await UserModel.deleteOne({ _id: id });
  if (res.deletedCount !== 1) throw new AppError("User not found", 404);
  return true;
};
