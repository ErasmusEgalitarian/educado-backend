import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
    client: '@hey-api/client-fetch',
    //input: '../openapi/strapi-spec.json',
    input: '../strapi/src/extensions/documentation/documentation/1.0.0/full_documentation.json',
    output: {
        path: './src/shared/api',
        format: 'prettier',
    },
    plugins: [
        '@hey-api/typescript',
        '@hey-api/sdk',
    ],
});
