import { RoleModel } from "../../../../models/Role";
import { requireAdmin } from "../../../../utils/auth";
import { ValidationError } from "../../../../utils/errors";

interface CreateRoleInput {
  name: string;
  displayName: string;
  description?: string;
  permissions?: string[];
  priority?: number;
}

export const createRole = async (_: any, { input }: { input: CreateRoleInput }, context: any) => {
  await requireAdmin(context);

  // Check if role name already exists
  const existingRole = await RoleModel.findOne({ name: input.name.toUpperCase() });
  if (existingRole) {
    throw new ValidationError("Role name already exists");
  }

  const roleData = {
    ...input,
    name: input.name.toUpperCase(),
    permissions: input.permissions || []
  };

  const role = new RoleModel(roleData);
  return await role.save();
};