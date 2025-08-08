import { gql } from "apollo-server";

const baseTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  enum UserRole {
    USER
    ADMIN
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: UserRole!
    isActive: Boolean!
    lastLogin: String
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

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    role: UserRole = USER
  }

  input UpdateUserInput {
    name: String
    email: String
    role: UserRole
    isActive: Boolean
  }
`;

const userTypeDefs = gql`
  extend type Query {
    # Public queries
    users: [User!]!
    user(id: ID!): User
    
    # Protected queries (requires authentication)
    me: User
    
    # Legacy queries (for backward compatibility)
    getUsers: [User!]!
  }

  extend type Mutation {
    # Authentication (public)
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    
    # User management (requires authentication/authorization)
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    
    # Legacy mutations (for backward compatibility)
    registerUser(name: String!, email: String!, password: String!): User!
    loginUser(email: String!, password: String!): AuthPayload!
    addUser(input: CreateUserInput!): User!
  }
`;

export const typeDefs = [baseTypeDefs, userTypeDefs];