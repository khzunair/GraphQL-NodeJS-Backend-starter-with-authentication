import { getUsers } from "../queries/getUsers";
import { registerUser } from "../mutations/registerUser";
import { loginUser } from "../mutations/loginUser";
import { addUser } from "../mutations/addUser";
import { deleteUser } from "../mutations/deleteUser";
import { updateUser } from "../mutations/updateUser";

export const resolvers = {
  Query: {
    getUsers,
  },
  Mutation: {
    registerUser,
    loginUser,
    addUser,
    deleteUser,
    updateUser,
  },
};
