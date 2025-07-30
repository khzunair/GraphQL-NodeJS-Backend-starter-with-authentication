import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../../models/User";

export const loginUser = async (_: any, { email, password }: any) => {
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) throw new Error("User not found");

  const valid = await compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET!,
  { expiresIn: "1d" }
);

  return { token, user };
};
