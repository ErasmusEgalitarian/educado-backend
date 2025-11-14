/* eslint-disable @typescript-eslint/naming-convention */

import { client } from "../api/client.gen";

export const getBaseApiUrl = (): string => {
  const strapiUrl = import.meta.env.VITE_STRAPI_URL as string | undefined;
  return strapiUrl ?? "http://localhost:1337";
};

/**
 * Configures the API client with base URL and authentication token from localStorage.
 */
export const configureApiClient = () => {
  const baseUrl = getBaseApiUrl();

  // Set the API token if available
  const apiToken = import.meta.env.VITE_STRAPI_API_TOKEN as string | undefined;

  if (apiToken == undefined) {
    globalThis.alert(
      "Warning: VITE_STRAPI_API_TOKEN is not set in environment variables. API requests may fail.",
    );
    throw new Error(
      "VITE_STRAPI_API_TOKEN is not set in environment variables",
    );
  }

  // Configure the client with base URL and authorization header
  client.setConfig({
    baseUrl,
    throwOnError: true,
    headers: {
      ...fetchHeaders(),
    },
  });

  // Request interceptor for logging in development
  client.interceptors.request.use((request) => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(`Request 📤 ${request.method} ${request.url}`);
    }
    return request;
  });

  // Response interceptor for logging
  client.interceptors.response.use((response) => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(`Response 📥 ${response.url}`, { status: response.status });
    }

    // If token is invalid, try to refresh from localStorage
    if (response.status === 403 || response.status === 401) {
      updateApiClientToken();
    }

    return response;
  });

  // eslint-disable-next-line no-console
  console.log("API Client configured:", {
    baseUrl,
    hasToken: Boolean(localStorage.getItem("token")),
  });
};

/**
 * Updates the API client's authorization header with the token from localStorage.
 * Call this after login/logout to ensure the client uses the current token.
 */
export const updateApiClientToken = () => {
  const token = localStorage.getItem("token") ?? "";
  const currentConfig = client.getConfig();
  const currentHeaders = (currentConfig.headers ?? {}) as Record<string, string>;

  client.setConfig({
    ...currentConfig,
    headers: {
      ...currentHeaders,
      Authorization: token !== "" ? `Bearer ${token}` : "",
    },
  });

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log("API Client token updated:", { hasToken: token !== "" });
  }
};

/**
 * Generates headers for API requests, including Authorization if token is set.
 * Used when making fetch calls outside the generated API client.
 * @returns {Record<string, string>} Headers object for fetch requests
 */
export const fetchHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token") ?? "";

  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: token !== "" ? `Bearer ${token}` : "",
  };

  return headers;
};
