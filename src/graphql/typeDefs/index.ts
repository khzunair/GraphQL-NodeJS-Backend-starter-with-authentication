import { gql } from "apollo-server";

const baseTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UserInput {
    name: String!
    email: String!
  }
`;

const userTypeDefs = gql`
  extend type Query {
    getUsers: [User!]!
  }

  extend type Mutation {
    registerUser(name: String!, email: String!, password: String!): User!
    loginUser(email: String!, password: String!): AuthPayload!
    addUser(input: UserInput!): User!
    updateUser(id: ID!, name: String, email: String): User!
    deleteUser(id: ID!): Boolean!
  }
`;

export const typeDefs = [baseTypeDefs, userTypeDefs];