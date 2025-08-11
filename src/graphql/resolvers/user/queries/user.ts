import { UserModel } from "../../../../models/User";
import { requireAuth, requireAdmin } from "../../../../utils/auth";
import { ValidationError } from "../../../../utils/errors";

export const user = async (_: any, { id }: { id: string }, context: any) => {
  const currentUser = await requireAuth(context);
  
  // Users can view their own profile, admins can view all
  if (currentUser.id !== id) {
    await requireAdmin(context);
  }

  const user = await UserModel.findById(id).populate('role');
  if (!user) {
    throw new ValidationError("User not found");
  }
  return user;
};