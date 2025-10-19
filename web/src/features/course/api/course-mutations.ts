/* eslint-disable @typescript-eslint/naming-convention */
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  courseDeleteCoursesById,
  coursePostCourses,
  coursePutCoursesById,
} from "@/shared/api/sdk.gen";
import type { CourseRequest } from "@/shared/api/types.gen";

import { courseQuery } from "./course-queries";

/* ---------------------------------- Types --------------------------------- */

// Input type for creating a course - use the generated CourseRequest data shape
type CourseCreateInput = CourseRequest["data"];

// Input type for updating a course - use Partial of the data shape + documentId
type CourseUpdateInput = Partial<CourseRequest["data"]> & {
  documentId: string;
  // Required fields for update
  title: string;
  difficulty: number;
  categories: string[]; // documentIds of course categories
  description?: string;
  image?: number; // numeric media id
}

/* -------------------------------- Mutations ------------------------------- */

/**
 * Create a new course as DRAFT
 * Returns the created course with its documentId
 *
 * IMPORTANT: Course is created as DRAFT - it won't be visible to students
 * until published in the review step
 */
export const useCreateCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CourseCreateInput) => {
      const response = await coursePostCourses({
        query: {
          status: "draft",
        },
        body: {
          data: {
            title: input.title,
            difficulty: input.difficulty,
            description: input.description,
            course_categories: input.course_categories,
            image: input.image,
            // Default values for Strapi fields
            numOfRatings: 0,
            numOfSubscriptions: 0,
            // IMPORTANT: Don't set publishedAt - draft has no publishedAt
          },
        },
      });

      return response;
    },
    onSuccess: (data) => {
      // Invalidate course list queries
      // This will invalidate all queries that start with ["courses"]
      void queryClient.invalidateQueries({
        queryKey: ["courses"],
        exact: false, // This ensures all queries starting with ["courses"] are invalidated
      });
      const courseId = data?.data?.documentId;

      if (courseId != null) {
        queryClient.setQueryData(courseQuery(courseId), data?.data);
      }
    },
  });
};

/**
 * Update an existing course (draft or published)
 * Used to modify course information
 *
 * IMPORTANT: Preserves the current draft/published status
 * Use publishCourseMutation to change from draft to published
 */
export const useUpdateCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CourseUpdateInput) => {
      const response = await coursePutCoursesById({
        path: { id: input.documentId },
        body: {
          data: {
            title: input.title,
            difficulty: input.difficulty,
            description: input.description,
            course_categories: input.course_categories,
            image: input.image,
          },
        },
      });

      return response;
    },
    onSuccess: (data) => {
      // Invalidate the courses query and set updated course data
      // exact: false ensures all queries starting with ["courses"] are invalidated
      void queryClient.invalidateQueries({
        queryKey: ["courses"],
        exact: false,
      });

      const courseId = data?.data?.documentId;

      if (courseId != null) {
        queryClient.setQueryData(courseQuery(courseId), data?.data);
      }
    },
  });
};

/**
 * Publish a course (change from draft to published)
 * Used in the review step to make the course visible to students
 *
 * IMPORTANT: This sets publishedAt timestamp and changes status to "published"
 * Once published, the course will be visible in the course catalog
 */
export const usePublishCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CourseUpdateInput) => {
      const { documentId, ...dataWithoutId } = input;
      const response = await coursePutCoursesById({
        path: { id: documentId },
        query: { status: "published" },
        body: {
          // Do not send documentId in body; Strapi expects ID only in path
          data: { ...dataWithoutId },
        },
      });

      return response;
    },
    onSuccess: (data) => {
      // Invalidate the courses query and set updated course data
      // exact: false ensures all queries starting with ["courses"] are invalidated
      void queryClient.invalidateQueries({
        queryKey: ["courses"],
        exact: false,
      });

      const courseId = data?.data?.documentId;

      if (courseId != null) {
        queryClient.setQueryData(courseQuery(courseId), data?.data);
      }
    },
  });
};

/**
 * Delete a draft course
 * Useful if user wants to cancel course creation
 */
export const useDeleteCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const response = await courseDeleteCoursesById({
        path: { id: courseId },
      });

      return response;
    },
    onSuccess: () => {
      // Invalidate all courses queries after deletion
      void queryClient.invalidateQueries({
        queryKey: ["courses"],
        exact: false,
      });
    },
  });
};
