/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
export type ApiCourseCourseDocument = {
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
     * An enum field
     */
    level: ApiCourseCourseDocument.level;
    /**
     * A blocks field
     */
    description: any[];
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
    course_categories?: string[];

};

export namespace ApiCourseCourseDocument {
    /**
     * An enum field
     */
    export enum level {
        BEGINNER = 'Beginner',
        INTERMEDIATE = 'Intermediate',
        ADVANCED = 'Advanced',
    }
}
