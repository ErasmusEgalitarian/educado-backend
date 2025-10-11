import { ApiCourseCourseDocument, CourseService } from "@/shared/api";

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
  queryFn: async (): Promise<ApiCourseCourseDocument> => {
    const response = await CourseService.courseGetCoursesById(
      courseId,
      [
        "title",
        "description",
        "difficulty",
        "numOfRatings",
        "numOfSubscriptions",
        "createdAt",
        "updatedAt",
        "publishedAt",
      ],
      ["course_categories", "image", "course_sections"],
      // Note: status parameter omitted to fetch both draft and published courses
    );
    return response.data;
  },
});
