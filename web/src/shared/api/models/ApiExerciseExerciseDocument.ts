/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiExerciseOptionExerciseOptionDocument } from './ApiExerciseOptionExerciseOptionDocument';
export type ApiExerciseExerciseDocument = {
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
     * A string field
     */
    question: string;
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
    exercise_options?: Array<ApiExerciseOptionExerciseOptionDocument>;
};

