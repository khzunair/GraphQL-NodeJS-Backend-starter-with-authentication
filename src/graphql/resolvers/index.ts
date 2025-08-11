import { mergeResolvers } from '@graphql-tools/merge';
import { userResolvers } from './user';
import { roleResolvers } from './role';

export const resolvers = mergeResolvers([
  userResolvers,
  roleResolvers
]);