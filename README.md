# 🚀 Role-Based API Starter

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat&logo=graphql&logoColor=white)](https://graphql.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Apollo Server](https://img.shields.io/badge/Apollo%20Server-311C87?style=flat&logo=apollo-graphql&logoColor=white)](https://www.apollographql.com/docs/apollo-server/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-ready **TypeScript GraphQL backend starter** with role-based authentication, built with modern best practices. Perfect for developers who want to quickly bootstrap a secure API with user management and permission systems.

## ✨ Features

- 🔐 **JWT-based Authentication** with TypeScript types
- 👥 **Role-Based Access Control** (RBAC) system
- 🎯 **GraphQL API** with Apollo Server
- 📦 **MongoDB Integration** using Typegoose
- 🔒 **Password Hashing** with bcryptjs
- 🌱 **Auto-seeding** of default roles and admin user
- 📁 **Organized Resolver Structure** by feature
- 🧪 **GraphQL Playground** for API testing
- 🛡️ **Input Validation** and error handling
- 📝 **TypeScript Throughout** for type safety

## 🚀 Quick Start

### Prerequisites

- **Node.js 18** (Required - if using newer versions, you may need `npm install --legacy-peer-deps`)
- **MongoDB** (Local or cloud instance)
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/role-based-api-starter.git

# Navigate to project directory
cd role-based-api-starter

# Install dependencies
npm install

# For Node.js versions newer than 18
npm install --legacy-peer-deps
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/graphQLStarter

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# GraphQL
GRAPHQL_INTROSPECTION=true
```

### Running the Project

```bash
# Start development server
npm run dev

# Or start production server
npm start
```

The server will start at `http://localhost:5000` with GraphQL Playground available.

## 📁 Project Structure

```
src/
├── models/                 # Typegoose models
│   ├── User.ts            # User model with role reference
│   └── Role.ts            # Role model with permissions
├── graphql/
│   ├── typeDefs/          # GraphQL schema definitions
│   │   ├── userTypeDefs.ts
│   │   ├── roleTypeDefs.ts
│   │   └── index.ts
│   └── resolvers/         # Organized by feature
│       ├── user/          # User operations
│       │   ├── mutations/ # Register, login, CRUD
│       │   ├── queries/   # Get users, profile
│       │   └── index.ts
│       ├── role/          # Role management
│       │   ├── mutations/ # Create, update, delete roles
│       │   ├── queries/   # Get roles, permissions
│       │   └── index.ts
│       └── index.ts
├── utils/
│   ├── auth.ts            # JWT utilities & middleware
│   ├── errors.ts          # Custom error classes
│   └── seedRoles.ts       # Database seeding
└── index.ts               # Server entry point
```

## 🎮 API Usage

### Access GraphQL Playground

Open your browser and navigate to:
```
http://localhost:5000
```

### Default Credentials

The system automatically creates a default admin user:
- **Email:** `admin@example.com`
- **Password:** `admin123`

### Example Queries

#### Login as Admin
```graphql
mutation {
  login(input: {
    email: "admin@example.com"
    password: "admin123"
  }) {
    token
    user {
      name
      email
      role {
        name
        displayName
        permissions
      }
    }
  }
}
```

#### Register New User
```graphql
mutation {
  register(input: {
    name: "John Doe"
    email: "john@example.com"
    password: "password123"
  }) {
    token
    user {
      name
      email
      role {
        name
        displayName
      }
    }
  }
}
```

#### Create Role (Admin Only)
```graphql
# Add Authorization header: Bearer YOUR_ADMIN_TOKEN
mutation {
  createRole(input: {
    name: "MANAGER"
    displayName: "Manager"
    description: "Can manage users"
    permissions: ["READ_USER", "UPDATE_USER"]
  }) {
    id
    name
    displayName
    permissions
  }
}
```

## 🔐 Authentication & Authorization

### Available Roles
- **ADMIN**: Full system access, can manage users and roles
- **USER**: Standard user access (default for new registrations)

### Permission System
- Each role has specific permissions
- Operations are protected by middleware
- JWT tokens expire based on `JWT_EXPIRES_IN` setting

### Using Authentication
Add the authorization header to your requests:
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN_HERE"
}
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev        # Start development server with hot reload
npm start          # Start production server
npm run build      # Build TypeScript to JavaScript
npm run lint       # Run linting
npm test           # Run tests (if configured)
```

### Project Architecture

- **Models**: Typegoose classes with validation and hooks
- **Resolvers**: Organized by feature with separate mutation/query files
- **Authentication**: JWT-based with role checking middleware
- **Validation**: Input validation with class-validator
- **Error Handling**: Centralized error management

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
MONGO_URI=your-production-mongodb-uri
JWT_SECRET=your-very-secure-production-secret
GRAPHQL_INTROSPECTION=false
```

### Production Considerations

- Set a strong `JWT_SECRET`
- Use a production MongoDB instance
- Disable GraphQL introspection
- Set up proper logging
- Configure CORS for your frontend domain
- Use HTTPS in production

## 🤝 Contributing

This is an open-source project designed to help developers start with TypeScript GraphQL backends using best practices. Contributions are welcome!

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Maintain the organized folder structure
- Add proper error handling
- Include input validation
- Update documentation for new features

## 📝 Tech Stack

- **Backend**: Node.js 18, TypeScript
- **API**: GraphQL with Apollo Server
- **Database**: MongoDB with Typegoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: class-validator
- **Development**: ts-node-dev for hot reload

## 🔍 What's Included

- ✅ User registration and authentication
- ✅ Role-based access control
- ✅ Password hashing and JWT tokens
- ✅ GraphQL API with type definitions
- ✅ Database models with relationships
- ✅ Auto-seeding of default data
- ✅ Organized resolver structure
- ✅ Error handling and validation
- ✅ Development environment setup

## 🚀 Perfect For

- **Startups** needing quick authentication setup
- **Developers** learning GraphQL and TypeScript
- **Projects** requiring role-based permissions
- **APIs** that need user management
- **Teams** wanting organized codebase structure

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern TypeScript and GraphQL best practices
- Designed for rapid development and easy customization
- Community-driven and open-source

---

**Ready to build something amazing?** Clone this repo and start developing your next GraphQL API! 🚀

For questions or support, please open an issue on GitHub.