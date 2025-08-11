import { userQueries } from "./queries";
import { userMutations } from "./mutations";

export const userResolvers = {
  Query: userQueries,
  Mutation: userMutations
};