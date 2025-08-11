import { mergeTypeDefs } from '@graphql-tools/merge';
import { userTypeDefs } from './userTypeDefs';
import { roleTypeDefs } from './roleTypeDefs';
import { gql } from 'apollo-server';

const baseTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export const typeDefs = mergeTypeDefs([
  baseTypeDefs,
  userTypeDefs,
  roleTypeDefs
]);