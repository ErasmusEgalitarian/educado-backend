/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class I18NService {
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static i18NGetLocales(): CancelablePromise<Array<{
        id: number;
        documentId: string;
        name: string;
        code: string;
        createdAt: string;
        updatedAt: string;
        publishedAt: (string | null);
        isDefault: boolean;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/locales',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
}
