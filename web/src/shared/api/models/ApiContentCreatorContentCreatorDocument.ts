/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiCourseCourseDocument } from './ApiCourseCourseDocument';
export type ApiContentCreatorContentCreatorDocument = {
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
    education: ApiContentCreatorContentCreatorDocument.education;
    /**
     * An enum field
     */
    statusValue: ApiContentCreatorContentCreatorDocument.statusValue;
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
export namespace ApiContentCreatorContentCreatorDocument {
    /**
     * An enum field
     */
    export enum education {
        TODO1 = 'TODO1',
        TODO2 = 'TODO2',
        TODO3 = 'TODO3',
    }
    /**
     * An enum field
     */
    export enum statusValue {
        TODO1 = 'TODO1',
        TODO2 = 'TODO2',
        TODO3 = 'TODO3',
    }
}

