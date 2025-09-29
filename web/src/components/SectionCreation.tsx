// Icon from: https://materialdesignicons.com/

import { useState } from "react";
import { useParams } from "react-router";
import { useApi } from '../hooks/useAPI';
import { useCourse} from '../contexts/courseStore';
import { useNotifications } from "./notification/NotificationContext";

import CourseService from "../services/course.services";
import { YellowWarning } from "./Courses/YellowWarning";
import { useNavigate } from "react-router-dom";
/* import Popup from "./Popup/Popup"; */
import GenericModalComponent from "./GenericModalComponent";
import { SectionForm } from "./dnd/SectionForm";
import { SectionList } from "./dnd/SectionList";

import { ToolTipIcon } from "./ToolTip/ToolTipIcon";
import Loading from "./general/Loading";
import Layout from "./Layout";
// Notification
import CourseGuideButton from "./Courses/GuideToCreatingCourse";
import { useCourseManagingHelper} from "@hooks/useCourseManagingHelper";
interface Inputs {
  setTickChange: (tick: number) => void;
}
// Create section
export const SectionCreation = ({
  setTickChange,
}: Inputs) => {
  const { id } = useParams<{ id: string }>();
  const [toolTipIndex, setToolTipIndex] = useState<number>(4);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [cancelBtnText] = useState("Cancelar");
  const [confirmBtnText] = useState("Confirmar");
  const [dialogTitle, setDialogTitle] = useState("Cancelar alterações");
  const [dialogConfirm, setDialogConfirm] = useState<() => void>(() => {});

  const {course} = useCourse();
  const existingCourse = id !== "0";
  const courseCacheLoading = Object.keys(course).length === 0;

  const callFunc = existingCourse ? CourseService.updateCourse : CourseService.createCourse;
  const { call: submitCourse, isLoading: submitLoading} = useApi(callFunc);
  const status = course.status;
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const { handleSaveAsDraft, handleDialogEvent, checkAllSectionsGotComponents, someSectionMissingRequiredFields } = useCourseManagingHelper();



  const handleSave = () => {
    handleDialogEvent(
      "Você tem certeza de que quer salvar como rascunho as alterações feitas?",
      handleDraftConfirm,
      "Salvar como rascunho ", 
      setDialogTitle,
      setDialogMessage,
      setDialogConfirm,
      setShowDialog,
    );
  };

  const handleDraftConfirm = async () => {
    await handleSaveAsDraft(submitCourse);
  };

  

  const handleGoPreviewCourse = async () => {
      const sectionsAreValid = checkAllSectionsGotComponents();
      if (!sectionsAreValid) {
        addNotification("Curso não pode ser publicado devido a secções vazias!");
        return;
      }
      setTickChange(2);
      navigate(`/courses/manager/${id}/2`);
  };

  function changeTick(tick: number) {
    setTickChange(tick);
    navigate(`/courses/manager/${id}/${tick}`);
  }

  if (courseCacheLoading)
    return (
      <Layout meta="course overview">
        <Loading />
      </Layout>
    ); // Loading course details

  return (
    <div>
      <GenericModalComponent
        title={dialogTitle}
        contentText={dialogMessage}
        cancelBtnText={cancelBtnText}
        confirmBtnText={confirmBtnText}
        isVisible={showDialog}
        width="w-[500px]"
        onConfirm={
          dialogConfirm 
        }
        onClose={() => {
          setShowDialog(false);
        }}
        loading={submitLoading}
      />

      <div className="">
        <div className="flex w-full items-center justify-between my-4">
          <div className="flex">
            <h1 className="text-2xl font-bold">Seções do curso </h1>
            {/** Tooltip for course sections header*/}
            <ToolTipIcon
            alignLeftTop={false}
              index={0}
              toolTipIndex={toolTipIndex}
              text={
                "👩🏻‍🏫Nossos cursos são separados em seções e você pode adicionar quantas quiser!"
              }
              tooltipAmount={1}
              callBack={setToolTipIndex}
            />
          </div>
          <CourseGuideButton />
        </div>

        <div className="flex w-full float-right space-y-4">
          <YellowWarning text="Você pode adicionar até 10 itens em cada seção, entre aulas e exercícios." />
        </div>

        <div className="flex w-full float-right items-center justify-left space-y-4">
          {/** Course Sections area  */}
          <div className="flex w-full flex-col space-y-2 ">
            <SectionList
              sections={course.sections}
            />
            <SectionForm/>
          </div>
        </div>

        {/*Create and cancel buttons*/}
        <div className='className="flex w-full float-right space-y-4 "'>
          <div className="flex items-center justify-between gap-4 w-full mt-8">
            <label
              onClick={() => changeTick(0)}
              className="whitespace-nowrap cursor-pointer underline py-2 pr-4 bg-transparent hover:bg-warning-100 text-primary w-full transition ease-in duration-200 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2  rounded"
            >
              Voltar para Informações{" "}
              {/** GO BACK TO COURSE CREATION PAGE 1/3 IN THE CHECKLIST */}
            </label>

            <div
              className={` ${
              status === "published" ? "invisible pointer-events-none" : ""
              } pl-32 underline mx-2 bg-transparent hover:bg-primary-100 text-primary w-full transition ease-in duration-200 text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 rounded ${
              someSectionMissingRequiredFields() ? "opacity-70" : ""
              }`}
            >
              <button
              disabled={someSectionMissingRequiredFields()}
              onClick={handleSave}
              className="whitespace-nowrap hover:cursor-pointer underline"
              >
              Salvar como Rascunho {/** Save as draft */}
              </button>
            </div>

            <div className={`h-12 m-2 bg-primary flex items-center content-center hover:bg-primaryHover focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg ${
              someSectionMissingRequiredFields() ? "opacity-70" : ""}`}>
              <button
                disabled={someSectionMissingRequiredFields()}
                onClick={() => handleGoPreviewCourse()}
                className="whitespace-nowrap px-8  w-full cursor-pointer"
              >
                Revisar Curso
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
