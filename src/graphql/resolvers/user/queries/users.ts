import { UserModel } from "../../../../models/User";
import { requireAdmin } from "../../../../utils/auth";

export const users = async (_: any, __: any, context: any) => {
  await requireAdmin(context);
  return await UserModel.find().populate('role').sort({ createdAt: -1 });
};