import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";

import {
  ApiCourseCategoryCourseCategoryDocument,
  ApiCourseCourseDocument,
} from "@/shared/api";
import { Dropzone } from "@/shared/components/dnd/Dropzone";
import FormActions from "@/shared/components/form/form-actions";
import { FormInput } from "@/shared/components/form/form-input";
import { FormMultiSelect } from "@/shared/components/form/form-multi-select";
import { FormSelect } from "@/shared/components/form/form-select";
import { FormTextarea } from "@/shared/components/form/form-textarea";
import { OverlayStatusWrapper } from "@/shared/components/overlay-status-wrapper";
import { Button } from "@/shared/components/shadcn/button";
import { Form } from "@/shared/components/shadcn/form";
import usePaginatedData from "@/shared/data-display/hooks/used-paginated-data";

import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from "../api/course-mutations";
import { t } from "i18next";

/* ------------------------------- Interfaces ------------------------------- */
interface CourseEditorInformationProps {
  course?: ApiCourseCourseDocument;
  onComplete?: (courseId: string) => void;
}

export interface CourseEditorInformationRef {
  isDirty: () => boolean;
}

/* --------------------------------- Schema --------------------------------- */
const courseBasicInfoSchema = z.object({
  title: z.string().min(1, t("validation.title")),
  difficulty: z.union([z.literal("1"), z.literal("2"), z.literal("3")]),
  categories: z
    .array(z.string())
    .min(1, t("validation.minCategories", { count: 1 })),
  description: z
    .string()
    .max(400, t("validation.maxDescription", { count: 400 }))
    .optional(),
});

// Infer the form type from the schema
type CourseBasicInfoFormValues = z.infer<typeof courseBasicInfoSchema>;

/* -------------------------------- Component ------------------------------- */
const CourseEditorInformation = forwardRef<
  CourseEditorInformationRef,
  CourseEditorInformationProps
