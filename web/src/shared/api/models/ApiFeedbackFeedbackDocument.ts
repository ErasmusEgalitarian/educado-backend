/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiCourseCourseDocument } from './ApiCourseCourseDocument';
import type { ApiStudentStudentDocument } from './ApiStudentStudentDocument';
export type ApiFeedbackFeedbackDocument = {
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

