import { RoleModel } from "../../../../models/Role";
import { requireAdmin } from "../../../../utils/auth";
import { ValidationError } from "../../../../utils/errors";

interface UpdateRoleInput {
  displayName?: string;
  description?: string;
  permissions?: string[];
  isActive?: boolean;
  priority?: number;
}

export const updateRole = async (_: any, { id, input }: { id: string; input: UpdateRoleInput }, context: any) => {
  await requireAdmin(context);

  const role = await RoleModel.findById(id);
  if (!role) {
    throw new ValidationError("Role not found");
  }

  // Prevent updating system roles
  if (['ADMIN', 'USER'].includes(role.name)) {
    throw new ValidationError("Cannot modify system roles");
  }

  Object.assign(role, input);
  return await role.save();
};