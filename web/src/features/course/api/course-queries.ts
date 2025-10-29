import { useQuery } from "@tanstack/react-query";

import { getCoursesId } from "@/shared/api";

export const courseQuery = (courseId: string) => ["course", courseId] as const;

/**
 * Fetch a single course by ID
 * Used in edit mode to load existing course data
 *
 * IMPORTANT: Fetches both draft and published courses
 * This allows editing courses in any state
 */
export const CourseQueryFunction = (courseId: string) => ({
  queryKey: courseQuery(courseId),
  queryFn: async () => {
    const { data, error } = await getCoursesId({
      path: { id: Number(courseId) },
      query: {
        // Needs update: getCourseId DOES NOT use query parameter, meaning we cant fetch relations yet {course_categories, image, course_sections}
        fields: [
          "title",
          "description",
          "difficulty",
          "numOfRatings",
          "numOfSubscriptions",
          "createdAt",
          "updatedAt",
          "publishedAt",
        ],
        populate: ["course_categories", "image", "course_sections"],
      },
      // Note: status parameter omitted to fetch both draft and published courses
    });
    if (error) {
      throw new Error(`Error fetching course with ID ${courseId}`);
    }
    return data;
  },
});
