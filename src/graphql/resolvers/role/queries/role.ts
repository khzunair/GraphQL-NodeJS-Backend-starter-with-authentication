import { RoleModel } from "../../../../models/Role";
import { requireAdmin } from "../../../../utils/auth";
import { ValidationError } from "../../../../utils/errors";

export const role = async (_: any, { id }: { id: string }, context: any) => {
  await requireAdmin(context);
  const role = await RoleModel.findById(id);
  if (!role) {
    throw new ValidationError("Role not found");
  }
  return role;
};