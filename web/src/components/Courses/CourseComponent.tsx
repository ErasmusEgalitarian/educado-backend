import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCourse, useMedia } from '../../contexts/courseStore';
// Services
import CourseServices from "../../services/course.services";
import {useApi} from "../../hooks/useAPI";
  // Helperss
import categories from "../../helpers/courseCategories";



// Components
import { Dropzone } from "../Dropzone/Dropzone";
import { ToolTipIcon } from "../ToolTip/ToolTipIcon";
import GenericModalComponent from "../GenericModalComponent";
// Interface
import { Course} from "../../interfaces/Course";
import CourseGuideButton from "./GuideToCreatingCourse";

import { useCourseManagingHelper } from "@hooks/useCourseManagingHelper";

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

export const CourseComponent = ({ id, setTickChange}: CourseComponentProps) => {
  const {course, updateCourseField} = useCourse();
  const { getMedia, getPreviewCourseImg } = useMedia();
  const [categoriesOptions, setCategoriesOptions] = useState<JSX.Element[]>([]);
  const [toolTipIndex, setToolTipIndex] = useState<number>(4);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");
  const [dialogConfirm, setDialogConfirm] = useState<() => void>(async () => {});
  const [cancelBtnText] = useState("Cancelar");
  const [confirmBtnText] = useState("Confirmar");
  const [dialogTitle, setDialogTitle] = useState("Cancelar alterações");
  
  const courseImg = getMedia(id);
  const previewCourseImg = getPreviewCourseImg();

  const { handleDialogEvent, handleCourseImageUpload, handleSaveAsDraft, courseMissingRequiredFields } = useCourseManagingHelper();

  // Callbacks
  
  const existingCourse = id !== "0";
  const submitCall = existingCourse ? CourseServices.updateCourse : CourseServices.createCourse;
  const { call: submitCourse, isLoading: submitLoading} = useApi(submitCall);

  const {errors, isMissingRequiredFields} = courseMissingRequiredFields()

  const charCount = course?.description?.length ?? 0;
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


  //Used to format PARTIAL course data, meaning that it can be used to update the course data gradually
  const handleFieldChange = (field: keyof Course, value: string | number | File | null) => {
    updateCourseField({[field]: value});
  };

  const handleImageUpload = (file: File | null) => {
    handleCourseImageUpload(file, courseImg, id);
  }

  const handleSubmitCourse = async () => {
    await handleSaveAsDraft(submitCourse);
  }

  const handleSave = () => {
    handleDialogEvent(
      "Você tem certeza de que quer salvar como rascunho as alterações feitas?",
      handleSubmitCourse,
      "Salvar como rascunho ", 
      setDialogTitle,
      setDialogMessage,
      setDialogConfirm,
      setShowDialog,
    );
  };

  const navigateToSections = () => { 
    setTickChange(1);
    navigate(`/courses/manager/${id}/1`);
  }

  return (
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
        loading = {submitLoading}
      />
      <div className="w-full flex flex-row items-center justify-between py-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold"> Informações gerais </h1>
          <ToolTipIcon
          alignLeftTop={false}
          index={0}
            toolTipIndex={toolTipIndex}
            text={
              "👩🏻‍🏫Nossos cursos são separados em seções e você pode adicionar quantas quiser!"
            }
            tooltipAmount={2}
            callBack={setToolTipIndex}
          />
        </div>
        <CourseGuideButton />
      </div>

    
      <div className="flex h-full flex-col justify-between space-y-4"> 
        <div className="w-full float-right bg-white rounded-2xl shadow-lg justify-between space-y-4 p-6">
          <div className="flex flex-col space-y-2 text-left">
            <label htmlFor="title">Nome do curso <span className="text-red-500">*</span></label> {/*Title*/}
            <input
              id="title-field"
              type="text"
              placeholder={"Nome do curso"}
              defaultValue={course.title}
              className="form-field  bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-lg"
              onChange={(e) => handleFieldChange('title', e.target.value)}
            />
            {errors.title && (
              <span className="text-warning">Este campo é obrigatório</span>
            )}{" "}
            {/** This field is required */}
          </div>

          <div className="flex items-center gap-8 w-full mt-8">
            {/*Field to select a level from a list of options*/}
            <div className="flex flex-col w-1/2 space-y-2 text-left  ">
            <label htmlFor='level'> Nível <span className="text-red-500">*</span></label> {/*asteric should not be hard coded*/}
              <select id="difficulty-field" 
              defaultValue={course.difficulty}
              className="bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-lg"
              onChange={(e) => handleFieldChange('difficulty', parseInt(e.target.value))}
              >
                {/*Hard coded options by PO, should be changed to get from db*/}
                <option value=""disabled> Selecione o nível</option>
                <option value={1}>Iniciante</option> {/** Beginner */}
                <option value={2}>Intermediário</option> {/** Intermediate */}
                <option value={3}>Avançado</option> {/** Advanced */}
              </select>
              <span className='text-warning min-h-[24px]'>{errors.difficulty ? 'Este campo é obrigatório': ''}</span>
            </div>

            {/*Field to choose a category from a list of options*/}
            <div className="flex flex-col w-1/2 space-y-2 text-left  ">
              <label htmlFor='category'>Categoria <span className="text-red-500">*</span></label> 
              <select id="category-field"
                defaultValue={course.category}
                className="bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-lg"
                onChange={(e) => handleFieldChange('category', e.target.value)}
              >
                {/*Hard coded options by PO, should be changed to get from db*/}
                <option value="" disabled> Selecione a categoria</option>,
                {categoriesOptions}

              </select>
              <span className='text-warning min-h-[24px]'>{errors.category ? 'Este campo é obrigatório': "               "}</span>
            </div>
          </div>

          {/*Field to input the description of the course*/}
          <div className="flex flex-col space-y-2 ">
            <div className="flex items-center space-x-2"> {/* Container for label and icon */}
              <label className='text-left' htmlFor='description'>Descrição <span className="text-red-500">*</span> </label> {/** Description */} 
              <ToolTipIcon alignLeftTop={false} index={1} toolTipIndex={toolTipIndex} text={"😉 Dica: insira uma descrição que desperte a curiosidade e o interesse dos alunos"} tooltipAmount={2} callBack={setToolTipIndex}/>
            </div>
            <textarea id="description-field" maxLength={400} rows={4}
            placeholder={"Conte mais sobre o curso"}
            defaultValue={course.description}
            className="resize-none form-field border-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-secondary rounded-lg"
            onChange={(e) => {
              handleFieldChange('description', e.target.value);
            }}
            />
            {errors.description && (
              <span className="text-warning">Este campo é obrigatório</span>
            )}{" "}
            {/** This field is required */}
            <div className="text-right">
              <label htmlFor="">{charCount} / 400 caracteres</label>
            </div>
          </div>

          <div>
            {/*Cover image field*/}
            <div className="flex flex-col space-y-2 text-left">
              <label htmlFor='cover-image'>Imagem de capa <span className="text-red-500">*</span></label> {/** Cover image */} 
            </div>
              <Dropzone inputType='image' id={id ?? "0"} previewFile={previewCourseImg} onFileChange={handleImageUpload} maxSize={5 * 1024 * 1024 /* 5mb */} />
            {errors.coverimg && <span className='text-warning'>Este campo é obrigatório</span>} {/** This field is required */}
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
              className="cursor-pointer underline py-2 pr-4 bg-transparent hover:bg-warning-100 text-warning w-full transition ease-in duration-200 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2  rounded"
            >
              Cancelar e Voltar {/** Cancel */}
            </label>

            <label
              htmlFor="course-create"
              className={`${
              course.status === "published" ? "invisible pointer-events-none" : ""
              } whitespace-nowrap ml-42 underline py-2 px-4 bg-transparent hover:bg-primary-100 text-primary w-full transition ease-in duration-200 text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 rounded ${isMissingRequiredFields ? 'opacity-70' : ''}`}
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

            <label
              htmlFor="course-create"
              className={`whitespace-nowrap h-12 p-2 bg-primary hover:bg-primaryHover focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg ${isMissingRequiredFields ? 'opacity-70' : ''}`}
            >
              <button
              onClick={navigateToSections}
              disabled={isMissingRequiredFields}
              id="addCourse"
              className="flex items-center justify-center py-4 px-8 h-full w-full cursor-pointer "
              >
              Adicionar seções
              </button>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
