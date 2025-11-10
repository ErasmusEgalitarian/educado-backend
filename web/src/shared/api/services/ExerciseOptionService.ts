/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiExerciseExerciseDocument } from '../models/ApiExerciseExerciseDocument';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ExerciseOptionService {
    /**
     * @param fields
     * @param filters
     * @param q
     * @param pagination
     * @param sort
     * @param populate
     * @param status
     * @returns any OK
     * @throws ApiError
     */
    public static exerciseOptionGetExerciseOptions(
        fields?: Array<'text' | 'explanation' | 'isCorrect' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        filters?: Record<string, any>,
        q?: string,
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
        sort?: ('text' | 'explanation' | 'isCorrect' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'text' | 'explanation' | 'isCorrect' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        populate?: (string | 'exercise' | Array<'exercise'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<{
        data: Array<{
            /**
             * The document ID, represented by a UUID
             */
            documentId: string;
            id: number;
            /**
             * A string field
             */
            text: string;
            /**
             * A text field
             */
            explanation: string;
            /**
             * A boolean field
             */
            isCorrect: boolean;
            /**
             * A datetime field
             */
            createdAt?: string;
            /**
             * A datetime field
             */
            updatedAt?: string;
            /**
             * A datetime field
             */
            publishedAt: string;
            /**
             * A relational field
             */
            exercise?: ApiExerciseExerciseDocument;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/exercise-options',
            query: {
                'fields': fields,
                'filters': filters,
                '_q': q,
                'pagination': pagination,
                'sort': sort,
                'populate': populate,
                'status': status,
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
     * @param status
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static exerciseOptionPostExerciseOptions(
        fields?: Array<'text' | 'explanation' | 'isCorrect' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'exercise' | Array<'exercise'>),
        status?: 'draft' | 'published',
        requestBody?: {
            data: {
                /**
                 * A string field
                 */
                text: string;
                /**
                 * A text field
                 */
                explanation: string;
                /**
                 * A boolean field
                 */
                isCorrect: '0' | '1' | 't' | 'true' | 'f' | 'false';
                /**
                 * A datetime field
                 */
                publishedAt: string;
                /**
                 * A relational field
                 */
                exercise?: string;
            };
        },
    ): CancelablePromise<{
        data: {
            /**
             * The document ID, represented by a UUID
             */
            documentId: string;
            id: number;
            /**
             * A string field
             */
            text: string;
            /**
             * A text field
             */
            explanation: string;
            /**
             * A boolean field
             */
            isCorrect: boolean;
            /**
             * A datetime field
             */
            createdAt?: string;
            /**
             * A datetime field
             */
            updatedAt?: string;
            /**
             * A datetime field
             */
            publishedAt: string;
            /**
             * A relational field
             */
            exercise?: ApiExerciseExerciseDocument;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/exercise-options',
            query: {
                'fields': fields,
                'populate': populate,
                'status': status,
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
     * @param fields
     * @param populate
     * @param filters
     * @param sort
     * @param status
     * @returns any OK
     * @throws ApiError
     */
    public static exerciseOptionGetExerciseOptionsById(
        id: string,
        fields?: Array<'text' | 'explanation' | 'isCorrect' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'exercise' | Array<'exercise'>),
        filters?: Record<string, any>,
        sort?: ('text' | 'explanation' | 'isCorrect' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'text' | 'explanation' | 'isCorrect' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        status?: 'draft' | 'published',
    ): CancelablePromise<{
        data: {
            /**
             * The document ID, represented by a UUID
             */
            documentId: string;
            id: number;
            /**
             * A string field
             */
            text: string;
            /**
             * A text field
             */
            explanation: string;
            /**
             * A boolean field
             */
            isCorrect: boolean;
            /**
             * A datetime field
             */
            createdAt?: string;
            /**
             * A datetime field
             */
            updatedAt?: string;
            /**
             * A datetime field
             */
            publishedAt: string;
            /**
             * A relational field
             */
            exercise?: ApiExerciseExerciseDocument;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/exercise-options/{id}',
            path: {
                'id': id,
            },
            query: {
                'fields': fields,
                'populate': populate,
                'filters': filters,
                'sort': sort,
                'status': status,
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
     * @param status
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static exerciseOptionPutExerciseOptionsById(
        id: string,
        fields?: Array<'text' | 'explanation' | 'isCorrect' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'exercise' | Array<'exercise'>),
        status?: 'draft' | 'published',
        requestBody?: {
            data: {
                /**
                 * A string field
                 */
                text?: string;
                /**
                 * A text field
                 */
                explanation?: string;
                /**
                 * A boolean field
                 */
                isCorrect?: '0' | '1' | 't' | 'true' | 'f' | 'false';
                /**
                 * A datetime field
                 */
                publishedAt?: string;
                /**
                 * A relational field
                 */
                exercise?: string;
            };
        },
    ): CancelablePromise<{
        data: {
            /**
             * The document ID, represented by a UUID
             */
            documentId: string;
            id: number;
            /**
             * A string field
             */
            text: string;
            /**
             * A text field
             */
            explanation: string;
            /**
             * A boolean field
             */
            isCorrect: boolean;
            /**
             * A datetime field
             */
            createdAt?: string;
            /**
             * A datetime field
             */
            updatedAt?: string;
            /**
             * A datetime field
             */
            publishedAt: string;
            /**
             * A relational field
             */
            exercise?: ApiExerciseExerciseDocument;
        };
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/exercise-options/{id}',
            path: {
                'id': id,
            },
            query: {
                'fields': fields,
                'populate': populate,
                'status': status,
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
     * @param fields
     * @param populate
     * @param filters
     * @param status
     * @returns any OK
     * @throws ApiError
     */
    public static exerciseOptionDeleteExerciseOptionsById(
        id: string,
        fields?: Array<'text' | 'explanation' | 'isCorrect' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'exercise' | Array<'exercise'>),
        filters?: Record<string, any>,
        status?: 'draft' | 'published',
    ): CancelablePromise<{
        data: {
            /**
             * The document ID, represented by a UUID
             */
            documentId: string;
            id: number;
            /**
             * A string field
             */
            text: string;
            /**
             * A text field
             */
            explanation: string;
            /**
             * A boolean field
             */
            isCorrect: boolean;
            /**
             * A datetime field
             */
            createdAt?: string;
            /**
             * A datetime field
             */
            updatedAt?: string;
            /**
             * A datetime field
             */
            publishedAt: string;
            /**
             * A relational field
             */
            exercise?: ApiExerciseExerciseDocument;
        };
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/exercise-options/{id}',
            path: {
                'id': id,
            },
            query: {
                'fields': fields,
                'populate': populate,
                'filters': filters,
                'status': status,
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
}
