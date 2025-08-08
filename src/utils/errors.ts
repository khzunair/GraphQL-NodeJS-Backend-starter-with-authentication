export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'You are not authenticated. Please log in.') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'You are not authorized to perform this action.') {
    super(message, 403);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found.') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

/**
 * Format GraphQL errors for consistent error responses
 */
export function formatError(error: any) {
  // Log the error for debugging
  console.error('GraphQL Error:', {
    message: error.message,
    locations: error.locations,
    path: error.path,
    stack: error.stack,
  });

  // Return a formatted error response
  return {
    message: error.message,
    code: error.extensions?.code || 'INTERNAL_ERROR',
    statusCode: error.extensions?.statusCode || 500,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      locations: error.locations,
      path: error.path,
    }),
  };
}

/**
 * Handle MongoDB duplicate key errors
 */
export function handleMongoError(error: any): AppError {
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const value = error.keyValue[field];
    return new ConflictError(`${field} '${value}' already exists.`);
  }
  
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((val: any) => val.message);
    return new ValidationError(errors.join('. '));
  }
  
  return new AppError('Database operation failed.', 500);
}
