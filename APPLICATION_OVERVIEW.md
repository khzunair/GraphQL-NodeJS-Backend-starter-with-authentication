# StudioX Backend Application Overview

## Project Description
This is a Node.js/TypeScript GraphQL backend application built with Apollo Server, MongoDB (using Typegoose), and JWT authentication. The application follows best practices for scalability, security, and maintainability.

## Technology Stack
- **Runtime**: Node.js with TypeScript
- **GraphQL Server**: Apollo Server
- **Database**: MongoDB with Mongoose/Typegoose ODM
- **Authentication**: JWT (JSON Web Tokens) with session timeouts
- **Password Hashing**: bcryptjs
- **Development**: ts-node-dev for hot reloading

## Project Structure
```
studiox-backend/
├── package.json
├── tsconfig.json
├── .env (JWT_SECRET, MONGODB_URI, etc.)
└── src/
    ├── index.ts                    # Main server entry point
    ├── db.ts                       # MongoDB connection
    ├── models/
    │   └── User.ts                 # Typegoose User model
    ├── middleware/
    │   └── auth.ts                 # JWT authentication middleware
    ├── utils/
    │   └── errors.ts               # Global error handling utilities
    ├── services/
    │   └── UserService.ts          # Business logic layer
    ├── types/
    │   └── index.ts                # TypeScript type definitions
    └── graphql/
        ├── index.ts                # Main GraphQL exports
        ├── queries/
        │   └── getUsers.ts         # Query resolvers
        ├── mutations/
        │   ├── registerUser.ts     # User registration
        │   ├── loginUser.ts        # User authentication
        │   ├── addUser.ts          # Admin user creation
        │   ├── updateUser.ts       # User updates
        │   └── deleteUser.ts       # User deletion
        ├── resolvers/
        │   └── index.ts            # Combined resolvers export
        └── typeDefs/
            └── index.ts            # GraphQL schema definitions
```

## Authentication & Authorization
- **JWT Authentication**: All CRUD operations require valid JWT tokens
- **Role-based Access**: 
  - `USER`: Basic user role (default)
  - `ADMIN`: Can perform all user management operations
- **Session Management**: Tokens have 24-hour expiration (configurable)
- **Password Security**: bcryptjs with salt rounds for hashing

## Current Features

### User Management (CRUD)
1. **User Registration** (`registerUser`)
   - Creates new user accounts
   - Automatically hashes passwords
   - Returns user object (password excluded)

2. **User Authentication** (`loginUser`)
   - Validates credentials
   - Returns JWT token and user data
   - Token expires in 24 hours

3. **Get Users** (`getUsers`) - ADMIN ONLY
   - Retrieves all users from database
   - Requires ADMIN role authentication

4. **Add User** (`addUser`) - ADMIN ONLY
   - Admin can create users directly
   - Requires authentication and ADMIN role

5. **Update User** (`updateUser`) - ADMIN ONLY
   - Update user name/email
   - Requires at least one field to update
   - ADMIN role required

6. **Delete User** (`deleteUser`) - ADMIN ONLY
   - Permanently removes user from database
   - ADMIN role required

### Data Models

#### User Model (Typegoose)
```typescript
{
  name: string (required)
  email: string (required, unique)
  password: string (required, select: false)
  role: "USER" | "ADMIN" (default: "USER")
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

### GraphQL Schema
- **Queries**: `getUsers`
- **Mutations**: `registerUser`, `loginUser`, `addUser`, `updateUser`, `deleteUser`
- **Types**: `User`, `AuthPayload`, input types for operations

## Error Handling
- **Global Error Handler**: Centralized error processing
- **Custom AppError Class**: Structured error responses with status codes
- **JWT Error Handling**: Specific handling for token expiration and invalid tokens
- **Validation Errors**: Proper error messages for missing/invalid data

## Security Features
- **Password Hashing**: bcryptjs with salt
- **JWT Tokens**: Secure authentication with expiration
- **Authorization Middleware**: Role-based access control
- **Input Validation**: GraphQL schema validation
- **Error Sanitization**: Structured error responses without exposing internals

## Environment Configuration
Required environment variables:
- `JWT_SECRET`: Secret key for JWT token signing
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment mode (development/production)

## Development Setup
- **Hot Reloading**: ts-node-dev for development
- **TypeScript**: Full type safety throughout the application
- **Code Structure**: Modular design ready for scaling to multiple collections

## Testing Information
- **GraphQL Playground**: Available at `http://localhost:5000/` in development
- **Authentication Testing**: Use Bearer tokens in Authorization headers
- **Protected Routes**: All CRUD operations require valid JWT
- **Role Testing**: ADMIN operations require ADMIN role in JWT payload

## Scalability Considerations
- **Modular Structure**: Separate folders for queries, mutations, types
- **Typegoose**: Type-safe MongoDB modeling ready for multiple collections
- **Service Layer**: Business logic separated from resolvers
- **Error Handling**: Centralized and consistent across the application

## Current Status
- ✅ Server running on http://localhost:5000/
- ✅ MongoDB connection established
- ✅ GraphQL Playground available
- ✅ JWT authentication working
- ✅ All CRUD operations protected
- ✅ Role-based authorization implemented
- ✅ Global error handling active

## Future Expansion Ready
The architecture is designed to easily accommodate:
- Additional data models/collections
- More complex business logic
- Additional authentication providers
- API rate limiting
- Caching layers
- File upload handling
- Real-time subscriptions

This backend serves as a solid foundation for a scalable application with proper authentication, authorization, and error handling practices in place.
