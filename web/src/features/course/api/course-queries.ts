import { client } from "@/shared/api/client.gen";
import { courseGetCoursesById } from "@/shared/api/sdk.gen";
import type { Course } from "@/shared/api/types.gen";

export const courseQuery = (courseId: string) => ["course", courseId] as const;

/**
 * Fetch a single course by ID with Strapi query parameters
 * Used in edit mode to load existing course data
 *
 * IMPORTANT: Fetches both draft and published courses
 * This allows editing courses in any state
 */
export const CourseQueryFunction = (courseId: string) => ({
  queryKey: courseQuery(courseId),
  queryFn: async (): Promise<Course> => {
    const courseResponse = await courseGetCoursesById({
      path: { id: courseId },
      query: {
        // Ensure drafts are retrievable during editing
        fields: [
          "title",
          "description",
          "difficulty",
          "numOfRatings",
          "numOfSubscriptions",
          "createdAt",
          "updatedAt",
          "publishedAt",
          "creator_published_at",
          "admin_control_at",
        ],
        // Use "*" to populate all relations with their full data including nested fields
        populate: "course_categories",
      },
    });

    // CourseResponse has an optional data property containing the Course
    if (!courseResponse?.data) {
      throw new Error(`Course with ID ${courseId} not found`);
    }

    return courseResponse.data;
  },
});
