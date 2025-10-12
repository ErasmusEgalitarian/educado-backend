import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import { useEffect, useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";

import {
  ApiCourseCategoryCourseCategoryDocument,
  ApiCourseCourseDocument,
} from "@/shared/api";
import { Dropzone } from "@/shared/components/dnd/Dropzone";
import { ErrorDisplay } from "@/shared/components/error/error-display";
import FormActions from "@/shared/components/form/form-actions";
import { FormInput } from "@/shared/components/form/form-input";
import { FormMultiSelect } from "@/shared/components/form/form-multi-select";
import { FormSelect } from "@/shared/components/form/form-select";
import { FormTextarea } from "@/shared/components/form/form-textarea";
import { OverlayStatusWrapper } from "@/shared/components/overlay-status-wrapper";
import { Card, CardContent, CardFooter } from "@/shared/components/shadcn/card";
import { Form } from "@/shared/components/shadcn/form";
import usePaginatedData from "@/shared/data-display/hooks/used-paginated-data";
import { toAppError } from "@/shared/lib/error-utilities";

import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from "../api/course-mutations";

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
  title: z.string().min(1, t("validation.required")),
  difficulty: z.union([z.literal("1"), z.literal("2"), z.literal("3")]),
  categories: z
    .array(z.string())
    .min(1, t("validation.minCategories", { count: 1 }))
    .optional()
    .refine((val) => !val || val.length > 0, {
      message: t("validation.minCategories", { count: 1 }),
    }),
  description: z
    .string()
    .min(16, t("validation.minLength", { count: 16 }))
    .max(400, t("validation.maxDescription", { count: 400 }))
    .optional(),
});

// Infer the form type from the schema
type CourseBasicInfoFormValues = z.infer<typeof courseBasicInfoSchema>;

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */
const CourseEditorInformation = forwardRef<
  CourseEditorInformationRef,
  CourseEditorInformationProps
>(({ course, onComplete }, ref) => {
  const { t } = useTranslation();
  const isEditMode = course !== undefined;

  /* -------------------------------- Mutations ------------------------------- */
  const createMutation = useCreateCourseMutation();
  const updateMutation = useUpdateCourseMutation();

  const mutationLoading = createMutation.isPending || updateMutation.isPending;
  const mutationSuccess = createMutation.isSuccess || updateMutation.isSuccess;

  const mutationError = toAppError(
    createMutation.error ?? updateMutation.error
  );

  /* ------------------------------- Categories ------------------------------- */

  const {
    data,
    error: categoriesError,
    isLoading: categoriesLoading,
    refetch: refetchCategories,
  } = usePaginatedData<ApiCourseCategoryCourseCategoryDocument>({
    mode: "standalone",
    queryKey: ["course-categories"],
    urlPath: "/course-categories",
    fields: ["name"],
    config: {
      renderMode: "client",
    },
  });

  /* ------------------------------- Form setup ------------------------------- */

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

  // Set field error when categories fail to load
  useEffect(() => {
    if (categoriesError) {
      form.setError("categories", {
        type: "manual",
        message: t("categories.categoriesError"),
      });
    }
  }, [categoriesError, form, t]);

  /* -------------------------------- Handlers -------------------------------- */

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
          categories: values.categories ?? [],
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

  const handleDismissCategoriesError = () => {
    // Clear the field error
    form.clearErrors("categories");
    // Retry fetching categories
    void refetchCategories();
  };

  return (
    <>
      {/* Loading state and error states for categories are passed as props to the card. Mutations are handled inside the card, and through wrapper */}
      <Card
        errorProps={{
          actions: [
            {
              label: t("common.retry"),
              onClick: () => {
                void refetchCategories();
              },
              variant: "primary",
            },
          ],
        }}
      >
        <Form {...form}>
          <form
            onSubmit={(e) => {
              void form.handleSubmit(onSubmit)(e);
            }}
          >
            <CardContent>
              {/* The overlay replaces the content by measuring height. */}
              <OverlayStatusWrapper
                isLoading={mutationLoading}
                isSuccess={mutationSuccess}
                loadingMessage={
                  isEditMode ? t("common.updating") : t("common.creating")
                }
                successMessage={
                  isEditMode ? t("common.updated") : t("common.created")
                }
              >
                <div className="flex flex-col gap-y-5">
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
                        label={t("categories.categories")}
                        disabled={categoriesLoading || !!categoriesError}
                        isRequired={true}
                        options={data.map(
                          (
                            category: ApiCourseCategoryCourseCategoryDocument
                          ) => ({
                            label: category.name,
                            value: category.documentId,
                          })
                        )}
                        description={
                          categoriesLoading
                            ? t("categories.loadingCategoriesDescription")
                            : ""
                        }
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
                    />
                    <div className="text-right text-sm mt-1 text-greyscale-text-caption">
                      {form.watch("description")?.length ?? 0} / 400{" "}
                      {t("courseManager.characters")}
                    </div>
                  </div>

                  {/* Show mutation errors inline, so the form doesnt disappear */}
                  {mutationError && (
                    <ErrorDisplay
                      error={mutationError}
                      variant="bar"
                      actions={[
                        {
                          label: t("common.dismiss"),
                          onClick: () => {
                            createMutation.reset();
                            updateMutation.reset();
                          },
                        },
                      ]}
                    />
                  )}
                  {categoriesError && (
                    <ErrorDisplay
                      error={toAppError(categoriesError)}
                      variant="bar"
                      actions={[
                        {
                          label: `${t("common.retry")} ${t("common.loading").toLowerCase()} ${t("categories.categories").toLowerCase()}`,
                          onClick: handleDismissCategoriesError,
                        },
                      ]}
                    />
                  )}
                </div>
              </OverlayStatusWrapper>
            </CardContent>
            <CardFooter className="flex justify-end mt-4">
              {/*Create and cancel buttons*/}
              <FormActions
                formState={form.formState}
                submitLabel={
                  isEditMode
                    ? t("common.saveChanges")
                    : t("courseManager.createAndContinue")
                }
                submittingLabel={
                  isEditMode
                    ? t("common.saving") + "..."
                    : t("common.creating") + "..."
                }
                disableSubmit={mutationError !== undefined}
              />
            </CardFooter>
          </form>
        </Form>
      </Card>
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
