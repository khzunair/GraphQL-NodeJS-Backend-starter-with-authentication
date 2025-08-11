import { UserModel } from "../../../../models/User";
import { requireAuth } from "../../../../utils/auth";

export const me = async (_: any, __: any, context: any) => {
  const user = await requireAuth(context);
  return await UserModel.findById(user.id).populate('role');
};