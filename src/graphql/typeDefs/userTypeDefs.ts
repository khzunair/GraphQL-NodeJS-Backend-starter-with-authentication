import { gql } from "apollo-server";

export const userTypeDefs = gql`
  extend type Query {
    # User queries
    users: [User!]!
    user(id: ID!): User!
    me: User
  }

  extend type Mutation {
    # Authentication
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    
    # User management (Admin only)
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
  }
`;
