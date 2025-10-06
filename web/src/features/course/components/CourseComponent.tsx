import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useCourseManagingHelper } from "@/course/hooks/useCourseManagingHelper";
import {
  CourseBasicInfoFormValues,
  courseBasicInfoSchema,
} from "@/course/lib/courseValidationSchema";
import { Dropzone } from "@/shared/components/dnd/Dropzone";
import { FormInput } from "@/shared/components/form/form-input";
import { FormSelect } from "@/shared/components/form/form-select";
import { FormTextarea } from "@/shared/components/form/form-textarea";
import { Button } from "@/shared/components/shadcn/button";
import { Form } from "@/shared/components/shadcn/form";

import GenericModalComponent from "../../../shared/components/GenericModalComponent";
import { useApi } from "../../../shared/hooks/useAPI";
import CourseServices from "../../../unplaced/services/course.services";
import { useCourse, useMedia } from "../context/courseStore";
import { Course } from "../types/Course";
import categories from "../types/courseCategories";

interface CourseComponentProps {
  id: string;
  setTickChange: (tick: number) => void;
  setId: (id: string) => void;
  updateHighestTick: (tick: number) => void;
}

/**
 * This component is responsible for creating and editing courses.
 * @param id The course id
 * @param setTickChange The function to set the tick change
 * @param setId The function to set the course id
 * @param updateHighestTick The function to update the highest tick
 * @returns HTML Element
 */
