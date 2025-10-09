import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
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
import { Form } from "@/shared/components/shadcn/form";
import usePaginatedData from "@/shared/data-display/hooks/used-paginated-data";

interface CourseEditorInformationProps {
  course?: ApiCourseCourseDocument;
}

const courseBasicInfoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  difficulty: z.union([z.literal("1"), z.literal("2"), z.literal("3")]),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  description: z
    .string()
    .max(400, "Description must be 400 characters or less")
    .optional(),
});

// Infer the form type from the schema
type CourseBasicInfoFormValues = z.infer<typeof courseBasicInfoSchema>;

const CourseEditorInformation = ({ course }: CourseEditorInformationProps) => {
  const { t } = useTranslation();

  const { data, error, isLoading } =
    usePaginatedData<ApiCourseCategoryCourseCategoryDocument>({
      mode: "standalone",
      queryKey: ["course-categories"],
      urlPath: "/course-categories",
      fields: ["name"],
      config: {
        renderMode: "client",
      },
    });

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

  return (
    <>
      <Form {...form}>
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
                disabled={isLoading || !!error}
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

          {/*Create and cancel buttons*/}
          <div className="modal-action pb-10">
            <div className="whitespace-nowrap flex items-center justify-between w-full mt-8">
              <Link
                to="/courses"
                className="cursor-pointer underline text-error-surface-default py-2 pr-4 bg-transparent hover:bg-warning-100 text-warning transition ease-in duration-200 text-lg font-semibold focus:outline-hidden focus:ring-2 focus:ring-offset-2  rounded-sm"
              >
                {t("courseManager.cancelAndReturn")}
              </Link>
              <FormActions
                formState={form.formState}
                submitLabel={t("courseManager.createSections")}
              />
            </div>
          </div>
        </div>
      </Form>
      <DevTool control={form.control} />
    </>
  );
};

export default CourseEditorInformation;
