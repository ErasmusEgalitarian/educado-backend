import { ApiError } from "@/shared/api";
import { AppError } from "@/shared/types/app-error";

// Type guards
const isResponse = (error: unknown): error is Response => {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "statusText" in error &&
    "url" in error
  );
};

const hasErrorProperty = (obj: unknown): obj is { error: unknown } => {
  return typeof obj === "object" && obj !== null && "error" in obj;
};

const hasMessage = (obj: unknown): obj is { message: string } => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "message" in obj &&
    typeof (obj as { message: unknown }).message === "string"
  );
};

// Helper for native errors
const handleNativeError = (error: Error): AppError => {
  // Check if it's a network error (fetch failed)
  if (error.message.includes("fetch") || error.message.includes("network")) {
    return {
      type: "network",
      title: "Network Error",
      message:
        "Unable to connect to the server. Please check your internet connection.",
      details: error.message,
      stack: error.stack,
      originalError: error,
    };
  }

  return {
    type: "unknown",
    title: "Application Error",
    message:
      error.message !== "" ? error.message : "An unexpected error occurred",
    details: error.name,
    stack: error.stack,
    originalError: error,
  };
};

/**
 * Converts any error type into a standardized AppError
 * Handles ApiError, native Error, fetch Response, and unknown types
 */
export const toAppError = (error: unknown): AppError | undefined => {
  // Allow undefined return to handle cases where there is no error
  if (error === null || error === undefined) {
    return;
  }

  // Handle ApiError from OpenAPI generated client
  if (error instanceof ApiError) {
    return {
      type: getErrorTypeFromStatus(error.status),
      status: error.status,
      title: getErrorTitle(error.status),
      message: extractErrorMessage(error),
      details: formatErrorDetails(error.body),
      stack: error.stack,
      request: {
        url: error.url,
        method: error.request.method,
        body: error.request.body,
      },
      originalError: error,
    };
  }

  // Handle native JavaScript Error
  if (error instanceof Error) {
    return handleNativeError(error);
  }

  // Handle fetch Response objects (for manual fetch calls)
  if (isResponse(error)) {
    const response = error;
    return {
      type: getErrorTypeFromStatus(response.status),
      status: response.status,
      title: getErrorTitle(response.status),
      message:
        response.statusText !== "" ? response.statusText : "Request failed",
      request: {
        url: response.url,
      },
      originalError: error,
    };
  }

  // Handle string errors
  if (typeof error === "string") {
    return {
      type: "unknown",
      title: "Error",
      message: error,
      originalError: error,
    };
  }

  // Handle unknown error types
  return {
    type: "unknown",
    title: "Unknown Error",
    message: "An unexpected error occurred. Please try again.",
    details: JSON.stringify(error),
    originalError: error,
  };
};

/**
 * Determines error type based on HTTP status code
 */
const getErrorTypeFromStatus = (status: number): AppError["type"] => {
  if (status === 0 || status >= 500) return "server";
  if (status === 401 || status === 403) return "auth";
  if (status >= 400 && status < 500) return "validation";
  if (status === 404) return "network";
  return "unknown";
};

/**
 * Gets user-friendly error title based on status code
 */
const getErrorTitle = (status: number): string => {
  const statusTitles = new Map<number, string>([
    [400, "Invalid Request"],
    [401, "Authentication Required"],
    [403, "Access Denied"],
    [404, "Not Found"],
    [409, "Conflict"],
    [422, "Validation Error"],
    [429, "Too Many Requests"],
    [500, "Server Error"],
    [502, "Bad Gateway"],
    [503, "Service Unavailable"],
    [504, "Gateway Timeout"],
  ]);

  const title = statusTitles.get(status);
  if (title !== undefined) {
    return title;
  }

  return status >= 500 ? "Server Error" : "Request Failed";
};

/**
 * Extract message from Strapi error format
 */
const extractStrapiErrorMessage = (
  errorObj: Record<string, unknown>,
): string | null => {
  if (hasMessage(errorObj)) {
    return errorObj.message;
  }

  // Check for nested error details
  if (typeof errorObj.details === "object" && errorObj.details !== null) {
    const details = errorObj.details as Record<string, unknown>;
    if (Array.isArray(details.errors) && details.errors.length > 0) {
      const firstError = details.errors[0] as Record<string, unknown>;
      if (hasMessage(firstError)) {
        return firstError.message;
      }
    }
  }

  return null;
};

/**
 * Extracts error message from ApiError body
 * Handles Strapi error format and generic formats
 */
const extractErrorMessage = (error: ApiError): string => {
  const body = error.body as Record<string, unknown> | undefined;

  if (body === undefined) {
    return error.statusText !== "" ? error.statusText : "Request failed";
  }

  // Handle Strapi error format
  if (hasErrorProperty(body)) {
    const errorObj = body.error as Record<string, unknown>;
    const strapiMessage = extractStrapiErrorMessage(errorObj);
    if (strapiMessage !== null) {
      return strapiMessage;
    }
  }

  // Handle generic error formats
  if (hasMessage(body)) {
    return body.message;
  }

  if (typeof body.error === "string") {
    return body.error;
  }

  // Fallback to status text
  return error.statusText !== "" ? error.statusText : "Request failed";
};

/**
 * Formats error body details for technical display
 */
const formatErrorDetails = (body: unknown): string | undefined => {
  if (body === undefined || body === null) return undefined;

  try {
    return JSON.stringify(body, null, 2);
  } catch {
    // If object can't be stringified, return a safe fallback
    return "[Error details unavailable]";
  }
};

/**
 * Helper to check if error is a network error
 */
export const isNetworkError = (error: AppError): boolean => {
  return error.type === "network";
};

/**
 * Helper to check if error is an auth error
 */
export const isAuthError = (error: AppError): boolean => {
  return error.type === "auth";
};

/**
 * Helper to check if error requires user action
 */
export const requiresUserAction = (error: AppError): boolean => {
  return error.type === "validation" || error.type === "auth";
};

/**
 * Creates a custom AppError for specific scenarios
 */
export const createAppError = (
  type: AppError["type"],
  title: string,
  message: string,
  options?: {
    status?: number;
    details?: string;
    stack?: string;
    request?: AppError["request"];
  },
): AppError => {
  return {
    type,
    title,
    message,
    ...options,
  };
};
