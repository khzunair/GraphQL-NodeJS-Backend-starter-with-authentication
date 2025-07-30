# 🚀 GraphQL Node.js Backend Starter with Authentication

[![Node.js Version](https://img.shields.io/badge/node.js-18%2B-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8%2B-blue)](https://www.typescriptlang.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-16.11%2B-pink)](https://graphql.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)](https://www.mongodb.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

> **A production-ready GraphQL Node.js backend boilerplate with JWT authentication, role-based authorization, and MongoDB integration using TypeScript and modern best practices.**

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Authentication](#-authentication)
- [Example Queries & Mutations](#-example-queries--mutations)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## ✨ Features

### 🔐 **Authentication & Authorization**
- JWT-based authentication with configurable expiration
- Role-based access control (USER, ADMIN)
- Password hashing with bcryptjs
- Session timeout handling
- Protected GraphQL resolvers

### 🏗️ **Architecture & Structure**
- **TypeScript** for type safety and better developer experience
- **Modular GraphQL** structure with separate queries, mutations, and types
- **Typegoose** for MongoDB with TypeScript decorators
- **Global error handling** with custom error classes
- **Scalable folder structure** ready for multiple collections

### 🛠️ **Development Experience**
- **Hot reloading** with ts-node-dev
- **GraphQL Playground** for API testing
- **Environment-based configuration**
- **Professional logging** and error tracking
- **Code organization** following best practices

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime Environment |
| **TypeScript** | 5.8+ | Type Safety & Developer Experience |
| **Apollo Server** | 3.13+ | GraphQL Server |
| **MongoDB** | Latest | Database |
| **Typegoose** | 12.17+ | MongoDB ODM with TypeScript |
| **JWT** | 9.0+ | Authentication |
| **bcryptjs** | 3.0+ | Password Hashing |
| **GraphQL** | 16.11+ | Query Language |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or cloud service like MongoDB Atlas)
- **Git** for version control

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/khzunair/GraphQL-NodeJS-Backend-starter-with-authentication.git
cd GraphQL-NodeJS-Backend-starter-with-authentication
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/studiox

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Server
PORT=5000
NODE_ENV=development
```

### 4. Start the Development Server
```bash
npm run dev
```

### 5. Access GraphQL Playground
Open your browser and navigate to:
```
http://localhost:5000/
```

🎉 **Congratulations!** Your GraphQL backend is now running!

---

## 📁 Project Structure

```
studiox-backend/
├── 📄 package.json                 # Dependencies and scripts
├── 📄 tsconfig.json               # TypeScript configuration
├── 📄 .env                        # Environment variables
├── 📄 .gitignore                  # Git ignore rules
├── 📄 README.md                   # Project documentation
├── 📄 APPLICATION_OVERVIEW.md     # Detailed technical overview
└── 📂 src/
    ├── 📄 index.ts                # 🚀 Main server entry point
    ├── 📄 db.ts                   # 🔌 MongoDB connection
    ├── 📂 models/
    │   └── 📄 User.ts             # 👤 User data model (Typegoose)
    ├── 📂 middleware/
    │   └── 📄 auth.ts             # 🔐 JWT authentication middleware
    ├── 📂 utils/
    │   └── 📄 errors.ts           # ⚠️ Global error handling
    ├── 📂 services/
    │   └── 📄 UserService.ts      # 🔧 Business logic layer
    ├── 📂 types/
    │   └── 📄 index.ts            # 📝 TypeScript definitions
    └── 📂 graphql/
        ├── 📄 index.ts            # 🔗 GraphQL exports
        ├── 📂 queries/
        │   └── 📄 getUsers.ts     # 🔍 Query resolvers
        ├── 📂 mutations/
        │   ├── 📄 registerUser.ts # ➕ User registration
        │   ├── 📄 loginUser.ts    # 🔑 User authentication
        │   ├── 📄 addUser.ts      # 👥 Admin user creation
        │   ├── 📄 updateUser.ts   # ✏️ User updates
        │   └── 📄 deleteUser.ts   # ❌ User deletion
        ├── 📂 resolvers/
        │   └── 📄 index.ts        # 🔀 Combined resolvers
        └── 📂 typeDefs/
            └── 📄 index.ts        # 📋 GraphQL schema
```

---

## 🌍 Environment Variables

Create a `.env` file with the following variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/studiox` |
| `JWT_SECRET` | Secret key for JWT signing | `your-super-secret-jwt-key` |
| `PORT` | Server port number | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |

---

## 📚 API Documentation

### 🔍 **Queries**

#### Get All Users (Admin Only)
```graphql
query {
  getUsers {
    id
    name
    email
    role
    createdAt
    updatedAt
  }
}
```

### 🔧 **Mutations**

#### User Registration
```graphql
mutation {
  registerUser(
    name: "John Doe"
    email: "john@example.com"
    password: "securePassword123"
  ) {
    id
    name
    email
    role
  }
}
```

#### User Login
```graphql
mutation {
  loginUser(
    email: "john@example.com"
    password: "securePassword123"
  ) {
    token
    user {
      id
      name
      email
      role
    }
  }
}
```

---

## 🔐 Authentication

### JWT Token Usage

After logging in, include the JWT token in your requests:

**Headers:**
```json
{
  "Authorization": "Bearer your-jwt-token-here"
}
```

### Role-Based Access Control

| Role | Permissions |
|------|-------------|
| **USER** | Default role, basic access |
| **ADMIN** | Full access to user management |

### Protected Operations

All CRUD operations require authentication:
- ✅ `getUsers` - Admin only
- ✅ `addUser` - Admin only  
- ✅ `updateUser` - Admin only
- ✅ `deleteUser` - Admin only

---

## 📝 Example Queries & Mutations

### 🚀 **Getting Started Examples**

#### 1. Register Your First User
```graphql
mutation RegisterUser {
  registerUser(
    name: "Jane Smith"
    email: "jane@example.com"
    password: "mySecurePassword"
  ) {
    id
    name
    email
    role
    createdAt
  }
}
```

#### 2. Login and Get Token
```graphql
mutation LoginUser {
  loginUser(
    email: "jane@example.com"
    password: "mySecurePassword"
  ) {
    token
    user {
      id
      name
      role
    }
  }
}
```

#### 3. Admin Operations (Requires Admin Token)
```graphql
# First, make a user admin in MongoDB or create admin user
mutation CreateAdminUser {
  addUser(input: {
    name: "Admin User"
    email: "admin@example.com"
  }) {
    id
    name
    email
    role
  }
}

# Get all users
query GetAllUsers {
  getUsers {
    id
    name
    email
    role
    createdAt
  }
}

# Update a user
mutation UpdateUser {
  updateUser(
    id: "user-id-here"
    name: "Updated Name"
    email: "newemail@example.com"
  ) {
    id
    name
    email
  }
}

# Delete a user
mutation DeleteUser {
  deleteUser(id: "user-id-here")
}
```

---

## 🧪 Testing

### Using GraphQL Playground

1. **Start the server**: `npm run dev`
2. **Open browser**: Navigate to `http://localhost:5000/`
3. **Run queries**: Use the examples above

### Using cURL

```bash
# Register a user
curl -X POST http://localhost:5000/ \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { registerUser(name: \"Test User\", email: \"test@example.com\", password: \"password123\") { id name email } }"
  }'

# Login
curl -X POST http://localhost:5000/ \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { loginUser(email: \"test@example.com\", password: \"password123\") { token user { id name } } }"
  }'
```

### Authentication Testing

1. **Register a user** using the registration mutation
2. **Login** and copy the returned JWT token
3. **Add Authorization header** for protected operations:
   ```json
   {
     "Authorization": "Bearer YOUR_JWT_TOKEN_HERE"
   }
   ```

---

## 🚀 Deployment

### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-production-secret-key
PORT=5000
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm test` | Run test suite (when implemented) |

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support & Questions

- **Issues**: [GitHub Issues](https://github.com/khzunair/GraphQL-NodeJS-Backend-starter-with-authentication/issues)
- **Discussions**: [GitHub Discussions](https://github.com/khzunair/GraphQL-NodeJS-Backend-starter-with-authentication/discussions)

---

## 🙏 Acknowledgments

- **Apollo GraphQL** for the excellent GraphQL server
- **Typegoose** for MongoDB TypeScript integration
- **TypeScript** team for making JavaScript better
- **MongoDB** for the flexible database solution

---

<div align="center">

### ⭐ If this project helped you, please give it a star!

**Happy Coding!** 🚀

</div>
