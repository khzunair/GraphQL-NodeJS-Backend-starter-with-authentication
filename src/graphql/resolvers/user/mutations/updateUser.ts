import { UserModel } from "../../../../models/User";
import { RoleModel } from "../../../../models/Role";
import { requireAuth, requireAdmin } from "../../../../utils/auth";
import { ValidationError } from "../../../../utils/errors";

interface UpdateUserInput {
  name?: string;
  email?: string;
  roleId?: string;
  isActive?: boolean;
}

export const updateUser = async (_: any, { id, input }: { id: string; input: UpdateUserInput }, context: any) => {
  const currentUser = await requireAuth(context);

  // Users can update their own profile (limited), admins can update all
  if (currentUser.id === id) {
    // Regular users can only update name and email
    const { name, email } = input;
    const user = await UserModel.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    ).populate('role');
    
    if (!user) {
      throw new ValidationError("User not found");
    }
    return user;
  } else {
    await requireAdmin(context);
    
    if (input.roleId) {
      const role = await RoleModel.findById(input.roleId);
      if (!role) {
        throw new ValidationError("Role not found");
      }
    }

    const user = await UserModel.findByIdAndUpdate(id, input, { new: true }).populate('role');
    if (!user) {
      throw new ValidationError("User not found");
    }
    return user;
  }
};