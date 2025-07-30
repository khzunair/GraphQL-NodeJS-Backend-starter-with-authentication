import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../../models/User";
import { AppError } from "../../utils/errors";

export const loginUser = async (_: any, { email, password }: any) => {
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) throw new AppError("User not found", 404);

  const valid = await compare(password, user.password);
  if (!valid) throw new AppError("Invalid credentials", 401);

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  return { token, user };
};
