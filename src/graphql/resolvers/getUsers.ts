import { UserModel } from "../../models/User";

export const getUsers = async (_: any, __: any, context: any) => {
  if (context.user?.role !== "ADMIN") {
    throw new Error("Access denied.");
  }

  return await UserModel.find();
};
