import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import { useEffect, useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";

import { FormFileUpload } from "@/shared/components/form/form-file-upload";

import type { Course, CourseCategory } from "@/shared/api/types.gen";
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
import { useFileUpload } from "@/shared/hooks/use-file-upload";
import { toAppError } from "@/shared/lib/error-utilities";

import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from "../api/course-mutations";
import { FileWithMetadataSchema } from "@/shared/components/file-upload";

/* ------------------------------- Interfaces ------------------------------- */
interface CourseEditorInformationProps {
  course?: Course;
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
  image: z.array(FileWithMetadataSchema).optional(),
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
  } = usePaginatedData<CourseCategory>({
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

  const defaultFormValue =
    course === undefined
      ? {
          title: "",
          difficulty: "1" as "1" | "2" | "3" | undefined,
          categories: [],
          description: "",
        }
      : {
          title: course.title,
          difficulty: String(course.difficulty) as "1" | "2" | "3",
          categories: course.course_categories
            ?.map((cat) => cat.documentId)
            .filter((id): id is string => id !== undefined),
          description: course.description,
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
        categories: course.course_categories
          ?.map((cat) => cat.documentId)
          .filter((id): id is string => id !== undefined),
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
      // Upload image if provided and take first id
      const imageIds =
        values.image && values.image.length > 0
          ? await uploadFile(values.image)
          : undefined;
      const imageId = imageIds?.[0];

      // Edit = update mutation
      if (
        isEditMode &&
        course?.documentId != null &&
        course.documentId !== ""
      ) {
        // Update existing course
        const result = await updateMutation.mutateAsync({
          documentId: course.documentId,
          title: values.title,
          difficulty: Number(values.difficulty),
          // eslint-disable-next-line @typescript-eslint/naming-convention
          course_categories: values.categories,
          description: values.description,
        });

        // Wait a moment to show success state, then complete step
        setTimeout(() => {
          onComplete?.(result?.data?.documentId ?? "");
        }, 1500);
      } else {
        // Create = create mutation
        const result = await createMutation.mutateAsync({
          title: values.title,
          difficulty: Number(values.difficulty),
          // eslint-disable-next-line @typescript-eslint/naming-convention
          course_categories: values.categories ?? [],
          description: values.description,
        });

        // Wait a moment to show success state, then complete step
        setTimeout(() => {
          onComplete?.(result?.data?.documentId ?? "");
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

  /* -------------------------------- Multiselect -------------------------------- */
  const multiInputRef = useRef<MultiSelectRef>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCategoryCreated = (data: CourseCategory) => {
    const newOption: MultiSelectOption = {
      label: data.name,
      value: data.documentId ?? "",
    };

    if (!multiInputRef.current) {
      console.error(
        "multiInputRef is null - ref may not be properly forwarded"
      );
      return;
    }
    // Ensure we refresh the categories list so options remain in sync with the server,
    // then select the new option. Keep this async work inside an IIFE to satisfy the
    // onCreated: () => void contract and ESLint no-misused-promises.
    void (async () => {
      await refetchCategories();
      const ref = multiInputRef.current;
      if (!ref) return;
      const current = ref.getSelectedValues();
      if (!current.includes(newOption.value)) {
        ref.setSelectedValues([...current, newOption.value]);
      }
    })();
    setIsModalOpen(false);
  };

  if (categoriesError) {
    form.setFocus("categories");
  }

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
                      {(() => {
                        let placeholder = t("categories.selectCategory");
                        if (categoriesLoading) {
                          placeholder = t("common.loading") + "...";
                        } else if (categoriesError) {
                          placeholder = t("common.error");
                        }
                        return (
                          <FormMultiSelect
                            ref={multiInputRef}
                            fieldName="categories"
                            control={form.control}
                            label={t("categories.categories")}
                            placeholder={placeholder}
                            options={data.map((category) => ({
                              label: category.name,
                              value: category.documentId ?? "",
                            }))}
                            onCreateClick={() => {
                              setIsModalOpen(true);
                            }}
                            createLabel={t("multiSelect.createCategory")}
                          />
                        );
                      })()}
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

                  <FormFileUpload
                    uploadType="image"
                    control={form.control}
                    name="image"
                    maxFiles={1}
                  />

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

export default CourseEditorInformation;
