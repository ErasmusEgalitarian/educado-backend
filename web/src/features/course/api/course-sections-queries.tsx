import {
  courseSectionGetCourseSections,
} from "@/shared/api/sdk.gen.ts";
import type { CourseSection } from "@/shared/api/types.gen.ts";

export const courseSectionQuery = (courseId: string) => ["course-sections", courseId] as const;

/**
 * Fetch a single course by ID with Strapi query parameters
 * Used in edit mode to load existing course data
 *
 * IMPORTANT: Fetches both draft and published course
 * This allows editing courses in any state
 */
export const CourseEditorSectionApiCall = (courseId: string) => ({
  queryKey: courseSectionQuery(courseId),
  queryFn: async (): Promise<CourseSection[]> => {
    const courseSectionResponse = await courseSectionGetCourseSections({
      query: {

        // Filter for getting course by ID REMEMBER

        // Ensure drafts are retrievable during editing
        status: "draft",
        fields: [
          "title",
          "description",
        ],
        // Use "*" to populate all relations with their full data including nested fields
        populate: "activities",
      },
    });

    // CourseSectionResponse has an optional data property containing the Course
    if (!courseSectionResponse?.data) {
      throw new Error(`Course with ID ${courseId} not found`);
    }

    return courseSectionResponse.data;
  },
});
