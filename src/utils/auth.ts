import jwt from "jsonwebtoken";
import { UserRole } from "../models/User";

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface AuthContext {
  user?: JWTPayload;
  isAuthenticated: boolean;
}

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Generate JWT token for user
 */
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(
    payload, 
    JWT_SECRET, 
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  
  return parts[1];
}

/**
 * Create authentication context from token
 */
export function createAuthContext(token?: string): AuthContext {
  if (!token) {
    return { isAuthenticated: false };
  }

  const user = verifyToken(token);
  if (!user) {
    return { isAuthenticated: false };
  }

  return {
    user,
    isAuthenticated: true,
  };
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  // Admin has access to everything
  if (userRole === UserRole.ADMIN) return true;
  
  return userRole === requiredRole;
}

/**
 * Check if user is admin
 */
export function isAdmin(userRole: UserRole): boolean {
  return userRole === UserRole.ADMIN;
}
