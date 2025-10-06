/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiCourseCourseDocument } from './ApiCourseCourseDocument';
import type { ApiFeedbackFeedbackDocument } from './ApiFeedbackFeedbackDocument';
export type ApiStudentStudentDocument = {
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

