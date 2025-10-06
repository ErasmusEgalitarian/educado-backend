/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiExerciseExerciseDocument } from './ApiExerciseExerciseDocument';
export type ApiExerciseOptionExerciseOptionDocument = {
    /**
     * The document ID, represented by a UUID
     */
    documentId: string;
    id: number;
    /**
     * A string field
     */
    text: string;
    /**
     * A text field
     */
    explanation: string;
    /**
     * A boolean field
     */
    isCorrect: boolean;
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
    exercise?: ApiExerciseExerciseDocument;
};

