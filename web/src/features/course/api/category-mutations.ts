import { useMutation, useQueryClient } from "@tanstack/react-query";

import { courseCategoryPostCourseCategories } from "@/shared/api/sdk.gen";

export const useCreateCategoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (categoryName: string) => {
            const response = await courseCategoryPostCourseCategories({
                body: {
                    data: {
                        name: categoryName,
                    },
                },
            });

            return response;
        },
        onSuccess: () => {
            // Invalidate course categories queries after creating a new category
            void queryClient.invalidateQueries({
                queryKey: ["course-categories"],
                exact: false,
            });
        },
    });
};
