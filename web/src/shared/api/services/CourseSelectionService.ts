/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiCourseCourseDocument } from '../models/ApiCourseCourseDocument';
import type { ApiExerciseExerciseDocument } from '../models/ApiExerciseExerciseDocument';
import type { ApiLectureLectureDocument } from '../models/ApiLectureLectureDocument';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CourseSelectionService {
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
    public static courseSelectionGetCourseSelections(
        fields?: Array<'title' | 'description' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
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
        sort?: ('title' | 'description' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'title' | 'description' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        populate?: (string | 'exercises' | 'lectures' | 'course' | Array<'exercises' | 'lectures' | 'course'>),
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
            title: string;
            /**
             * A text field
             */
            description?: string;
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
            exercises?: Array<ApiExerciseExerciseDocument>;
            /**
             * A relational field
             */
            lectures?: Array<ApiLectureLectureDocument>;
            /**
             * A relational field
             */
            course?: ApiCourseCourseDocument;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/course-selections',
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
    public static courseSelectionPostCourseSelections(
        fields?: Array<'title' | 'description' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'exercises' | 'lectures' | 'course' | Array<'exercises' | 'lectures' | 'course'>),
        status?: 'draft' | 'published',
        requestBody?: {
            data: {
                /**
                 * A string field
                 */
                title: string;
                /**
                 * A text field
                 */
                description?: string;
                /**
                 * A datetime field
                 */
                publishedAt: string;
                /**
                 * A relational field
                 */
                exercises?: Array<string>;
                /**
                 * A relational field
                 */
                lectures?: Array<string>;
                /**
                 * A relational field
                 */
                course?: string;
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
            title: string;
            /**
             * A text field
             */
            description?: string;
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
            exercises?: Array<ApiExerciseExerciseDocument>;
            /**
             * A relational field
             */
            lectures?: Array<ApiLectureLectureDocument>;
            /**
             * A relational field
             */
            course?: ApiCourseCourseDocument;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/course-selections',
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
    public static courseSelectionGetCourseSelectionsById(
        id: string,
        fields?: Array<'title' | 'description' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'exercises' | 'lectures' | 'course' | Array<'exercises' | 'lectures' | 'course'>),
        filters?: Record<string, any>,
        sort?: ('title' | 'description' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'title' | 'description' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
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
            title: string;
            /**
             * A text field
             */
            description?: string;
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
            exercises?: Array<ApiExerciseExerciseDocument>;
            /**
             * A relational field
             */
            lectures?: Array<ApiLectureLectureDocument>;
            /**
             * A relational field
             */
            course?: ApiCourseCourseDocument;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/course-selections/{id}',
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
    public static courseSelectionPutCourseSelectionsById(
        id: string,
        fields?: Array<'title' | 'description' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'exercises' | 'lectures' | 'course' | Array<'exercises' | 'lectures' | 'course'>),
        status?: 'draft' | 'published',
        requestBody?: {
            data: {
                /**
                 * A string field
                 */
                title?: string;
                /**
                 * A text field
                 */
                description?: string;
                /**
                 * A datetime field
                 */
                publishedAt?: string;
                /**
                 * A relational field
                 */
                exercises?: Array<string>;
                /**
                 * A relational field
                 */
                lectures?: Array<string>;
                /**
                 * A relational field
                 */
                course?: string;
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
            title: string;
            /**
             * A text field
             */
            description?: string;
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
            exercises?: Array<ApiExerciseExerciseDocument>;
            /**
             * A relational field
             */
            lectures?: Array<ApiLectureLectureDocument>;
            /**
             * A relational field
             */
            course?: ApiCourseCourseDocument;
        };
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/course-selections/{id}',
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
    public static courseSelectionDeleteCourseSelectionsById(
        id: string,
        fields?: Array<'title' | 'description' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'exercises' | 'lectures' | 'course' | Array<'exercises' | 'lectures' | 'course'>),
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
            title: string;
            /**
             * A text field
             */
            description?: string;
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
            exercises?: Array<ApiExerciseExerciseDocument>;
            /**
             * A relational field
             */
            lectures?: Array<ApiLectureLectureDocument>;
            /**
             * A relational field
             */
            course?: ApiCourseCourseDocument;
        };
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/course-selections/{id}',
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
