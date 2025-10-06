/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiCourseCourseDocument } from '../models/ApiCourseCourseDocument';
import type { ApiFeedbackFeedbackDocument } from '../models/ApiFeedbackFeedbackDocument';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StudentService {
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
    public static studentGetStudents(
        fields?: Array<'firstName' | 'lastName' | 'joinedAt' | 'biography' | 'email' | 'password' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
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
        sort?: ('firstName' | 'lastName' | 'joinedAt' | 'biography' | 'email' | 'password' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'firstName' | 'lastName' | 'joinedAt' | 'biography' | 'email' | 'password' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        populate?: (string | 'feedbacks' | 'courses' | Array<'feedbacks' | 'courses'>),
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
            firstName: string;
            /**
             * A string field
             */
            lastName?: string;
            /**
             * A date field
             */
            joinedAt: string;
            /**
             * A text field
             */
            biography?: string;
            /**
             * An email field
             */
            email: string;
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
            feedbacks?: Array<ApiFeedbackFeedbackDocument>;
            /**
             * A relational field
             */
            courses?: Array<ApiCourseCourseDocument>;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/students',
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
    public static studentPostStudents(
        fields?: Array<'firstName' | 'lastName' | 'joinedAt' | 'biography' | 'email' | 'password' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'feedbacks' | 'courses' | Array<'feedbacks' | 'courses'>),
        status?: 'draft' | 'published',
        requestBody?: {
            data: {
                /**
                 * A string field
                 */
                firstName: string;
                /**
                 * A string field
                 */
                lastName?: string;
                /**
                 * A date field
                 */
                joinedAt: string;
                /**
                 * A text field
                 */
                biography?: string;
                /**
                 * An email field
                 */
                email: string;
                /**
                 * A password field
                 */
                password: string;
                /**
                 * A datetime field
                 */
                publishedAt: string;
                /**
                 * A relational field
                 */
                feedbacks?: Array<string>;
                /**
                 * A relational field
                 */
                courses?: Array<string>;
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
            firstName: string;
            /**
             * A string field
             */
            lastName?: string;
            /**
             * A date field
             */
            joinedAt: string;
            /**
             * A text field
             */
            biography?: string;
            /**
             * An email field
             */
            email: string;
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
            feedbacks?: Array<ApiFeedbackFeedbackDocument>;
            /**
             * A relational field
             */
            courses?: Array<ApiCourseCourseDocument>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/students',
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
    public static studentGetStudentsById(
        id: string,
        fields?: Array<'firstName' | 'lastName' | 'joinedAt' | 'biography' | 'email' | 'password' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'feedbacks' | 'courses' | Array<'feedbacks' | 'courses'>),
        filters?: Record<string, any>,
        sort?: ('firstName' | 'lastName' | 'joinedAt' | 'biography' | 'email' | 'password' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'firstName' | 'lastName' | 'joinedAt' | 'biography' | 'email' | 'password' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
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
            firstName: string;
            /**
             * A string field
             */
            lastName?: string;
            /**
             * A date field
             */
            joinedAt: string;
            /**
             * A text field
             */
            biography?: string;
            /**
             * An email field
             */
            email: string;
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
            feedbacks?: Array<ApiFeedbackFeedbackDocument>;
            /**
             * A relational field
             */
            courses?: Array<ApiCourseCourseDocument>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/students/{id}',
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
    public static studentPutStudentsById(
        id: string,
        fields?: Array<'firstName' | 'lastName' | 'joinedAt' | 'biography' | 'email' | 'password' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'feedbacks' | 'courses' | Array<'feedbacks' | 'courses'>),
        status?: 'draft' | 'published',
        requestBody?: {
            data: {
                /**
                 * A string field
                 */
                firstName?: string;
                /**
                 * A string field
                 */
                lastName?: string;
                /**
                 * A date field
                 */
                joinedAt?: string;
                /**
                 * A text field
                 */
                biography?: string;
                /**
                 * An email field
                 */
                email?: string;
                /**
                 * A password field
                 */
                password?: string;
                /**
                 * A datetime field
                 */
                publishedAt?: string;
                /**
                 * A relational field
                 */
                feedbacks?: Array<string>;
                /**
                 * A relational field
                 */
                courses?: Array<string>;
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
            firstName: string;
            /**
             * A string field
             */
            lastName?: string;
            /**
             * A date field
             */
            joinedAt: string;
            /**
             * A text field
             */
            biography?: string;
            /**
             * An email field
             */
            email: string;
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
            feedbacks?: Array<ApiFeedbackFeedbackDocument>;
            /**
             * A relational field
             */
            courses?: Array<ApiCourseCourseDocument>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/students/{id}',
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
    public static studentDeleteStudentsById(
        id: string,
        fields?: Array<'firstName' | 'lastName' | 'joinedAt' | 'biography' | 'email' | 'password' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'feedbacks' | 'courses' | Array<'feedbacks' | 'courses'>),
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
            firstName: string;
            /**
             * A string field
             */
            lastName?: string;
            /**
             * A date field
             */
            joinedAt: string;
            /**
             * A text field
             */
            biography?: string;
            /**
             * An email field
             */
            email: string;
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
            feedbacks?: Array<ApiFeedbackFeedbackDocument>;
            /**
             * A relational field
             */
            courses?: Array<ApiCourseCourseDocument>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/students/{id}',
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
