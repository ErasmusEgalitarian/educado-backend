import { useState } from "react";
import { useParams } from "react-router";
import { useCourse} from '@contexts/courseStore';
import { PhonePreview } from "./PhonePreview";

import { useApi } from "@hooks/useAPI";

import CourseServices from "../../services/course.services";
import { YellowWarning } from "../Courses/YellowWarning";
import { useNavigate } from "react-router-dom";
/* import Popup from "./Popup/Popup"; */
import GenericModalComponent from "../GenericModalComponent";

import Loading from "../general/Loading";
import Layout from "../Layout";

import PhoneCourseSection from "./PhoneCourseSection";
import ExploreCardPreview from "./ExploreCardPreview";

import { useCourseManagingHelper } from "@hooks/useCourseManagingHelper";

interface Inputs {
  id: string;
  setTickChange: (tick: number) => void;
}

// Create section
export const CoursePreview = ({
  id: propId,
  setTickChange,
}: Inputs) => {

  const { id: urlId } = useParams<{ id: string }>();
  const id = propId === "0" ? urlId : propId;

  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [cancelBtnText] = useState("Cancelar");
  const [confirmBtnText] = useState("Confirmar");
  const [dialogTitle, setDialogTitle] = useState("Cancelar alterações");

  const [dialogConfirm, setDialogConfirm] = useState<() => void>(() => {});

  const {course } = useCourse();
  const courseCacheLoading = Object.keys(course).length === 0;
  const existingCourse = id !== "0";
  const callFunc = existingCourse ? CourseServices.updateCourse : CourseServices.createCourse;
  const { call: submitCourse, isLoading: submitLoading} = useApi(callFunc);

  const navigate = useNavigate();

  const { handleDialogEvent, handleSaveAsDraft, handlePublishCourse  } = useCourseManagingHelper();

  const status = course.status ?? "draft";

  const handleDraftClick = () => {
    handleDialogEvent(
      "Você tem certeza de que quer salvar como rascunho as alterações feitas?",
      handleDraftConfirm,
      "Salvar como rascunho ", 
      setDialogTitle,
      setDialogMessage,
      setDialogConfirm,
      setShowDialog,
    );
  }

  const handlePublishClick = () => {
    handleDialogEvent(
      status === "published"
        ? "Tem certeza de que deseja publicar o curso? Isso o disponibilizará para os usuários do aplicativo"
        : "Tem certeza de que deseja publicar as alterações feitas no curso",
      handlePublishConfirm,
      "Publicar curso", 
      setDialogTitle,
      setDialogMessage,
      setDialogConfirm,
      setShowDialog,
    );
  }
  

  const handleDraftConfirm = async () => {
    await handleSaveAsDraft(submitCourse);
  };

  const handlePublishConfirm = async () => {
    await handlePublishCourse(submitCourse);
  };


  function changeTick(tick: number) {
    setTickChange(tick);
    navigate(`/courses/manager/${id}/${tick}`);
  }

  

  if (courseCacheLoading && existingCourse)
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
        onConfirm={async () => {
         dialogConfirm();
        }}
        onClose={() => {
          setShowDialog(false);
        }} // Do nothing
        loading={submitLoading}
      />

      <div className="">
        <div className="flex w-full items-center justify-between my-4">
          <div className="flex">
            <h1 className="text-2xl font-bold">Revisar curso</h1>
          </div>
        </div>

        <div className="flex w-full float-right space-y-4">
          <YellowWarning text="Navegue pelo seu curso na visualização do aluno antes de publicá-lo." />
        </div>

        <div className="flex w-full float-right items-center justify-center space-y-4 my-4">
          {/** Course Sections area  */}
          <div className="flex w-full flex-row justify-around gap-x-8 max-w-5xl">
            <PhonePreview title="Informações do curso" >
                <ExploreCardPreview/>
            </PhonePreview>
            <PhonePreview title="Seções do curso" >
                <PhoneCourseSection/>
            </PhonePreview>
          </div>
        </div>

        {/*Create and cancel buttons*/}
        <div className='className="flex w-full float-right space-y-4 "'>
          <div className="flex items-center justify-between gap-4 w-full mt-8">
            <label
              onClick={() => changeTick(1)}
              className="whitespace-nowrap cursor-pointer underline py-2 pr-4 bg-transparent hover:bg-warning-100 text-primary w-full transition ease-in duration-200 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2  rounded"
            >
              Voltar para Seções
              {/** GO BACK TO COURSE CREATION PAGE 2/3 IN THE CHECKLIST */}
            </label>

            <label
              className={` ${
                status === "published" ? "invisible pointer-events-none" : ""
              } pl-32  underline py-2 bg-transparent hover:bg-primary-100 text-primary w-full transition ease-in duration-200 text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2  rounded `}
            >
              <label
                onClick={handleDraftClick}
                className="whitespace-nowrap hover:cursor-pointer underline"
              >
                Salvar como Rascunho {/** Save as draft */}
              </label>
            </label>

            <label className="h-12 p-2 bg-primary hover:bg-primary focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg">
              <label
                onClick={handlePublishClick}
                className="whitespace-nowrap py-4 px-8 h-full w-full cursor-pointer"
              >
                {status === "published" ? "Publicar Edições" : "Publicar Curso"}{" "}
              </label>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
