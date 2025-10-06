/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UploadService {
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static uploadPost(
        id?: number,
    ): CancelablePromise<{
        id: number;
        documentId: string;
        name: string;
        alternativeText?: (string | null);
        caption?: (string | null);
        width?: number;
        height?: number;
        formats?: Record<string, any>;
        hash: string;
        ext?: string;
        mime: string;
        size: number;
        url: string;
        previewUrl?: (string | null);
        folder?: number;
        folderPath: string;
        provider: string;
        provider_metadata?: (Record<string, any> | null);
        createdAt: string;
        updatedAt: string;
        createdBy?: number;
        updatedBy?: number;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/',
            query: {
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
     * @param fields
     * @param populate
     * @param sort
     * @param pagination
     * @param filters
     * @returns any OK
     * @throws ApiError
     */
    public static uploadGetFiles(
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
        name: string;
        alternativeText?: (string | null);
        caption?: (string | null);
        width?: number;
        height?: number;
        formats?: Record<string, any>;
        hash: string;
        ext?: string;
        mime: string;
        size: number;
        url: string;
        previewUrl?: (string | null);
        folder?: number;
        folderPath: string;
        provider: string;
        provider_metadata?: (Record<string, any> | null);
        createdAt: string;
        updatedAt: string;
        createdBy?: number;
        updatedBy?: number;
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/files',
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
     * @param id
     * @param fields
     * @param populate
     * @returns any OK
     * @throws ApiError
     */
    public static uploadGetFilesById(
        id: number,
        fields?: (string | Array<string>),
        populate?: (string | Array<string> | Record<string, any>),
    ): CancelablePromise<{
        id: number;
        documentId: string;
        name: string;
        alternativeText?: (string | null);
        caption?: (string | null);
        width?: number;
        height?: number;
        formats?: Record<string, any>;
        hash: string;
        ext?: string;
        mime: string;
        size: number;
        url: string;
        previewUrl?: (string | null);
        folder?: number;
        folderPath: string;
        provider: string;
        provider_metadata?: (Record<string, any> | null);
        createdAt: string;
        updatedAt: string;
        createdBy?: number;
        updatedBy?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/files/{id}',
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
     * @returns any OK
     * @throws ApiError
     */
    public static uploadDeleteFilesById(
        id: number,
    ): CancelablePromise<{
        id: number;
        documentId: string;
        name: string;
        alternativeText?: (string | null);
        caption?: (string | null);
        width?: number;
        height?: number;
        formats?: Record<string, any>;
        hash: string;
        ext?: string;
        mime: string;
        size: number;
        url: string;
        previewUrl?: (string | null);
        folder?: number;
        folderPath: string;
        provider: string;
        provider_metadata?: (Record<string, any> | null);
        createdAt: string;
        updatedAt: string;
        createdBy?: number;
        updatedBy?: number;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/files/{id}',
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
}
