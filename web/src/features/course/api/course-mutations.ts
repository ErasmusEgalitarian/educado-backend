import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CourseCategoryService, CourseService } from "@/shared/api";

import { courseQuery } from "./course-queries";

// Type for creating a new course
interface CourseCreateInput {
  title: string;
  difficulty: number;
  categories: string[]; // documentIds of course categories
  description?: string;
  image?: string; // documentId of uploaded image
}

// Type for updating an existing course
interface CourseUpdateInput extends Partial<CourseCreateInput> {
  documentId: string;
}

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
      const response = await CourseService.coursePostCourses(
        undefined, // fields - let backend return all fields
        ["course_categories", "image"], // populate relations
        "published", // TODO: Should be draft
        {
          data: {
            title: input.title,
            difficulty: input.difficulty,
            description: input.description,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            course_categories: input.categories,
            image: input.image,
            // Default values for Strapi fields
            numOfRatings: 0,
            numOfSubscriptions: 0,
            // IMPORTANT: Don't set publishedAt - draft has no publishedAt
            publishedAt: "",
          },
        }
      );
      // Simulate network delay for better UX during testing
      // TODO: Remove in production
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate course list queries
      // This will invalidate all queries that start with ["courses"]
      void queryClient.invalidateQueries({
        queryKey: ["courses"],
        exact: false, // This ensures all queries starting with ["courses"] are invalidated
      });
      queryClient.setQueryData(courseQuery(data.documentId), data);
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
      const { documentId, ...updateData } = input;

      const response = await CourseService.coursePutCoursesById(
        documentId,
        undefined, // fields - return all
        ["course_categories", "image"], // populate relations
        undefined, // status - preserve current status (draft or published)
        {
          data: {
            title: updateData.title,
            difficulty: updateData.difficulty,
            description: updateData.description,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            course_categories: updateData.categories,
            image: updateData.image,
          },
        }
      );
      // Simulate network delay for better UX during testing
      // TODO: Remove in production
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate the courses query and set updated course data
      // exact: false ensures all queries starting with ["courses"] are invalidated
      void queryClient.invalidateQueries({
        queryKey: ["courses"],
        exact: false,
      });
      queryClient.setQueryData(courseQuery(data.documentId), data);
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
    mutationFn: async (courseId: string) => {
      const response = await CourseService.coursePutCoursesById(
        courseId,
        undefined, // fields
        ["course_categories", "image", "course_sections"], // populate for review display
        "published", // Change status to published
        {
          data: {
            publishedAt: new Date().toISOString(),
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate all courses queries (including compound keys from usePaginatedData)
      void queryClient.invalidateQueries({
        queryKey: ["courses"],
        exact: false,
      });
      queryClient.setQueryData(courseQuery(data.documentId), data);
    },
  });
};

/**
 * Unpublish a course (change from published back to draft)
 * Used if instructor wants to make changes to a published course
 *
 * IMPORTANT: This removes publishedAt timestamp and changes status to "draft"
 * The course will no longer be visible to students
 */
export const useUnpublishCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const response = await CourseService.coursePutCoursesById(
        courseId,
        undefined, // fields
        ["course_categories", "image", "course_sections"], // populate
        "draft", // Change status back to draft
        {
          data: {
            publishedAt: "", // Clear publishedAt to unpublish
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: ["course", data.documentId],
        exact: false,
      });
      void queryClient.invalidateQueries({
        queryKey: ["courses"],
        exact: false,
      });
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
      const response = await CourseService.courseDeleteCoursesById(courseId);
      return response.data;
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

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryName: string) => {
      const response =
        await CourseCategoryService.courseCategoryPostCourseCategories(
          undefined, // fields parameter
          undefined,
          undefined,
          {
            data: {
              name: categoryName,
              publishedAt: new Date().toISOString(), // Create as draft
            },
          }
        );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all courses queries after deletion
      void queryClient.invalidateQueries({
        queryKey: ["course-categories"],
        exact: false,
      });
    },
  });
};
