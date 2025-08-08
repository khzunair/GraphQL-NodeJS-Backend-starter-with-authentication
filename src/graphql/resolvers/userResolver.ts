import { UserModel, User, UserRole } from "../../models/User";
import { generateToken, AuthContext } from "../../utils/auth";
import { 
  AuthenticationError, 
  AuthorizationError, 
  ValidationError, 
  NotFoundError, 
  ConflictError,
  handleMongoError 
} from "../../utils/errors";
import bcrypt from "bcryptjs";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
}

// Helper function to check if user is authenticated
const requireAuth = (context: AuthContext) => {
  if (!context.isAuthenticated || !context.user) {
    throw new AuthenticationError();
  }
  return context.user;
};

// Helper function to check if user is admin
const requireAdmin = (context: AuthContext) => {
  const user = requireAuth(context);
  if (user.role !== UserRole.ADMIN) {
    throw new AuthorizationError('Admin access required.');
  }
  return user;
};

export const resolvers = {
  Query: {
    // Public queries
    users: async () => {
      try {
        return await UserModel.find({ isActive: true });
      } catch (error) {
        throw handleMongoError(error);
      }
    },

    user: async (_: any, { id }: { id: string }) => {
      try {
        const user = await UserModel.findById(id);
        if (!user) {
          throw new NotFoundError('User not found.');
        }
        return user;
      } catch (error) {
        if (error instanceof NotFoundError) throw error;
        throw handleMongoError(error);
      }
    },

    // Protected query
    me: async (_: any, __: any, context: AuthContext) => {
      const user = requireAuth(context);
      
      try {
        const currentUser = await UserModel.findById(user.id);
        if (!currentUser) {
          throw new NotFoundError('User not found.');
        }
        return currentUser;
      } catch (error) {
        if (error instanceof NotFoundError) throw error;
        throw handleMongoError(error);
      }
    },

    // Legacy query (for backward compatibility)
    getUsers: async () => {
      try {
        return await UserModel.find({ isActive: true });
      } catch (error) {
        throw handleMongoError(error);
      }
    },
  },

  Mutation: {
    // Authentication mutations
    register: async (_: any, { input }: { input: RegisterInput }) => {
      try {
        const { name, email, password } = input;

        // Validate input
        if (!name || !email || !password) {
          throw new ValidationError('Name, email, and password are required.');
        }

        if (password.length < 6) {
          throw new ValidationError('Password must be at least 6 characters long.');
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
        if (existingUser) {
          throw new ConflictError('User with this email already exists.');
        }

        // Create new user
        const user = new UserModel({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password, // Will be hashed by the pre-save middleware
          role: UserRole.USER,
        });

        await user.save();

        // Generate token
        const token = generateToken({
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role!,
        });

        return {
          token,
          user,
        };
      } catch (error) {
        if (error instanceof ValidationError || error instanceof ConflictError) {
          throw error;
        }
        throw handleMongoError(error);
      }
    },

    login: async (_: any, { input }: { input: LoginInput }) => {
      try {
        const { email, password } = input;

        // Validate input
        if (!email || !password) {
          throw new ValidationError('Email and password are required.');
        }

        // Find user and include password for comparison
        const user = await UserModel.findOne({ 
          email: email.toLowerCase(),
          isActive: true 
        }).select('+password');

        if (!user) {
          throw new AuthenticationError('Invalid email or password.');
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new AuthenticationError('Invalid email or password.');
        }

        // Update last login
        await user.updateLastLogin();

        // Generate token
        const token = generateToken({
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role!,
        });

        return {
          token,
          user,
        };
      } catch (error) {
        if (error instanceof ValidationError || error instanceof AuthenticationError) {
          throw error;
        }
        throw handleMongoError(error);
      }
    },

    // User management mutations (require authentication/authorization)
    createUser: async (_: any, { input }: { input: CreateUserInput }, context: AuthContext) => {
      requireAdmin(context);

      try {
        const { name, email, password, role = UserRole.USER } = input;

        // Validate input
        if (!name || !email || !password) {
          throw new ValidationError('Name, email, and password are required.');
        }

        if (password.length < 6) {
          throw new ValidationError('Password must be at least 6 characters long.');
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
        if (existingUser) {
          throw new ConflictError('User with this email already exists.');
        }

        // Create new user
        const user = new UserModel({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password, // Will be hashed by the pre-save middleware
          role,
        });

        await user.save();
        return user;
      } catch (error) {
        if (error instanceof ValidationError || error instanceof ConflictError) {
          throw error;
        }
        throw handleMongoError(error);
      }
    },

    updateUser: async (_: any, { id, input }: { id: string; input: UpdateUserInput }, context: AuthContext) => {
      const currentUser = requireAuth(context);

      try {
        // Check if user exists
        const user = await UserModel.findById(id);
        if (!user) {
          throw new NotFoundError('User not found.');
        }

        // Authorization check: users can only update themselves, admins can update anyone
        if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
          throw new AuthorizationError('You can only update your own profile.');
        }

        // Non-admins cannot change role or isActive
        if (currentUser.role !== UserRole.ADMIN) {
          delete input.role;
          delete input.isActive;
        }

        // If email is being changed, check for duplicates
        if (input.email && input.email !== user.email) {
          const existingUser = await UserModel.findOne({ 
            email: input.email.toLowerCase(),
            _id: { $ne: id }
          });
          if (existingUser) {
            throw new ConflictError('User with this email already exists.');
          }
          input.email = input.email.toLowerCase().trim();
        }

        // Update user
        const updatedUser = await UserModel.findByIdAndUpdate(
          id,
          { ...input, ...(input.name && { name: input.name.trim() }) },
          { new: true, runValidators: true }
        );

        return updatedUser;
      } catch (error) {
        if (error instanceof NotFoundError || error instanceof AuthorizationError || error instanceof ConflictError) {
          throw error;
        }
        throw handleMongoError(error);
      }
    },

    deleteUser: async (_: any, { id }: { id: string }, context: AuthContext) => {
      const currentUser = requireAdmin(context);

      try {
        // Prevent admin from deleting themselves
        if (currentUser.id === id) {
          throw new ValidationError('You cannot delete your own account.');
        }

        const result = await UserModel.findByIdAndDelete(id);
        return !!result;
      } catch (error) {
        if (error instanceof ValidationError) throw error;
        throw handleMongoError(error);
      }
    },

    // Legacy mutations (for backward compatibility)
    registerUser: async (_: any, { name, email, password }: { name: string; email: string; password: string }) => {
      // Use the register logic directly
      try {
        const input = { name, email, password };
        
        // Validate input
        if (!name || !email || !password) {
          throw new ValidationError('Name, email, and password are required.');
        }

        if (password.length < 6) {
          throw new ValidationError('Password must be at least 6 characters long.');
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
        if (existingUser) {
          throw new ConflictError('User with this email already exists.');
        }

        // Create new user
        const user = new UserModel({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password, // Will be hashed by the pre-save middleware
          role: UserRole.USER,
        });

        await user.save();
        return user;
      } catch (error) {
        if (error instanceof ValidationError || error instanceof ConflictError) {
          throw error;
        }
        throw handleMongoError(error);
      }
    },

    loginUser: async (_: any, { email, password }: { email: string; password: string }) => {
      // Use the login logic directly
      try {
        const input = { email, password };

        // Validate input
        if (!email || !password) {
          throw new ValidationError('Email and password are required.');
        }

        // Find user and include password for comparison
        const user = await UserModel.findOne({ 
          email: email.toLowerCase(),
          isActive: true 
        }).select('+password');

        if (!user) {
          throw new AuthenticationError('Invalid email or password.');
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new AuthenticationError('Invalid email or password.');
        }

        // Update last login
        await user.updateLastLogin();

        // Generate token
        const token = generateToken({
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role!,
        });

        return {
          token,
          user,
        };
      } catch (error) {
        if (error instanceof ValidationError || error instanceof AuthenticationError) {
          throw error;
        }
        throw handleMongoError(error);
      }
    },

    addUser: async (_: any, { input }: { input: CreateUserInput }, context: AuthContext) => {
      // Redirect to new createUser mutation
      return await resolvers.Mutation.createUser(_, { input }, context);
    },
  },
};
