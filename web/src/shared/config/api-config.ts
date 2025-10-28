/* eslint-disable @typescript-eslint/naming-convention */

import { client } from "../api/client.gen";

/**
 * Configures the API client with base URL and authentication token from environment variables.
 * @throws {Error} When VITE_STRAPI_API_TOKEN is not set in environment variables
 */
const configureApiClient = () => {
  // Set the base URL from environment variable
  const strapiUrl = import.meta.env.VITE_STRAPI_URL as string | undefined;
  const baseUrl = strapiUrl ?? "http://localhost:1337";

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
export const fetchHeaders = () => {
  const apiToken = import.meta.env.VITE_STRAPI_API_TOKEN as string | undefined;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (apiToken !== undefined && apiToken !== "") {
    headers.Authorization = `Bearer ${apiToken}`;
  }

  return headers;
};

export default configureApiClient;
