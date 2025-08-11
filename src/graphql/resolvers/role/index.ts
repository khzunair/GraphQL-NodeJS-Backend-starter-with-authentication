import { roleQueries } from "./queries";
import { roleMutations } from "./mutations";

export const roleResolvers = {
  Query: roleQueries,
  Mutation: roleMutations
};