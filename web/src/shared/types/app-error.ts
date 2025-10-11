/**
 * Common error format used throughout the application
 */
export interface AppError {
  /** Error type for categorization */
  type: "network" | "validation" | "auth" | "server" | "unknown";
  /** HTTP status code if applicable */
  status?: number;
  /** User-friendly error title */
  title: string;
  /** Detailed error message */
  message: string;
  /** Technical details (for developers/debugging) */
  details?: string;
  /** Stack trace for frontend errors */
  stack?: string;
  /** Request details for API errors */
  request?: {
    url: string;
    method?: string;
    body?: unknown;
  };
  /** Original error object */
  originalError?: unknown;
}
