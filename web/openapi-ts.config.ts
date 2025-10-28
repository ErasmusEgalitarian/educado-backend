import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
    client: '@hey-api/client-fetch',
    input: '../openapi/strapi-spec.json',
    output: {
        path: './src/shared/api',
        format: 'prettier',
    },
    plugins: [
        '@hey-api/typescript',
        '@hey-api/sdk',
    ],
});
