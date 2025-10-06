/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiCourseCourseDocument } from '../models/ApiCourseCourseDocument';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ContentCreatorService {
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
    public static contentCreatorGetContentCreators(
        fields?: Array<'firstName' | 'lastName' | 'joinedAt' | 'verifiedAt' | 'biography' | 'email' | 'password' | 'education' | 'statusValue' | 'courseExperience' | 'institution' | 'eduStart' | 'eduEnd' | 'currentCompany' | 'currentJobTitle' | 'companyStart' | 'companyEnd' | 'jobDescription' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
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
        sort?: ('firstName' | 'lastName' | 'joinedAt' | 'verifiedAt' | 'biography' | 'email' | 'password' | 'education' | 'statusValue' | 'courseExperience' | 'institution' | 'eduStart' | 'eduEnd' | 'currentCompany' | 'currentJobTitle' | 'companyStart' | 'companyEnd' | 'jobDescription' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'firstName' | 'lastName' | 'joinedAt' | 'verifiedAt' | 'biography' | 'email' | 'password' | 'education' | 'statusValue' | 'courseExperience' | 'institution' | 'eduStart' | 'eduEnd' | 'currentCompany' | 'currentJobTitle' | 'companyStart' | 'companyEnd' | 'jobDescription' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        populate?: (string | 'courses' | Array<'courses'>),
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
             * A date field
             */
            verifiedAt?: string;
            /**
             * A text field
             */
            biography?: string;
            /**
             * An email field
             */
            email: string;
            /**
             * An enum field
             */
            education: 'TODO1' | 'TODO2' | 'TODO3';
            /**
             * An enum field
             */
            statusValue: 'TODO1' | 'TODO2' | 'TODO3';
            /**
             * A string field
             */
            courseExperience: string;
            /**
             * A string field
             */
            institution: string;
            /**
             * A date field
             */
            eduStart: string;
            /**
             * A date field
             */
            eduEnd: string;
            /**
             * A string field
             */
            currentCompany: string;
            /**
             * A string field
             */
            currentJobTitle: string;
            /**
             * A date field
             */
            companyStart: string;
            /**
             * A date field
             */
            companyEnd?: string;
            /**
             * A string field
             */
            jobDescription?: string;
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
            courses?: Array<ApiCourseCourseDocument>;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content-creators',
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
    public static contentCreatorPostContentCreators(
        fields?: Array<'firstName' | 'lastName' | 'joinedAt' | 'verifiedAt' | 'biography' | 'email' | 'password' | 'education' | 'statusValue' | 'courseExperience' | 'institution' | 'eduStart' | 'eduEnd' | 'currentCompany' | 'currentJobTitle' | 'companyStart' | 'companyEnd' | 'jobDescription' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'courses' | Array<'courses'>),
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
                 * A date field
                 */
                verifiedAt?: string;
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
                 * An enum field
                 */
                education: 'TODO1' | 'TODO2' | 'TODO3';
                /**
                 * An enum field
                 */
                statusValue: 'TODO1' | 'TODO2' | 'TODO3';
                /**
                 * A string field
                 */
                courseExperience: string;
                /**
                 * A string field
                 */
                institution: string;
                /**
                 * A date field
                 */
                eduStart: string;
                /**
                 * A date field
                 */
                eduEnd: string;
                /**
                 * A string field
                 */
                currentCompany: string;
                /**
                 * A string field
                 */
                currentJobTitle: string;
                /**
                 * A date field
                 */
                companyStart: string;
                /**
                 * A date field
                 */
                companyEnd?: string;
                /**
                 * A string field
                 */
                jobDescription?: string;
                /**
                 * A datetime field
                 */
                publishedAt: string;
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
             * A date field
             */
            verifiedAt?: string;
            /**
             * A text field
             */
            biography?: string;
            /**
             * An email field
             */
            email: string;
            /**
             * An enum field
             */
            education: 'TODO1' | 'TODO2' | 'TODO3';
            /**
             * An enum field
             */
            statusValue: 'TODO1' | 'TODO2' | 'TODO3';
            /**
             * A string field
             */
            courseExperience: string;
            /**
             * A string field
             */
            institution: string;
            /**
             * A date field
             */
            eduStart: string;
            /**
             * A date field
             */
            eduEnd: string;
            /**
             * A string field
             */
            currentCompany: string;
            /**
             * A string field
             */
            currentJobTitle: string;
            /**
             * A date field
             */
            companyStart: string;
            /**
             * A date field
             */
            companyEnd?: string;
            /**
             * A string field
             */
            jobDescription?: string;
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
            courses?: Array<ApiCourseCourseDocument>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/content-creators',
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
    public static contentCreatorGetContentCreatorsById(
        id: string,
        fields?: Array<'firstName' | 'lastName' | 'joinedAt' | 'verifiedAt' | 'biography' | 'email' | 'password' | 'education' | 'statusValue' | 'courseExperience' | 'institution' | 'eduStart' | 'eduEnd' | 'currentCompany' | 'currentJobTitle' | 'companyStart' | 'companyEnd' | 'jobDescription' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'courses' | Array<'courses'>),
        filters?: Record<string, any>,
        sort?: ('firstName' | 'lastName' | 'joinedAt' | 'verifiedAt' | 'biography' | 'email' | 'password' | 'education' | 'statusValue' | 'courseExperience' | 'institution' | 'eduStart' | 'eduEnd' | 'currentCompany' | 'currentJobTitle' | 'companyStart' | 'companyEnd' | 'jobDescription' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'firstName' | 'lastName' | 'joinedAt' | 'verifiedAt' | 'biography' | 'email' | 'password' | 'education' | 'statusValue' | 'courseExperience' | 'institution' | 'eduStart' | 'eduEnd' | 'currentCompany' | 'currentJobTitle' | 'companyStart' | 'companyEnd' | 'jobDescription' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
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
             * A date field
             */
            verifiedAt?: string;
            /**
             * A text field
             */
            biography?: string;
            /**
             * An email field
             */
            email: string;
            /**
             * An enum field
             */
            education: 'TODO1' | 'TODO2' | 'TODO3';
            /**
             * An enum field
             */
            statusValue: 'TODO1' | 'TODO2' | 'TODO3';
            /**
             * A string field
             */
            courseExperience: string;
            /**
             * A string field
             */
            institution: string;
            /**
             * A date field
             */
            eduStart: string;
            /**
             * A date field
             */
            eduEnd: string;
            /**
             * A string field
             */
            currentCompany: string;
            /**
             * A string field
             */
            currentJobTitle: string;
            /**
             * A date field
             */
            companyStart: string;
            /**
             * A date field
             */
            companyEnd?: string;
            /**
             * A string field
             */
            jobDescription?: string;
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
            courses?: Array<ApiCourseCourseDocument>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content-creators/{id}',
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
    public static contentCreatorPutContentCreatorsById(
        id: string,
        fields?: Array<'firstName' | 'lastName' | 'joinedAt' | 'verifiedAt' | 'biography' | 'email' | 'password' | 'education' | 'statusValue' | 'courseExperience' | 'institution' | 'eduStart' | 'eduEnd' | 'currentCompany' | 'currentJobTitle' | 'companyStart' | 'companyEnd' | 'jobDescription' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'courses' | Array<'courses'>),
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
                 * A date field
                 */
                verifiedAt?: string;
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
                 * An enum field
                 */
                education?: 'TODO1' | 'TODO2' | 'TODO3';
                /**
                 * An enum field
                 */
                statusValue?: 'TODO1' | 'TODO2' | 'TODO3';
                /**
                 * A string field
                 */
                courseExperience?: string;
                /**
                 * A string field
                 */
                institution?: string;
                /**
                 * A date field
                 */
                eduStart?: string;
                /**
                 * A date field
                 */
                eduEnd?: string;
                /**
                 * A string field
                 */
                currentCompany?: string;
                /**
                 * A string field
                 */
                currentJobTitle?: string;
                /**
                 * A date field
                 */
                companyStart?: string;
                /**
                 * A date field
                 */
                companyEnd?: string;
                /**
                 * A string field
                 */
                jobDescription?: string;
                /**
                 * A datetime field
                 */
                publishedAt?: string;
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
             * A date field
             */
            verifiedAt?: string;
            /**
             * A text field
             */
            biography?: string;
            /**
             * An email field
             */
            email: string;
            /**
             * An enum field
             */
            education: 'TODO1' | 'TODO2' | 'TODO3';
            /**
             * An enum field
             */
            statusValue: 'TODO1' | 'TODO2' | 'TODO3';
            /**
             * A string field
             */
            courseExperience: string;
            /**
             * A string field
             */
            institution: string;
            /**
             * A date field
             */
            eduStart: string;
            /**
             * A date field
             */
            eduEnd: string;
            /**
             * A string field
             */
            currentCompany: string;
            /**
             * A string field
             */
            currentJobTitle: string;
            /**
             * A date field
             */
            companyStart: string;
            /**
             * A date field
             */
            companyEnd?: string;
            /**
             * A string field
             */
            jobDescription?: string;
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
            courses?: Array<ApiCourseCourseDocument>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/content-creators/{id}',
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
    public static contentCreatorDeleteContentCreatorsById(
        id: string,
        fields?: Array<'firstName' | 'lastName' | 'joinedAt' | 'verifiedAt' | 'biography' | 'email' | 'password' | 'education' | 'statusValue' | 'courseExperience' | 'institution' | 'eduStart' | 'eduEnd' | 'currentCompany' | 'currentJobTitle' | 'companyStart' | 'companyEnd' | 'jobDescription' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'courses' | Array<'courses'>),
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
             * A date field
             */
            verifiedAt?: string;
            /**
             * A text field
             */
            biography?: string;
            /**
             * An email field
             */
            email: string;
            /**
             * An enum field
             */
            education: 'TODO1' | 'TODO2' | 'TODO3';
            /**
             * An enum field
             */
            statusValue: 'TODO1' | 'TODO2' | 'TODO3';
            /**
             * A string field
             */
            courseExperience: string;
            /**
             * A string field
             */
            institution: string;
            /**
             * A date field
             */
            eduStart: string;
            /**
             * A date field
             */
            eduEnd: string;
            /**
             * A string field
             */
            currentCompany: string;
            /**
             * A string field
             */
            currentJobTitle: string;
            /**
             * A date field
             */
            companyStart: string;
            /**
             * A date field
             */
            companyEnd?: string;
            /**
             * A string field
             */
            jobDescription?: string;
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
            courses?: Array<ApiCourseCourseDocument>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/content-creators/{id}',
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
