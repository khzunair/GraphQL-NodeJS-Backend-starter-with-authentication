import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/User";
import { AuthenticationError } from "./errors";

export interface JWTPayload {
  userId: string;
  iat: number;
  exp: number;
}

// Function to get JWT_SECRET with better error handling
const getJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("❌ JWT_SECRET environment variable is not set!");
    console.error("📝 Please check your .env file and ensure JWT_SECRET is defined");
    console.error("🔧 Current environment variables:", {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      MONGO_URI: process.env.MONGO_URI ? '***HIDDEN***' : 'NOT SET'
    });
    throw new Error("JWT_SECRET environment variable is required");
  }
  return secret;
};



export function generateToken(userId: string): string {
  try {
    const JWT_SECRET = getJWTSecret();
    return jwt.sign(
      { userId }, 
      JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN,
        algorithm: 'HS256'
      }
    );
  } catch (error) {
    throw new Error("Failed to generate token");
  }
}

export function verifyToken(token: string): JWTPayload {
  try {
    const JWT_SECRET = getJWTSecret();
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256']
    }) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new AuthenticationError("Invalid or expired token");
  }
}

export const getUserFromContext = async (context: any) => {
  const authHeader = context.req?.headers?.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    const user = await UserModel.findById(decoded.userId).populate('role');
    return user;
  } catch (error) {
    throw new AuthenticationError("Invalid token");
  }
};

export const requireAuth = async (context: any) => {
  const user = await getUserFromContext(context);
  if (!user) {
    throw new AuthenticationError("You must be logged in");
  }
  return user;
};

export const requireAdmin = async (context: any) => {
  const user = await requireAuth(context);
  
  const userRole = user.role as any;
  if (!userRole || userRole.name !== 'ADMIN') {
    throw new AuthenticationError("Admin access required");
  }
  
  return user;
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};