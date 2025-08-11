import { UserModel } from "../../../../models/User";
import { RoleModel } from "../../../../models/Role";
import { generateToken } from "../../../../utils/auth";
import { ValidationError } from "../../../../utils/errors";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  roleId?: string;
}

export const register = async (_: any, { input }: { input: RegisterInput }) => {
  const { name, email, password, roleId } = input;

  // Check if user exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new ValidationError("Email already registered");
  }

  // Get role (default to USER if not specified)
  let userRole;
  if (roleId) {
    userRole = await RoleModel.findById(roleId);
    if (!userRole) {
      throw new ValidationError("Role not found");
    }
  } else {
    userRole = await RoleModel.findOne({ name: 'USER' });
    if (!userRole) {
      throw new ValidationError("Default USER role not found");
    }
  }

  const user = new UserModel({
    name,
    email,
    password,
    role: userRole._id
  });

  await user.save();
  const populatedUser = await UserModel.findById(user._id).populate('role');
  const token = generateToken(user._id.toString());

  return { token, user: populatedUser };
};