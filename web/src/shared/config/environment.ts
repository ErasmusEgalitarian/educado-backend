// Get environment values
// Moved into this file to be able to mock during testing
export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ?? "http://localhost:1337";
export const CERT_URL: string =
  import.meta.env.VITE_CERT_URL ?? "http://localhost:8080";
export const REFRESH_TOKEN_URL = BACKEND_URL + "/auth/refresh/jwt";
