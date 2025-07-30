import { UserModel } from "../../models/User";
import { AppError } from "../../utils/errors";

export const updateUser = async (_: any, { id, name, email }: any, context: any) => {
  if (!context.isAuthenticated || context.user?.role !== "ADMIN") {
    throw new AppError("Access denied.", 403);
  }
  if (!name && !email) {
    throw new AppError("At least one field (name or email) must be provided for update", 400);
  }
  const user = await UserModel.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  await UserModel.findByIdAndUpdate(id, { name, email }, { new: true });
  return user;
};
