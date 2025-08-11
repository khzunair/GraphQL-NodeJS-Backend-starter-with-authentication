import { UserModel } from "../../../../models/User";
import { requireAdmin } from "../../../../utils/auth";
import { ValidationError } from "../../../../utils/errors";

export const deleteUser = async (_: any, { id }: { id: string }, context: any) => {
  await requireAdmin(context);

  const user = await UserModel.findById(id).populate('role');
  if (!user) {
    throw new ValidationError("User not found");
  }

  // Prevent deleting admin users
  const userRole = user.role as any;
  if (userRole.name === 'ADMIN') {
    throw new ValidationError("Cannot delete admin users");
  }

  await UserModel.findByIdAndDelete(id);
  return true;
};