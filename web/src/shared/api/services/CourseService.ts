/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiContentCreatorContentCreatorDocument } from '../models/ApiContentCreatorContentCreatorDocument';
import type { ApiCourseCategoryCourseCategoryDocument } from '../models/ApiCourseCategoryCourseCategoryDocument';
import type { ApiCourseSelectionCourseSelectionDocument } from '../models/ApiCourseSelectionCourseSelectionDocument';
import type { ApiFeedbackFeedbackDocument } from '../models/ApiFeedbackFeedbackDocument';
import type { ApiStudentStudentDocument } from '../models/ApiStudentStudentDocument';
import type { PluginUploadFileDocument } from '../models/PluginUploadFileDocument';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CourseService {
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
    public static courseGetCourses(
        fields?: Array<'title' | 'description' | 'difficulty' | 'numOfRatings' | 'numOfSubscriptions' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
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
        sort?: ('title' | 'description' | 'difficulty' | 'numOfRatings' | 'numOfSubscriptions' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'title' | 'description' | 'difficulty' | 'numOfRatings' | 'numOfSubscriptions' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        populate?: (string | 'image' | 'feedbacks' | 'course_sections' | 'course_categories' | 'student' | 'content_creators' | Array<'image' | 'feedbacks' | 'course_sections' | 'course_categories' | 'student' | 'content_creators'>),
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
             * An integer field
             */
            difficulty: number;
            /**
             * An integer field
             */
            numOfRatings: number;
            /**
             * An integer field
             */
            numOfSubscriptions: number;
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
             * A media field
             */
            image?: PluginUploadFileDocument;
            /**
             * A relational field
             */
            feedbacks?: Array<ApiFeedbackFeedbackDocument>;
            /**
             * A relational field
             */
            course_sections?: Array<ApiCourseSelectionCourseSelectionDocument>;
            /**
             * A relational field
             */
            course_categories?: Array<ApiCourseCategoryCourseCategoryDocument>;
            /**
             * A relational field
             */
            student?: ApiStudentStudentDocument;
            /**
             * A relational field
             */
            content_creators?: Array<ApiContentCreatorContentCreatorDocument>;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/courses',
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
    public static coursePostCourses(
        fields?: Array<'title' | 'description' | 'difficulty' | 'numOfRatings' | 'numOfSubscriptions' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'image' | 'feedbacks' | 'course_sections' | 'course_categories' | 'student' | 'content_creators' | Array<'image' | 'feedbacks' | 'course_sections' | 'course_categories' | 'student' | 'content_creators'>),
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
                 * A float field
                 */
                difficulty: number;
                /**
                 * A float field
                 */
                numOfRatings: number;
                /**
                 * A float field
                 */
                numOfSubscriptions: number;
                /**
                 * A datetime field
                 */
                publishedAt: string;
                /**
                 * A media field
                 */
                image?: any;
                /**
                 * A relational field
                 */
                feedbacks?: Array<string>;
                /**
                 * A relational field
                 */
                course_sections?: Array<string>;
                /**
                 * A relational field
                 */
                course_categories?: Array<string>;
                /**
                 * A relational field
                 */
                student?: string;
                /**
                 * A relational field
                 */
                content_creators?: Array<string>;
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
             * An integer field
             */
            difficulty: number;
            /**
             * An integer field
             */
            numOfRatings: number;
            /**
             * An integer field
             */
            numOfSubscriptions: number;
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
             * A media field
             */
            image?: PluginUploadFileDocument;
            /**
             * A relational field
             */
            feedbacks?: Array<ApiFeedbackFeedbackDocument>;
            /**
             * A relational field
             */
            course_sections?: Array<ApiCourseSelectionCourseSelectionDocument>;
            /**
             * A relational field
             */
            course_categories?: Array<ApiCourseCategoryCourseCategoryDocument>;
            /**
             * A relational field
             */
            student?: ApiStudentStudentDocument;
            /**
             * A relational field
             */
            content_creators?: Array<ApiContentCreatorContentCreatorDocument>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/courses',
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
    public static courseGetCoursesById(
        id: string,
        fields?: Array<'title' | 'description' | 'difficulty' | 'numOfRatings' | 'numOfSubscriptions' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'image' | 'feedbacks' | 'course_sections' | 'course_categories' | 'student' | 'content_creators' | Array<'image' | 'feedbacks' | 'course_sections' | 'course_categories' | 'student' | 'content_creators'>),
        filters?: Record<string, any>,
        sort?: ('title' | 'description' | 'difficulty' | 'numOfRatings' | 'numOfSubscriptions' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'title' | 'description' | 'difficulty' | 'numOfRatings' | 'numOfSubscriptions' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
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
             * An integer field
             */
            difficulty: number;
            /**
             * An integer field
             */
            numOfRatings: number;
            /**
             * An integer field
             */
            numOfSubscriptions: number;
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
             * A media field
             */
            image?: PluginUploadFileDocument;
            /**
             * A relational field
             */
            feedbacks?: Array<ApiFeedbackFeedbackDocument>;
            /**
             * A relational field
             */
            course_sections?: Array<ApiCourseSelectionCourseSelectionDocument>;
            /**
             * A relational field
             */
            course_categories?: Array<ApiCourseCategoryCourseCategoryDocument>;
            /**
             * A relational field
             */
            student?: ApiStudentStudentDocument;
            /**
             * A relational field
             */
            content_creators?: Array<ApiContentCreatorContentCreatorDocument>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/courses/{id}',
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
    public static coursePutCoursesById(
        id: string,
        fields?: Array<'title' | 'description' | 'difficulty' | 'numOfRatings' | 'numOfSubscriptions' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'image' | 'feedbacks' | 'course_sections' | 'course_categories' | 'student' | 'content_creators' | Array<'image' | 'feedbacks' | 'course_sections' | 'course_categories' | 'student' | 'content_creators'>),
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
                 * A float field
                 */
                difficulty?: number;
                /**
                 * A float field
                 */
                numOfRatings?: number;
                /**
                 * A float field
                 */
                numOfSubscriptions?: number;
                /**
                 * A datetime field
                 */
                publishedAt?: string;
                /**
                 * A media field
                 */
                image?: any;
                /**
                 * A relational field
                 */
                feedbacks?: Array<string>;
                /**
                 * A relational field
                 */
                course_sections?: Array<string>;
                /**
                 * A relational field
                 */
                course_categories?: Array<string>;
                /**
                 * A relational field
                 */
                student?: string;
                /**
                 * A relational field
                 */
                content_creators?: Array<string>;
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
             * An integer field
             */
            difficulty: number;
            /**
             * An integer field
             */
            numOfRatings: number;
            /**
             * An integer field
             */
            numOfSubscriptions: number;
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
             * A media field
             */
            image?: PluginUploadFileDocument;
            /**
             * A relational field
             */
            feedbacks?: Array<ApiFeedbackFeedbackDocument>;
            /**
             * A relational field
             */
            course_sections?: Array<ApiCourseSelectionCourseSelectionDocument>;
            /**
             * A relational field
             */
            course_categories?: Array<ApiCourseCategoryCourseCategoryDocument>;
            /**
             * A relational field
             */
            student?: ApiStudentStudentDocument;
            /**
             * A relational field
             */
            content_creators?: Array<ApiContentCreatorContentCreatorDocument>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/courses/{id}',
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
    public static courseDeleteCoursesById(
        id: string,
        fields?: Array<'title' | 'description' | 'difficulty' | 'numOfRatings' | 'numOfSubscriptions' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'image' | 'feedbacks' | 'course_sections' | 'course_categories' | 'student' | 'content_creators' | Array<'image' | 'feedbacks' | 'course_sections' | 'course_categories' | 'student' | 'content_creators'>),
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
             * An integer field
             */
            difficulty: number;
            /**
             * An integer field
             */
            numOfRatings: number;
            /**
             * An integer field
             */
            numOfSubscriptions: number;
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
             * A media field
             */
            image?: PluginUploadFileDocument;
            /**
             * A relational field
             */
            feedbacks?: Array<ApiFeedbackFeedbackDocument>;
            /**
             * A relational field
             */
            course_sections?: Array<ApiCourseSelectionCourseSelectionDocument>;
            /**
             * A relational field
             */
            course_categories?: Array<ApiCourseCategoryCourseCategoryDocument>;
            /**
             * A relational field
             */
            student?: ApiStudentStudentDocument;
            /**
             * A relational field
             */
            content_creators?: Array<ApiContentCreatorContentCreatorDocument>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/courses/{id}',
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
