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
    /** Original error object */
    originalError?: unknown;
}