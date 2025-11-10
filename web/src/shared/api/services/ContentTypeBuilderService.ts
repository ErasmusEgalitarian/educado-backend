/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ContentTypeBuilderService {
    /**
     * @param kind
     * @returns any OK
     * @throws ApiError
     */
    public static contentTypeBuilderGetContentTypes(
        kind: 'collectionType' | 'singleType',
    ): CancelablePromise<{
        data: Array<{
            uid: string;
            plugin?: string;
            apiID: string;
            schema: {
                displayName: string;
                singularName: string;
                pluralName: string;
                description: string;
                draftAndPublish: boolean;
                kind: 'collectionType' | 'singleType';
                collectionName?: string;
                attributes: Record<string, ({
                    type: string;
                    configurable?: boolean;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    multiple: boolean;
                    required?: boolean;
                    allowedTypes?: Array<string>;
                } | {
                    type: string;
                    configurable?: boolean;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    relation: string;
                    target: string;
                    targetAttribute: (string | null);
                    autoPopulate?: boolean;
                    mappedBy?: string;
                    inversedBy?: string;
                } | {
                    type: string;
                    configurable?: boolean;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    component: string;
                    repeatable: boolean;
                    required?: boolean;
                    min?: number;
                    max?: number;
                } | {
                    type: string;
                    configurable?: boolean;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    components: Array<string>;
                    required?: boolean;
                    min?: number;
                    max?: number;
                } | {
                    type: string;
                    configurable?: boolean;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    targetField?: string;
                } | {
                    type: string;
                    required?: boolean;
                    unique?: boolean;
                    default?: any;
                    min?: (number | string);
                    max?: (number | string);
                    minLength?: number;
                    maxLength?: number;
                    enum?: Array<string>;
                    regex?: string;
                    private?: boolean;
                    configurable?: boolean;
                    pluginOptions?: Record<string, any>;
                })>;
                visible: boolean;
                restrictRelationsTo: (Array<string> | null);
                pluginOptions?: Record<string, any>;
                options?: Record<string, any>;
                reviewWorkflows?: boolean;
                populateCreatorFields?: boolean;
                comment?: string;
                version?: string;
            };
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content-types',
            query: {
                'kind': kind,
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
     * @param uid
     * @returns any OK
     * @throws ApiError
     */
    public static contentTypeBuilderGetContentTypesByUid(
        uid: string,
    ): CancelablePromise<{
        data: {
            uid: string;
            plugin?: string;
            apiID: string;
            schema: {
                displayName: string;
                singularName: string;
                pluralName: string;
                description: string;
                draftAndPublish: boolean;
                kind: 'collectionType' | 'singleType';
                collectionName?: string;
                attributes: Record<string, ({
                    type: string;
                    configurable?: boolean;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    multiple: boolean;
                    required?: boolean;
                    allowedTypes?: Array<string>;
                } | {
                    type: string;
                    configurable?: boolean;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    relation: string;
                    target: string;
                    targetAttribute: (string | null);
                    autoPopulate?: boolean;
                    mappedBy?: string;
                    inversedBy?: string;
                } | {
                    type: string;
                    configurable?: boolean;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    component: string;
                    repeatable: boolean;
                    required?: boolean;
                    min?: number;
                    max?: number;
                } | {
                    type: string;
                    configurable?: boolean;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    components: Array<string>;
                    required?: boolean;
                    min?: number;
                    max?: number;
                } | {
                    type: string;
                    configurable?: boolean;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    targetField?: string;
                } | {
                    type: string;
                    required?: boolean;
                    unique?: boolean;
                    default?: any;
                    min?: (number | string);
                    max?: (number | string);
                    minLength?: number;
                    maxLength?: number;
                    enum?: Array<string>;
                    regex?: string;
                    private?: boolean;
                    configurable?: boolean;
                    pluginOptions?: Record<string, any>;
                })>;
                visible: boolean;
                restrictRelationsTo: (Array<string> | null);
                pluginOptions?: Record<string, any>;
                options?: Record<string, any>;
                reviewWorkflows?: boolean;
                populateCreatorFields?: boolean;
                comment?: string;
                version?: string;
            };
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content-types/{uid}',
            path: {
                'uid': uid,
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
    public static contentTypeBuilderGetComponents(): CancelablePromise<{
        data: Array<{
            uid: string;
            category: string;
            apiId: string;
            schema: {
                displayName: string;
                description: string;
                icon?: string;
                connection?: string;
                collectionName?: string;
                attributes: Record<string, ({
                    type: string;
                    configurable?: boolean;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    multiple: boolean;
                    required?: boolean;
                    allowedTypes?: Array<string>;
                } | {
                    type: string;
                    configurable?: boolean;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    relation: string;
                    target: string;
                    targetAttribute: (string | null);
                    autoPopulate?: boolean;
                    mappedBy?: string;
                    inversedBy?: string;
                } | {
                    type: string;
                    configurable?: boolean;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    component: string;
                    repeatable: boolean;
                    required?: boolean;
                    min?: number;
                    max?: number;
                } | {
                    type: string;
                    configurable?: boolean;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    components: Array<string>;
                    required?: boolean;
                    min?: number;
                    max?: number;
                } | {
                    type: string;
                    configurable?: boolean;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    targetField?: string;
                } | {
                    type: string;
                    required?: boolean;
                    unique?: boolean;
                    default?: any;
                    min?: (number | string);
                    max?: (number | string);
                    minLength?: number;
                    maxLength?: number;
                    enum?: Array<string>;
                    regex?: string;
                    private?: boolean;
                    configurable?: boolean;
                    pluginOptions?: Record<string, any>;
                })>;
                pluginOptions?: Record<string, any>;
            };
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/components',
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
     * @param uid
     * @returns any OK
     * @throws ApiError
     */
    public static contentTypeBuilderGetComponentsByUid(
        uid: string,
    ): CancelablePromise<{
        data: {
            uid: string;
            category: string;
            apiId: string;
            schema: {
                displayName: string;
                description: string;
                icon?: string;
                connection?: string;
                collectionName?: string;
                attributes: Record<string, ({
                    type: string;
                    configurable?: boolean;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    multiple: boolean;
                    required?: boolean;
                    allowedTypes?: Array<string>;
                } | {
                    type: string;
                    configurable?: boolean;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    relation: string;
                    target: string;
                    targetAttribute: (string | null);
                    autoPopulate?: boolean;
                    mappedBy?: string;
                    inversedBy?: string;
                } | {
                    type: string;
                    configurable?: boolean;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    component: string;
                    repeatable: boolean;
                    required?: boolean;
                    min?: number;
                    max?: number;
                } | {
                    type: string;
                    configurable?: boolean;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    components: Array<string>;
                    required?: boolean;
                    min?: number;
                    max?: number;
                } | {
                    type: string;
                    configurable?: boolean;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    targetField?: string;
                } | {
                    type: string;
                    required?: boolean;
                    unique?: boolean;
                    default?: any;
                    min?: (number | string);
                    max?: (number | string);
                    minLength?: number;
                    maxLength?: number;
                    enum?: Array<string>;
                    regex?: string;
                    private?: boolean;
                    configurable?: boolean;
                    pluginOptions?: Record<string, any>;
                })>;
                pluginOptions?: Record<string, any>;
            };
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/components/{uid}',
            path: {
                'uid': uid,
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
