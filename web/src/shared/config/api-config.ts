import { OpenAPI } from '../api/core/OpenAPI';

// Configure OpenAPI client with environment variables
const configureApiClient = () => {
    // Set the base URL from environment variable
    const strapiUrl = import.meta.env.VITE_STRAPI_URL as string | undefined;
    OpenAPI.BASE = strapiUrl ?? 'http://localhost:1337';

    // Set the API token if available
    const apiToken = import.meta.env.VITE_STRAPI_API_TOKEN as string | undefined;
    if (apiToken !== undefined) {
        OpenAPI.TOKEN = apiToken;
    } else {
        throw new Error('VITE_STRAPI_API_TOKEN is not set in environment variables');
    }

    // eslint-disable-next-line no-console
    console.log('API Client configured:', {
        baseUrl: OpenAPI.BASE,
        hasToken: OpenAPI.TOKEN !== ""
    });
};

export default configureApiClient;