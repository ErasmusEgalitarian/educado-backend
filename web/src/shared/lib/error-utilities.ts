/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { AppError } from "@/shared/types/app-error";

import { _Error } from "../api/types.gen";

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

/**
 * Type guard to check if error matches Strapi's _Error structure
 * Structure: { error: { status?, name?, message?, details? } }
 */
const isStrapiError = (error: unknown): error is _Error => {
  if (!hasErrorProperty(error)) return false;

  const errorObj = (error as { error: unknown }).error;
  return (
    typeof errorObj === "object" &&
    errorObj !== null &&
    ("message" in errorObj || "status" in errorObj || "name" in errorObj)
  );
};

/**
 * Extracts error details from Strapi error object
 */
const extractStrapiErrorDetails = (strapiError: _Error['error']): {
  status?: number;
  title: string;
  message: string;
} => {
  // Extract and validate status

  const status = typeof strapiError.status === 'number' ? strapiError.status : undefined;

  // Extract message with fallback

  const message = typeof strapiError.message === 'string' && strapiError.message.length > 0

    ? strapiError.message
    : 'An error occurred';

  // Extract name for fallback title

  const name = typeof strapiError.name === 'string' && strapiError.name.length > 0

    ? strapiError.name
    : 'Error';

  return {

    status,

    title: status ? getErrorTitle(status) : name,

    message,
  };
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
 * Handles Strapi _Error, native Error, fetch Response, and unknown types
 */
export const toAppError = (error: unknown): AppError | undefined => {
  // Allow undefined return to handle cases where there is no error
  if (error === null || error === undefined) {
    return;
  }

  // Handle Strapi _Error format from Hey API client
  // Structure: { error: { status?, name?, message?, details? } }
  if (isStrapiError(error)) {
    const details = extractStrapiErrorDetails(error.error);

    return {
      type: details.status ? getErrorTypeFromStatus(details.status) : 'unknown',
      status: details.status,
      title: details.title,
      message: details.message,

      details: formatErrorDetails(error.error.details),
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
        response.statusText.length > 0 ? response.statusText : "Request failed",
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
