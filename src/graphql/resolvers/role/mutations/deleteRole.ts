import { RoleModel } from "../../../../models/Role";
import { UserModel } from "../../../../models/User";
import { requireAdmin } from "../../../../utils/auth";
import { ValidationError } from "../../../../utils/errors";

export const deleteRole = async (_: any, { id }: { id: string }, context: any) => {
  await requireAdmin(context);

  const role = await RoleModel.findById(id);
  if (!role) {
    throw new ValidationError("Role not found");
  }

  // Prevent deleting system roles
  if (['ADMIN', 'USER'].includes(role.name)) {
    throw new ValidationError("Cannot delete system roles");
  }

  // Check if role is being used
  const usersWithRole = await UserModel.countDocuments({ role: id });
  if (usersWithRole > 0) {
    throw new ValidationError("Cannot delete role that is assigned to users");
  }

  await RoleModel.findByIdAndDelete(id);
  return true;
};