import { UserModel } from "../../../../models/User";
import { RoleModel } from "../../../../models/Role";
import { requireAdmin } from "../../../../utils/auth";
import { ValidationError } from "../../../../utils/errors";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  roleId: string;
}

export const createUser = async (_: any, { input }: { input: CreateUserInput }, context: any) => {
  await requireAdmin(context);

  const { name, email, password, roleId } = input;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new ValidationError("Email already registered");
  }

  const role = await RoleModel.findById(roleId);
  if (!role) {
    throw new ValidationError("Role not found");
  }

  const user = new UserModel({ name, email, password, role: roleId });
  await user.save();
  return await UserModel.findById(user._id).populate('role');
};