export const CourseComponent = ({
  id,
  setTickChange,
}: CourseComponentProps) => {
  const { course, updateCourseField } = useCourse();
  const { getMedia, getPreviewCourseImg } = useMedia();

  // Init form with React Hook Form + Zod
  const form = useForm<CourseBasicInfoFormValues>({
    resolver: zodResolver(courseBasicInfoSchema),
    defaultValues: {
      title: course.title || "",
      difficulty: course.difficulty || 0,
      category: course.category || "",
      description: course.description || "",
    },
    mode: "onTouched",
  });
  const [categoriesOptions, setCategoriesOptions] = useState<JSX.Element[]>([]);
  const [toolTipIndex, setToolTipIndex] = useState<number>(4);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");
  const [dialogConfirm, setDialogConfirm] = useState<() => void>(
    async () => {}
  );
  const [cancelBtnText] = useState("Cancelar");
  const [confirmBtnText] = useState("Confirmar");
  const [dialogTitle, setDialogTitle] = useState("Cancelar alterações");

  const courseImg = getMedia(id);
  const previewCourseImg = getPreviewCourseImg();

  const {
    handleDialogEvent,
    handleCourseImageUpload,
    handleSaveAsDraft,
    courseMissingRequiredFields,
  } = useCourseManagingHelper();

  // Callbacks

  const existingCourse = id !== "0";
  const submitCall = existingCourse
    ? CourseServices.updateCourse
    : CourseServices.createCourse;
  const { call: submitCourse, isLoading: submitLoading } = useApi(submitCall);

  const { isMissingRequiredFields } = courseMissingRequiredFields();
  const navigate = useNavigate();

  useEffect(() => {
    //TODO: get categories from db
    const inputArray = [
      "personal finance",
      "health and workplace safety",
      "sewing",
      "electronics",
    ];
    setCategoriesOptions(
      inputArray.map((categoryENG: string, key: number) => (
        <option value={categoryENG} key={key}>
          {categories[inputArray[key]]?.br}
        </option>
      ))
    );
  }, []);

  // Sync form changes to context
  useEffect(() => {
    const subscription = form.watch((formData) => {
      if (formData.title) updateCourseField({ title: formData.title });
      if (formData.difficulty)
        updateCourseField({ difficulty: formData.difficulty as 0 | 1 | 2 | 3 });
      if (formData.category)
        updateCourseField({
          category: formData.category as
            | ""
            | "personal finance"
            | "health and workplace safety"
            | "sewing"
            | "electronics",
        });
      if (formData.description)
        updateCourseField({ description: formData.description });
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [form, updateCourseField]);

  //Used to format PARTIAL course data, meaning that it can be used to update the course data gradually
  const handleFieldChange = (
    field: keyof Course,
    value: string | number | File | null
  ) => {
    updateCourseField({ [field]: value });
  };

  const handleImageUpload = (file: File | null) => {
    handleCourseImageUpload(file, courseImg, id);
  };

  const handleSubmitCourse = async () => {
    await handleSaveAsDraft(submitCourse);
  };

  const handleSave = () => {
    handleDialogEvent(
      "Você tem certeza de que quer salvar como rascunho as alterações feitas?",
      handleSubmitCourse,
      "Salvar como rascunho ",
      setDialogTitle,
      setDialogMessage,
      setDialogConfirm,
      setShowDialog
    );
  };

  const navigateToSections = () => {
    setTickChange(1);
    navigate(`/courses/manager/${id}/1`);
  };

  return (
    <Form {...form}>
      <div>
        <GenericModalComponent
          title={dialogTitle}
          contentText={dialogMessage}
          cancelBtnText={cancelBtnText}
          confirmBtnText={confirmBtnText}
          isVisible={showDialog}
          width="w-[500px]"
          onConfirm={dialogConfirm}
          onClose={() => {
            setShowDialog(false);
          }}
          loading={submitLoading}
        />
        <div className="w-full flex flex-row items-center justify-between py-5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold mt-10"> Informações gerais </h1>
          </div>
        </div>

        <div className="flex h-full flex-col justify-between space-y-4">
          <div className="w-full float-right bg-white rounded-2xl shadow-lg justify-between space-y-6 p-6">
            <FormInput
              control={form.control}
              fieldName="title"
              inputSize="md"
              label="Nome do curso"
              placeholder="Nome do curso"
              type="text"
              isRequired
            />

            <div className="flex items-center gap-8 w-full">
              {/*Field to select a level from a list of options*/}
              <div className="flex flex-col w-1/2 space-y-2 text-left ">
                <FormSelect
                  control={form.control}
                  inputSize="md"
                  isRequired
                  fieldName="difficulty"
                  label="Nível"
                  placeholder="Selecione o nível"
                  options={[
                    { label: "Iniciante", value: "1" },
                    { label: "Intermediário", value: "2" },
                    { label: "Avançado", value: "3" },
                  ]}
                />
              </div>

              {/*Field to choose a category from a list of options*/}
              <div className="flex flex-col w-1/2 space-y-2 text-left  ">
                <FormSelect
                  control={form.control}
                  isRequired
                  inputSize="md"
                  fieldName="category"
                  label="Categoria"
                  placeholder="Selecione a categoria"
                  options={categoriesOptions.map((option) => ({
                    label: option.props.children,
                    value: option.props.value,
                  }))}
                />
              </div>
            </div>

            {/*Field to input the description of the course*/}
            <div>
              <FormTextarea
                control={form.control}
                fieldName="description"
                inputSize="sm"
                label="Descrição"
                placeholder="Conte mais sobre o curso"
                maxLength={400}
                rows={4}
                isRequired
                className="resize-none"
              />
              <div className="text-right text-sm mt-1 text-greyscale-text-caption">
                {form.watch("description")?.length || 0} / 400 caracteres
              </div>
            </div>

            <div>
              {/*Cover image field*/}
              <div className="flex flex-col space-y-2 text-left">
                <label htmlFor="cover-image">
                  Imagem de capa <span className="text-red-500">*</span>
                </label>{" "}
                {/** Cover image */}
              </div>
              <Dropzone
                inputType="image"
                id={id ?? "0"}
                previewFile={previewCourseImg}
                onFileChange={handleImageUpload}
                maxSize={5 * 1024 * 1024 /* 5mb */}
              />
            </div>
          </div>
          {/*Create and cancel buttons*/}
          <div className="modal-action pb-10">
            <div className="whitespace-nowrap flex items-center justify-between w-full mt-8">
              <label
                onClick={() => {
                  navigate("/courses");
                }}
                htmlFor="course-create"
                className="cursor-pointer underline text-error-surface-default py-2 pr-4 bg-transparent hover:bg-warning-100 text-warning w-full transition ease-in duration-200 text-lg font-semibold focus:outline-hidden focus:ring-2 focus:ring-offset-2  rounded-sm"
              >
                Cancelar e Voltar {/** Cancel */}
              </label>

              <label
                htmlFor="course-create"
                className={`${
                  course.status === "published"
                    ? "invisible pointer-events-none"
                    : ""
                } whitespace-nowrap ml-42 underline py-2 bg-transparent hover:bg-primary-100 text-primary-text-label w-full transition ease-in duration-200 text-center text-lg font-semibold focus:outline-hidden focus:ring-2 focus:ring-offset-2 rounded ${isMissingRequiredFields ? "opacity-70" : ""}`}
              >
                <button
                  id="SaveAsDraft"
                  onClick={handleSave}
                  disabled={isMissingRequiredFields}
                  className="underline"
                >
                  Salvar como Rascunho {/** Save as draft */}
                </button>
              </label>
              <Button
                onClick={navigateToSections}
                disabled={isMissingRequiredFields}
                id="addCourse"
                className="font-bold px-6"
              >
                Criar Seções
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};
