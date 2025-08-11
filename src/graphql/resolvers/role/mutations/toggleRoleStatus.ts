import { RoleModel } from "../../../../models/Role";
import { requireAdmin } from "../../../../utils/auth";
import { ValidationError } from "../../../../utils/errors";

export const toggleRoleStatus = async (_: any, { id }: { id: string }, context: any) => {
  await requireAdmin(context);

  const role = await RoleModel.findById(id);
  if (!role) {
    throw new ValidationError("Role not found");
  }

  if (role.name === 'ADMIN') {
    throw new ValidationError("Cannot deactivate ADMIN role");
  }

  role.isActive = !role.isActive;
  return await role.save();
};