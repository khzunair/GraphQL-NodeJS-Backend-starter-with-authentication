import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { typeDefs, resolvers } from "./graphql";
import { connectDB } from "./db";
import { authMiddleware, AuthRequest } from "./middleware/auth";
import { globalErrorHandler, AppError } from "./utils/errors";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Use authMiddleware to validate JWT and attach user
    // Apollo context does not support Express middleware directly, so we parse manually
    const authHeader = req.headers["authorization"];
    let user = undefined;
    if (authHeader) {
      try {
        const token = authHeader.split(" ")[1];
        user = token ? (require("jsonwebtoken").verify(token, process.env.JWT_SECRET)) : undefined;
      } catch (err: any) {
        if (err.name === "TokenExpiredError") throw new AppError("Session expired. Please login again.", 401);
        throw new AppError("Invalid token", 401);
      }
    }
    return { user, isAuthenticated: !!user };
  },
  formatError: (error) => {
    console.error("GraphQL Error:", error);
    const message = error.message || "Internal Server Error";
    const code = (error.extensions && error.extensions.code) || "INTERNAL_ERROR";
    return {
      message,
      code,
      path: error.path,
      locations: error.locations,
    };
  },
  introspection: process.env.NODE_ENV !== "production",
});

connectDB();

const port = process.env.PORT || 5000;

server.listen({ port }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🔍 GraphQL Playground available in development mode`);
});