>(({ course, onComplete }, ref) => {
  const { t } = useTranslation();
  const isEditMode = course !== undefined;

  // Mutations
  const createMutation = useCreateCourseMutation();
  const updateMutation = useUpdateCourseMutation();

  const mutationLoading = createMutation.isPending || updateMutation.isPending;
  const mutationSuccess = createMutation.isSuccess || updateMutation.isSuccess;

  const mutationError = createMutation.error ?? updateMutation.error;

  // Fetch course categories for the multi-select
  const {
    data,
    error,
    isLoading: categoriesLoading,
  } = usePaginatedData<ApiCourseCategoryCourseCategoryDocument>({
    mode: "standalone",
    queryKey: ["course-categories"],
    urlPath: "/course-categories",
    fields: ["name"],
    config: {
      renderMode: "client",
    },
  });

  // Determine default form values based on whether we are editing or creating
  // If editing, populate with existing course data
  // If creating, use empty/default values
  const defaultFormValue = course
    ? {
        title: course.title,
        difficulty: String(course.difficulty) as "1" | "2" | "3",
        categories: course.course_categories?.map(
          (cat: ApiCourseCategoryCourseCategoryDocument) => cat.documentId
        ),
        description: course.description,
      }
    : {
        title: "",
        difficulty: undefined as "1" | "2" | "3" | undefined,
        categories: undefined,
        description: "",
      };

  // Init form with React Hook Form + Zod
  const form = useForm<CourseBasicInfoFormValues>({
    resolver: zodResolver(courseBasicInfoSchema),
    defaultValues: { ...defaultFormValue },
    mode: "onTouched",
  });

  // Expose isDirty method to parent via ref
  useImperativeHandle(ref, () => ({
    isDirty: () => form.formState.isDirty,
  }));

  // Reset form when course data changes (e.g., when navigating back to this step)
  useEffect(() => {
    if (course) {
      form.reset({
        title: course.title,
        difficulty: String(course.difficulty) as "1" | "2" | "3",
        categories: course.course_categories?.map(
          (cat: ApiCourseCategoryCourseCategoryDocument) => cat.documentId
        ),
        description: course.description,
      });
    }
  }, [course, form]);

  const onSubmit = async (values: CourseBasicInfoFormValues) => {
    try {
      // Edit = update mutation
      if (isEditMode && course.documentId != "") {
        // Update existing course
        const result = await updateMutation.mutateAsync({
          documentId: course.documentId,
          title: values.title,
          difficulty: Number(values.difficulty),
          categories: values.categories,
          description: values.description,
        });

        // Wait a moment to show success state, then complete step
        setTimeout(() => {
          onComplete?.(result.documentId);
        }, 1500);
      } else {
        // Create = create mutation
        const result = await createMutation.mutateAsync({
          title: values.title,
          difficulty: Number(values.difficulty),
          categories: values.categories,
          description: values.description,
        });

        // Wait a moment to show success state, then complete step
        setTimeout(() => {
          onComplete?.(result.documentId);
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving course:", error);
      // Error handling is managed by react-query
    }
  };

  return (
    <>
      <OverlayStatusWrapper
        isLoading={mutationLoading}
        isSuccess={mutationSuccess}
        loadingMessage={
          isEditMode ? t("common.updating") : t("common.creating")
        }
        successMessage={isEditMode ? t("common.updated") : t("common.created")}
      >
        <Form {...form}>
          <form
            onSubmit={(e) => {
              void form.handleSubmit(onSubmit)(e);
            }}
          >
            <div className="flex flex-col gap-y-5 mt-5 rounded-xl p-6 shadow-lg">
              <FormInput
                control={form.control}
                fieldName="title"
                inputSize="md"
                label={t("courseManager.courseName")}
                placeholder={t("courseManager.courseNamePlaceholder")}
                type="text"
                isRequired
              />

              <div className="flex items-start gap-8 w-full">
                {/*Field to select a level from a list of options*/}
                <div className="flex flex-col w-1/2 space-y-2 text-left ">
                  <FormSelect
                    control={form.control}
                    inputSize="md"
                    isRequired
                    fieldName="difficulty"
                    label={t("courseManager.level")}
                    placeholder={t("courseManager.selectLevel")}
                    options={[
                      { label: "Iniciante", value: "1" },
                      { label: "Intermediário", value: "2" },
                      { label: "Avançado", value: "3" },
                    ]}
                  />
                </div>

                {/*Field to choose a category from a list of options*/}
                <div className="flex flex-col w-1/2 space-y-2 text-left">
                  <FormMultiSelect
                    control={form.control}
                    fieldName="categories"
                    label={t("courseManager.categories")}
                    disabled={categoriesLoading || !!error}
                    options={data.map(
                      (category: ApiCourseCategoryCourseCategoryDocument) => ({
                        label: category.name,
                        value: category.documentId,
                      })
                    )}
                  />
                </div>
              </div>

              {/*Field to input the description of the course*/}
              <div>
                <FormTextarea
                  control={form.control}
                  fieldName="description"
                  inputSize="sm"
                  label={t("courseManager.description")}
                  placeholder={t("courseManager.descriptionPlaceholder")}
                  maxLength={400}
                  rows={4}
                  isRequired
                  className="resize-none"
                />
                <div className="text-right text-sm mt-1 text-greyscale-text-caption">
                  {form.watch("description")?.length ?? 0} / 400{" "}
                  {t("courseManager.characters")}
                </div>
              </div>

              {/* Error Display */}
              {mutationError && (
                <div className="rounded-lg bg-error-surface-default/10 border border-error-surface-default p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-error-surface-default mb-1">
                        {isEditMode
                          ? t("courseManager.updateError")
                          : t("courseManager.createError")}
                      </p>
                      <p className="text-sm text-greyscale-text-body">
                        {mutationError.message.length > 0
                          ? mutationError.message
                          : t("courseManager.genericError")}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        createMutation.reset();
                        updateMutation.reset();
                      }}
                      className="text-error-surface-default hover:text-error-surface-default/80"
                    >
                      {t("common.dismiss")}
                    </Button>
                  </div>
                </div>
              )}

              {/*Create and cancel buttons*/}
              <div className="flex justify-end">
                <FormActions
                  formState={form.formState}
                  submitLabel={
                    isEditMode
                      ? t("common.saveChanges")
                      : t("courseManager.createAndContinue")
                  }
                  disableSubmit={!!mutationError}
                />
              </div>
            </div>
          </form>
        </Form>
      </OverlayStatusWrapper>
      <DevTool control={form.control} />
    </>
  );
});

CourseEditorInformation.displayName = "CourseEditorInformation";

// Temporarily removed because it prevents submission and is not yet functional
const UploadComponent = () => {
  return (
    <div>
      {/*Cover image field*/}
      <div className="flex flex-col space-y-2 text-left">
        <label htmlFor="cover-image">
          {t("courseManager.coverImage")}{" "}
          <span className="text-red-500">*</span>
        </label>
        {/** Cover image */}
      </div>
      <Dropzone
        inputType="image"
        id="0"
        previewFile={null}
        onFileChange={() => {}}
        maxSize={5 * 1024 * 1024 /* 5mb */}
      />
    </div>
  );
};

export default CourseEditorInformation;
