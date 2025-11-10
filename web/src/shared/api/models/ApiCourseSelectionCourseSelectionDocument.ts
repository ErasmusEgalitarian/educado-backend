/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiCourseCourseDocument } from './ApiCourseCourseDocument';
import type { ApiExerciseExerciseDocument } from './ApiExerciseExerciseDocument';
import type { ApiLectureLectureDocument } from './ApiLectureLectureDocument';
export type ApiCourseSelectionCourseSelectionDocument = {
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

