import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers/userResolver";
import { connectDB } from "./db";
import { createAuthContext, extractTokenFromHeader } from "./utils/auth";
import { formatError } from "./utils/errors";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    // Create authentication context
    const authContext = createAuthContext(token || undefined);
    
    return authContext;
  },
  formatError,
  introspection: process.env.NODE_ENV !== "production",
});

connectDB();

const port = process.env.PORT || 5000;

server.listen({ port }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🔍 GraphQL Playground available in development mode`);
});
