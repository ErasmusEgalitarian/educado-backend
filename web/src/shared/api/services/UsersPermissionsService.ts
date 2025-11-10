/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersPermissionsService {
    /**
     * @returns void
     * @throws ApiError
     */
    public static usersPermissionsGetConnect(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/connect/(.*)',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsPostAuthLocal(
        requestBody?: {
            identifier: string;
            password: string;
        },
    ): CancelablePromise<{
        jwt: string;
        refreshToken?: string;
        user: {
            id: number;
            documentId: string;
            username: string;
            email: string;
            provider: string;
            confirmed: boolean;
            blocked: boolean;
            role?: (number | {
                id: number;
                name: string;
                description: (string | null);
                type: string;
                createdAt: string;
                updatedAt: string;
            });
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/local',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsPostAuthLocalRegister(
        requestBody?: {
            username: string;
            email: string;
            password: string;
        },
    ): CancelablePromise<({
        jwt: string;
        refreshToken?: string;
        user: {
            id: number;
            documentId: string;
            username: string;
            email: string;
            provider: string;
            confirmed: boolean;
            blocked: boolean;
            role?: (number | {
                id: number;
                name: string;
                description: (string | null);
                type: string;
                createdAt: string;
                updatedAt: string;
            });
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
        };
    } | {
        user: {
            id: number;
            documentId: string;
            username: string;
            email: string;
            provider: string;
            confirmed: boolean;
            blocked: boolean;
            role?: (number | {
                id: number;
                name: string;
                description: (string | null);
                type: string;
                createdAt: string;
                updatedAt: string;
            });
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
        };
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/local/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param provider
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsGetAuthByProviderCallback(
        provider: string,
    ): CancelablePromise<{
        jwt: string;
        refreshToken?: string;
        user: {
            id: number;
            documentId: string;
            username: string;
            email: string;
            provider: string;
            confirmed: boolean;
            blocked: boolean;
            role?: (number | {
                id: number;
                name: string;
                description: (string | null);
                type: string;
                createdAt: string;
                updatedAt: string;
            });
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/{provider}/callback',
            path: {
                'provider': provider,
            },
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsPostAuthForgotPassword(
        requestBody?: {
            email: string;
        },
    ): CancelablePromise<{
        ok: boolean;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/forgot-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsPostAuthResetPassword(
        requestBody?: {
            code: string;
            password: string;
            passwordConfirmation: string;
        },
    ): CancelablePromise<{
        jwt: string;
        refreshToken?: string;
        user: {
            id: number;
            documentId: string;
            username: string;
            email: string;
            provider: string;
            confirmed: boolean;
            blocked: boolean;
            role?: (number | {
                id: number;
                name: string;
                description: (string | null);
                type: string;
                createdAt: string;
                updatedAt: string;
            });
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/reset-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @returns void
     * @throws ApiError
     */
    public static usersPermissionsGetAuthEmailConfirmation(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/email-confirmation',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsPostAuthSendEmailConfirmation(
        requestBody?: {
            email: string;
        },
    ): CancelablePromise<{
        email: string;
        sent: boolean;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/send-email-confirmation',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsPostAuthChangePassword(
        requestBody?: {
            currentPassword: string;
            password: string;
            passwordConfirmation: string;
        },
    ): CancelablePromise<{
        jwt: string;
        refreshToken?: string;
        user: {
            id: number;
            documentId: string;
            username: string;
            email: string;
            provider: string;
            confirmed: boolean;
            blocked: boolean;
            role?: (number | {
                id: number;
                name: string;
                description: (string | null);
                type: string;
                createdAt: string;
                updatedAt: string;
            });
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/change-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @returns void
     * @throws ApiError
     */
    public static usersPermissionsPostAuthRefresh(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @returns void
     * @throws ApiError
     */
    public static usersPermissionsPostAuthLogout(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param filters
     * @returns number OK
     * @throws ApiError
     */
    public static usersPermissionsGetUsersCount(
        filters?: Record<string, any>,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/count',
            query: {
                'filters': filters,
            },
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param fields
     * @param populate
     * @param sort
     * @param pagination
     * @param filters
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsGetUsers(
        fields?: (string | Array<string>),
        populate?: (string | Array<string> | Record<string, any>),
        sort?: (string | Array<string> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        pagination?: ({
            /**
             * Include total count in response
             */
            withCount?: boolean;
        } & ({
            /**
             * Page number (1-based)
             */
            page: number;
            /**
             * Number of entries per page
             */
            pageSize: number;
        } | {
            /**
             * Number of entries to skip
             */
            start: number;
            /**
             * Maximum number of entries to return
             */
            limit: number;
        })),
        filters?: Record<string, any>,
    ): CancelablePromise<Array<{
        id: number;
        documentId: string;
        username: string;
        email: string;
        provider: string;
        confirmed: boolean;
        blocked: boolean;
        role?: (number | {
            id: number;
            name: string;
            description: (string | null);
            type: string;
            createdAt: string;
            updatedAt: string;
        });
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users',
            query: {
                'fields': fields,
                'populate': populate,
                'sort': sort,
                'pagination': pagination,
                'filters': filters,
            },
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsPostUsers(
        requestBody?: {
            username: string;
            email: string;
            password: string;
            role?: number;
        },
    ): CancelablePromise<{
        id: number;
        documentId: string;
        username: string;
        email: string;
        provider: string;
        confirmed: boolean;
        blocked: boolean;
        role?: (number | {
            id: number;
            name: string;
            description: (string | null);
            type: string;
            createdAt: string;
            updatedAt: string;
        });
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param fields
     * @param populate
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsGetUsersMe(
        fields?: (string | Array<string>),
        populate?: (string | Array<string> | Record<string, any>),
    ): CancelablePromise<{
        id: number;
        documentId: string;
        username: string;
        email: string;
        provider: string;
        confirmed: boolean;
        blocked: boolean;
        role?: (number | {
            id: number;
            name: string;
            description: (string | null);
            type: string;
            createdAt: string;
            updatedAt: string;
        });
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me',
            query: {
                'fields': fields,
                'populate': populate,
            },
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param id
     * @param fields
     * @param populate
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsGetUsersById(
        id: string,
        fields?: (string | Array<string>),
        populate?: (string | Array<string> | Record<string, any>),
    ): CancelablePromise<{
        id: number;
        documentId: string;
        username: string;
        email: string;
        provider: string;
        confirmed: boolean;
        blocked: boolean;
        role?: (number | {
            id: number;
            name: string;
            description: (string | null);
            type: string;
            createdAt: string;
            updatedAt: string;
        });
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            query: {
                'fields': fields,
                'populate': populate,
            },
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsPutUsersById(
        id: string,
        requestBody?: {
            username?: string;
            email?: string;
            password?: string;
            role?: number;
        },
    ): CancelablePromise<{
        id: number;
        documentId: string;
        username: string;
        email: string;
        provider: string;
        confirmed: boolean;
        blocked: boolean;
        role?: (number | {
            id: number;
            name: string;
            description: (string | null);
            type: string;
            createdAt: string;
            updatedAt: string;
        });
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsDeleteUsersById(
        id: string,
    ): CancelablePromise<{
        id: number;
        documentId: string;
        username: string;
        email: string;
        provider: string;
        confirmed: boolean;
        blocked: boolean;
        role?: (number | {
            id: number;
            name: string;
            description: (string | null);
            type: string;
            createdAt: string;
            updatedAt: string;
        });
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsGetRolesById(
        id: string,
    ): CancelablePromise<{
        role: {
            id: number;
            documentId: string;
            name: string;
            description: (string | null);
            type: string;
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
            nb_users?: number;
            permissions?: Record<string, {
                controllers: Record<string, Record<string, {
                    enabled: boolean;
                    policy: string;
                }>>;
            }>;
            users?: Array<any>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/roles/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsGetRoles(): CancelablePromise<{
        roles: Array<{
            id: number;
            documentId: string;
            name: string;
            description: (string | null);
            type: string;
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
            nb_users?: number;
            permissions?: Record<string, {
                controllers: Record<string, Record<string, {
                    enabled: boolean;
                    policy: string;
                }>>;
            }>;
            users?: Array<any>;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/roles',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsPostRoles(
        requestBody?: {
            name: string;
            description?: string;
            type: string;
            permissions?: Record<string, any>;
        },
    ): CancelablePromise<{
        ok: boolean;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/roles',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param role
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsPutRolesByRole(
        role: string,
        requestBody?: {
            name?: string;
            description?: string;
            type?: string;
            permissions?: Record<string, any>;
        },
    ): CancelablePromise<{
        ok: boolean;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/roles/{role}',
            path: {
                'role': role,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param role
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsDeleteRolesByRole(
        role: string,
    ): CancelablePromise<{
        ok: boolean;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/roles/{role}',
            path: {
                'role': role,
            },
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsGetPermissions(): CancelablePromise<{
        permissions: Record<string, {
            controllers: Record<string, Record<string, {
                enabled: boolean;
                policy: string;
            }>>;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/permissions',
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
