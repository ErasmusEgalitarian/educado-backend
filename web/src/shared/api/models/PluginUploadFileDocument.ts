/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PluginUploadFileDocument = {
    /**
     * The document ID, represented by a UUID
     */
    documentId: string;
    id: number;
    /**
     * A string field
     */
    name: string;
    /**
     * A string field
     */
    alternativeText?: string;
    /**
     * A string field
     */
    caption?: string;
    /**
     * An integer field
     */
    width?: number;
    /**
     * An integer field
     */
    height?: number;
    /**
     * A JSON field
     */
    formats?: any;
    /**
     * A string field
     */
    hash: string;
    /**
     * A string field
     */
    ext?: string;
    /**
     * A string field
     */
    mime: string;
    /**
     * A decimal field
     */
    size: number;
    /**
     * A string field
     */
    url: string;
    /**
     * A string field
     */
    previewUrl?: string;
    /**
     * A string field
     */
    provider: string;
    /**
     * A JSON field
     */
    provider_metadata?: any;
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
    related: any;
};

