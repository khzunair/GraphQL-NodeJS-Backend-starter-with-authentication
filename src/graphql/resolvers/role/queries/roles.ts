import { RoleModel } from "../../../../models/Role";
import { requireAdmin } from "../../../../utils/auth";

export const roles = async (_: any, __: any, context: any) => {
  await requireAdmin(context);
  return await RoleModel.find().sort({ priority: -1, createdAt: -1 });
};