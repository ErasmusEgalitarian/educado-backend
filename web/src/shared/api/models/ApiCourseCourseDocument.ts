/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiContentCreatorContentCreatorDocument } from './ApiContentCreatorContentCreatorDocument';
import type { ApiCourseCategoryCourseCategoryDocument } from './ApiCourseCategoryCourseCategoryDocument';
import type { ApiCourseSelectionCourseSelectionDocument } from './ApiCourseSelectionCourseSelectionDocument';
import type { ApiFeedbackFeedbackDocument } from './ApiFeedbackFeedbackDocument';
import type { ApiStudentStudentDocument } from './ApiStudentStudentDocument';
import type { PluginUploadFileDocument } from './PluginUploadFileDocument';
export type ApiCourseCourseDocument = {
    estimatedHours: null;
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

