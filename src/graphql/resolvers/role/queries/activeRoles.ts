import { RoleModel } from "../../../../models/Role";
import { requireAdmin } from "../../../../utils/auth";

export const activeRoles = async (_: any, __: any, context: any) => {
  await requireAdmin(context);
  return await RoleModel.find({ isActive: true }).sort({ priority: -1 });
};