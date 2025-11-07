/* eslint-disable @typescript-eslint/naming-convention */

import { client } from "../api/client.gen";

export const getBaseApiUrl = (): string => {
  const strapiUrl = import.meta.env.VITE_STRAPI_URL as string | undefined;
  return strapiUrl ?? "http://localhost:1337";
};

/**
 * Configures the API client with base URL and authentication token from environment variables.
 * @throws {Error} When VITE_STRAPI_API_TOKEN is not set in environment variables
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
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
    throwOnError: true,
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
    return response;
  });

  // eslint-disable-next-line no-console
  console.log("API Client configured:", {
    baseUrl,
    hasToken: apiToken !== "",
  });
};

/**
 * Generates headers for API requests, including Authorization if token is set.
 * Used when making fetch calls outside the generated API client.
 * @returns {Record<string, string>} Headers object for fetch requests
 */
export const fetchHeaders = (): Record<string, string> => {
  const apiToken = import.meta.env.VITE_STRAPI_API_TOKEN as string | undefined;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (apiToken !== undefined && apiToken !== "") {
    headers.Authorization = `Bearer ${apiToken}`;
  }

  return headers;
};
