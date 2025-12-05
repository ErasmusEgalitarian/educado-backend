import { 
  courseSectionDeleteCourseSectionsById, 
  courseSectionGetCourseSections, 
  courseSectionPostCourseSections, 
  courseSectionPutCourseSectionsById } from "@/shared/api/sdk.gen";
import type { CourseSection } from "@/shared/api/types.gen";
import { useMutation } from "@tanstack/react-query";

export const courseSectionQuery = (courseId: string) => ["course_section", courseId] as const;

/**
 * Fetch a course sections by course ID with Strapi query parameters
 * Used in edit mode to load existing course sections data
 *
 * IMPORTANT: Fetches both draft and published course sections
 * This allows editing course sections in any state
 */
export const CourseSectionQueryFunction = (courseId: string) => ({
  queryKey: courseSectionQuery(courseId),
  queryFn: async (): Promise<Array<CourseSection>> => {
    const courseSectionsResponse = await courseSectionGetCourseSections({
      query: {
        // The linter does not like the next line, but it is correct.
        "filters[course][documentId][$eq]": courseId,
        status: "draft",
        fields: [
            "title",
            "description",
            "createdAt",
            "publishedAt",
            "updatedAt",
        ],
        populate: ["course"],
      },
    });

    if (!courseSectionsResponse?.data) {
      throw new Error(`Course sections with ID ${courseId} not found`);
    }

    return courseSectionsResponse.data;
  },
});

interface CourseSectionPostProps extends CourseSection {
  courseId: string;
}

// Currently does not work with activities
export const CourseSectionCreateFunction = () => {
  return useMutation({ 
    mutationFn: async ({ title, description, courseId }: CourseSectionPostProps) => {
      if(courseId == undefined) return `Error: make sure to provide a course ID for this section`;
      const response = await courseSectionPostCourseSections({
        body: {
          data: {
            title: title,
            description: description,
            course: courseId,
          },
        },
      });

      return response;
    }
  });
};

export const CourseSectionSetPublish = () => {
  return useMutation ({
    mutationFn: async (section: CourseSection) => {
      if(!section.documentId) return `Error: course section ${section.documentId} is undefined`;

      return await courseSectionPutCourseSectionsById ({
        query: { status: "published" },
        path: { id: section.documentId },
        body: {
          data: {
            title: section.title,
            description: section.description,
          },
        },  
      });
    }
  });
}

// Currently does not work with activities
export const CourseSectionUpdateFunction = () => {
  return useMutation({
    mutationFn: async ({ documentId, title, description }: CourseSection) => {
      if(!documentId) return `Error: course section ${documentId} is undefined`;

      return await courseSectionPutCourseSectionsById({
        path: { id: documentId },
        body: {
          data: {
            title: title,
            description: description,
          },
        },  
      })
    }
  })
};

export const CourseSectionDeleteFunction = () => {
  return useMutation({
    mutationFn: async (courseSectionId: string) => {
      return await courseSectionDeleteCourseSectionsById({
        path: {id: courseSectionId },
      });
    }
  });
}