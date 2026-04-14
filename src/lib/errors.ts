// Custom Error Classes for API Hacker Agent

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string = 'INTERNAL_ERROR',
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation Errors (400)
export class ValidationError extends AppError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 400, true);
    this.field = field;
  }
}

// Authentication Errors (401)
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTHENTICATION_ERROR', 401, true);
  }
}

// Authorization Errors (403)
export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 'AUTHORIZATION_ERROR', 403, true);
  }
}

// Not Found Errors (404)
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND_ERROR', 404, true);
  }
}

// Network Errors (502, 503, 504)
export class NetworkError extends AppError {
  public readonly retryable: boolean;

  constructor(message: string = 'Network error', retryable: boolean = true) {
    super(message, 'NETWORK_ERROR', 503, true);
    this.retryable = retryable;
  }
}

// Payment Errors (402, 400)
export class PaymentError extends AppError {
  public readonly paymentDetails?: Record<string, unknown>;

  constructor(
    message: string = 'Payment failed',
    paymentDetails?: Record<string, unknown>
  ) {
    super(message, 'PAYMENT_ERROR', 402, true);
    this.paymentDetails = paymentDetails;
  }
}

// Rate Limit Errors (429)
export class RateLimitError extends AppError {
  public readonly retryAfter: number;

  constructor(retryAfter: number = 60) {
    super(
      `Rate limit exceeded. Retry after ${retryAfter}s`,
      'RATE_LIMIT_ERROR',
      429,
      true
    );
    this.retryAfter = retryAfter;
  }
}

// External API Errors
export class ExternalAPIError extends AppError {
  public readonly service: string;

  constructor(service: string, message: string, statusCode: number = 500) {
    super(
      `${service} API error: ${message}`,
      'EXTERNAL_API_ERROR',
      statusCode,
      true
    );
    this.service = service;
  }
}

// Timeout Errors
export class TimeoutError extends AppError {
  constructor(timeoutMs: number) {
    super(
      `Request timeout after ${timeoutMs}ms`,
      'TIMEOUT_ERROR',
      504,
      true
    );
  }
}

// Error type guards
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

export function isPaymentError(error: unknown): error is PaymentError {
  return error instanceof PaymentError;
}

// Convert unknown error to AppError
export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR', 500, false);
  }

  return new AppError(
    typeof error === 'string' ? error : 'An unknown error occurred',
    'UNKNOWN_ERROR',
    500,
    false
  );
}

// Error response format for API
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    field?: string;
    details?: Record<string, unknown>;
  };
  stack?: string; // Only in development
}

// Format error for API response
export function formatErrorResponse(error: unknown): ErrorResponse {
  const appError = toAppError(error);

  const response: ErrorResponse = {
    success: false,
    error: {
      code: appError.code,
      message: appError.isOperational
        ? appError.message
        : 'An unexpected error occurred',
    },
  };

  // Add field for validation errors
  if (isValidationError(appError) && appError.field) {
    response.error.field = appError.field;
  }

  // Add payment details for payment errors
  if (isPaymentError(appError) && appError.paymentDetails) {
    response.error.details = appError.paymentDetails;
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development' && appError.stack) {
    response.stack = appError.stack;
  }

  return response;
}

// Safe JSON parsing
export function safeJsonParse<T>(text: string): T | { error: string } {
  try {
    return JSON.parse(text) as T;
  } catch {
    return { error: 'Invalid JSON' } as unknown as T;
  }
}
