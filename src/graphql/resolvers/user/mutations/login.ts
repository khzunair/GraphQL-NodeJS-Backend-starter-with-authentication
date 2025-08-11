import { UserModel } from "../../../../models/User";
import { generateToken } from "../../../../utils/auth";
import { AuthenticationError } from "../../../../utils/errors";

interface LoginInput {
  email: string;
  password: string;
}

export const login = async (_: any, { input }: { input: LoginInput }) => {
  const { email, password } = input;

  const user = await UserModel.findOne({ email }).select('+password').populate('role');
  if (!user) {
    throw new AuthenticationError("Invalid email or password");
  }

  if (!user.isActive) {
    throw new AuthenticationError("Account is deactivated");
  }

  const isValid = await user.comparePassword(password);
  if (!isValid) {
    throw new AuthenticationError("Invalid email or password");
  }

  const token = generateToken(user._id.toString());
  const userResponse = await UserModel.findById(user._id).populate('role');

  return { token, user: userResponse };
};