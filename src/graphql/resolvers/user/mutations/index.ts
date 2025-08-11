import { register } from "./register";
import { login } from "./login";
import { createUser } from "./createUser";
import { updateUser } from "./updateUser";
import { deleteUser } from "./deleteUser";

export const userMutations = {
  register,
  login,
  createUser,
  updateUser,
  deleteUser
};