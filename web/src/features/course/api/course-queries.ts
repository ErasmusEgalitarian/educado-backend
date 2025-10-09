import { ApiCourseCourseDocument, CourseService } from "@/shared/api";

export const courseQuery = (courseId: string) => ["course", courseId] as const;

export const CourseQueryFunction = (courseId: string) => ({
    queryKey: courseQuery(courseId),
    queryFn: async (): Promise<ApiCourseCourseDocument> => {
        const response = await CourseService.courseGetCoursesById(
            courseId,
            ['title', 'description', 'difficulty', 'numOfRatings', 'numOfSubscriptions', 'createdAt', 'updatedAt', 'publishedAt'],
            ['course_categories', 'image'],
            undefined, // filters
            undefined, // sort
            'published' // status
        );
        return response.data;
    },
});