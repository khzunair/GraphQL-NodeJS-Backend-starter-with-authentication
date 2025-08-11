import { gql } from "apollo-server";

export const roleTypeDefs = gql`
  type Role {
    id: ID!
    name: String!
    displayName: String!
    description: String
    permissions: [String!]!
    isActive: Boolean!
    priority: Int!
    createdAt: String!
    updatedAt: String!
  }

  input CreateRoleInput {
    name: String!
    displayName: String!
    description: String
    permissions: [String!]
    priority: Int
  }

  input UpdateRoleInput {
    displayName: String
    description: String
    permissions: [String!]
    isActive: Boolean
    priority: Int
  }

  extend type Query {
    roles: [Role!]!
    role(id: ID!): Role
    activeRoles: [Role!]!
  }

  extend type Mutation {
    createRole(input: CreateRoleInput!): Role!
    updateRole(id: ID!, input: UpdateRoleInput!): Role!
    deleteRole(id: ID!): Boolean!
    toggleRoleStatus(id: ID!): Role!
  }
`;