import { UserModel } from "../../models/User";

export const resolvers = {
  Query: {
    getUsers: async () => {
      return await UserModel.find({});
    },
  },
  Mutation: {
    addUser: async (_: any, { input }: any) => {
      const { name, email } = input;
      const exists = await UserModel.findOne({ email });
      if (exists) throw new Error("Email already exists");

      const user = new UserModel({ name, email });
      await user.save();
      return user;
    },

    deleteUser: async (_: any, { id }: any) => {
      const res = await UserModel.deleteOne({ _id: id });
      return res.deletedCount === 1;
    },
    updateUser: async (_: any, { id, name, email }: any) => {
      if (!name && !email) {
        throw new Error(
          "At least one field (name or email) must be provided for update"
        );
      }
      const user = await UserModel.findById(id);
      if (!user) {
        throw new Error("User not found");
      }
      await UserModel.findByIdAndUpdate(id, { name, email }, { new: true });
      return user;
    },
  },
};
