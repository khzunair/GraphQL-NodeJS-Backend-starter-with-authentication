import dotenv from "dotenv";

dotenv.config();


import { ApolloServer } from "apollo-server";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";
import { connectDB } from "./db";
import { seedRoles } from "./utils/seedRoles";

async function startServer() {
  try {
    await connectDB();
    await seedRoles();

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({ req }),
      introspection: process.env.NODE_ENV !== 'production',
    });


    const { url } = await server.listen({ port: process.env.PORT || 5000 });
    console.log(`🚀 Server ready at ${url}`);
    console.log(`🔍 GraphQL Playground available in development`);
    console.log(`🔑 JWT_SECRET loaded: ${process.env.JWT_SECRET ? 'Yes' : 'No'}`);

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();