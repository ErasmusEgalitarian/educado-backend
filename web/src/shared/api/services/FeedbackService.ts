/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiCourseCourseDocument } from '../models/ApiCourseCourseDocument';
import type { ApiStudentStudentDocument } from '../models/ApiStudentStudentDocument';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FeedbackService {
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
    public static feedbackGetFeedbacks(
        fields?: Array<'rating' | 'feedbackText' | 'dateCreated' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
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
        sort?: ('rating' | 'feedbackText' | 'dateCreated' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'rating' | 'feedbackText' | 'dateCreated' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        populate?: (string | 'course' | 'student' | Array<'course' | 'student'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<{
        data: Array<{
            /**
             * The document ID, represented by a UUID
             */
            documentId: string;
            id: number;
            /**
             * An integer field
             */
            rating: number;
            /**
             * A text field
             */
            feedbackText?: string;
            /**
             * A date field
             */
            dateCreated: string;
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
            course?: ApiCourseCourseDocument;
            /**
             * A relational field
             */
            student?: ApiStudentStudentDocument;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feedbacks',
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
    public static feedbackPostFeedbacks(
        fields?: Array<'rating' | 'feedbackText' | 'dateCreated' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'course' | 'student' | Array<'course' | 'student'>),
        status?: 'draft' | 'published',
        requestBody?: {
            data: {
                /**
                 * A float field
                 */
                rating: number;
                /**
                 * A text field
                 */
                feedbackText?: string;
                /**
                 * A date field
                 */
                dateCreated: string;
                /**
                 * A datetime field
                 */
                publishedAt: string;
                /**
                 * A relational field
                 */
                course?: string;
                /**
                 * A relational field
                 */
                student?: string;
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
             * An integer field
             */
            rating: number;
            /**
             * A text field
             */
            feedbackText?: string;
            /**
             * A date field
             */
            dateCreated: string;
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
            course?: ApiCourseCourseDocument;
            /**
             * A relational field
             */
            student?: ApiStudentStudentDocument;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/feedbacks',
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
    public static feedbackGetFeedbacksById(
        id: string,
        fields?: Array<'rating' | 'feedbackText' | 'dateCreated' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'course' | 'student' | Array<'course' | 'student'>),
        filters?: Record<string, any>,
        sort?: ('rating' | 'feedbackText' | 'dateCreated' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'rating' | 'feedbackText' | 'dateCreated' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        status?: 'draft' | 'published',
    ): CancelablePromise<{
        data: {
            /**
             * The document ID, represented by a UUID
             */
            documentId: string;
            id: number;
            /**
             * An integer field
             */
            rating: number;
            /**
             * A text field
             */
            feedbackText?: string;
            /**
             * A date field
             */
            dateCreated: string;
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
            course?: ApiCourseCourseDocument;
            /**
             * A relational field
             */
            student?: ApiStudentStudentDocument;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feedbacks/{id}',
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
    public static feedbackPutFeedbacksById(
        id: string,
        fields?: Array<'rating' | 'feedbackText' | 'dateCreated' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'course' | 'student' | Array<'course' | 'student'>),
        status?: 'draft' | 'published',
        requestBody?: {
            data: {
                /**
                 * A float field
                 */
                rating?: number;
                /**
                 * A text field
                 */
                feedbackText?: string;
                /**
                 * A date field
                 */
                dateCreated?: string;
                /**
                 * A datetime field
                 */
                publishedAt?: string;
                /**
                 * A relational field
                 */
                course?: string;
                /**
                 * A relational field
                 */
                student?: string;
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
             * An integer field
             */
            rating: number;
            /**
             * A text field
             */
            feedbackText?: string;
            /**
             * A date field
             */
            dateCreated: string;
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
            course?: ApiCourseCourseDocument;
            /**
             * A relational field
             */
            student?: ApiStudentStudentDocument;
        };
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/feedbacks/{id}',
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
    public static feedbackDeleteFeedbacksById(
        id: string,
        fields?: Array<'rating' | 'feedbackText' | 'dateCreated' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'course' | 'student' | Array<'course' | 'student'>),
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
             * An integer field
             */
            rating: number;
            /**
             * A text field
             */
            feedbackText?: string;
            /**
             * A date field
             */
            dateCreated: string;
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
            course?: ApiCourseCourseDocument;
            /**
             * A relational field
             */
            student?: ApiStudentStudentDocument;
        };
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/feedbacks/{id}',
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
