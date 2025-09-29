import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dropzone } from "./Dropzone/Dropzone";

// Hooks
import { useLectures, useMedia } from "../contexts/courseStore";

import { useNotifications } from "./notification/NotificationContext";

//components
import { ModalButtonCompont } from "./ModalButtonCompont";
import RichTextEditor from "./RichTextEditor";
// Icons
import { Icon } from "@mdi/react";
import { mdiInformationSlabCircleOutline } from "@mdi/js";

import { Component } from "../interfaces/Course";

<Icon path={mdiInformationSlabCircleOutline} size={1} />;

type Inputs = {
  title: string;
  description: string;
  contentType: string;
  content: string;
};

interface Props {
  savedSID: string;
  handleLectureCreation: (newComponent: Component) => void;
}
/**
 * This component is a modal that opens when the user clicks on the button to create a new lecture.
 * It has a form to input the data of the new lecture.
 *
 * @returns HTML Element
 */
export const CreateLecture = ({ savedSID, handleLectureCreation }: Props) => {

  // use-form setup
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();

  const [contentType, setContentType] = useState<string>("");
  const [editorValue, setEditorValue] = useState<string>('');
  const [lectureVideo, setLectureVideo] = useState<File | null>(null);
  const { addLectureToCache } = useLectures();
  const { addMediaToCache } = useMedia();



  const { addNotification } = useNotifications();

  const toggler = (value: string) => {
    setContentType(value);
  };

  /**
   * Function to handle the submit of the form
   *
   * @param {Inputs} newData The data from each field in the form put into an object
   */
  const onSubmit: SubmitHandler<Inputs> = async (newData: Inputs) => {
    const newLecture = {
      _id: "0",
      title: newData.title,
      description: newData.description,
      contentType: newData.contentType,
      content: newData.content,
      parentSection: savedSID,
    }
    const res = addLectureToCache(newLecture);
    const newComponent = {
      compId: res._id,
      compType: "lecture",
      _id : "0",
    }
    handleLectureCreation(newComponent)
    if (lectureVideo !== null) {
      const newMedia = {
        id: res._id,
        file: lectureVideo,
        parentType: "l",
      }
      addMediaToCache(newMedia);
      setLectureVideo(null);
    }
    clearLectureModalContent();
    addNotification("Aula criada com sucesso");
  };

  function clearLectureModalContent() {
    reset();
      setContentType("");
  }

  const handleEditorChange = (value: string) => {
    setEditorValue(value); // Update local state
    setValue("content", value); // Manually set form value
  };
  


  return (
    <>
      {/*Text shown in the top of create lecture*/}
      <div className="modal" id={`lecture-create-${savedSID}-modal`}>
        <div className="modal-box bg-gradient-to-b from-primaryLight rounded-3xl w-11/12 max-w-xl">
          <h3 className="font-bold text-lg">Crie sua nova aula </h3>{" "}
          {/*Create your new lecture!*/}
          <p className="py-4">
            Preencha o formulário e inicie sua nova aula!
          </p>{" "}
          {/*Fill out the form and start your new lecture!*/}
          {/*Field to input the title of the new lecture*/}
          <form
            className="flex h-full flex-col justify-between space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col space-y-2 text-left">
              <label htmlFor="title">Nome <span className="text-red-500">*</span></label> {/*Title*/}
              <input
                type="text"
                placeholder={"Noma da aula"}
                defaultValue={""}
                className="form-field focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-lg border-none"
                {...register("title", { required: true })}
              />
              {errors.title && (
                <span className="text-warning">Este campo é obrigatório</span>
              )}
            </div>
            {/*Field to input the description of the lecture*/}
            <div className="flex flex-col space-y-2 text-left">
              <label htmlFor="description">Descrição <span className="text-red-500">*</span></label> {/*Description*/}
              <textarea
                rows={4}
                placeholder={"Descrição da aula"}
                defaultValue={""}
                className="resize-none form-field focus:outline-none focus:ring-2 focus:ring-primary rounded-lg focus:border-transparent border-none"
                {...register("description", { required: true })}
              />
              {/*defaultValue=Add a description to your lecture*/}
              {errors.description && (
                <span className="text-warning">Este campo é obrigatório</span>
              )}
            </div>
            
            <label htmlFor="content-type">Tipo de conteúdo <span className="text-red-500">*</span></label>{" "}
            {/*Content type*/}
            <div className="flex flex-row space-x-8">
              <div>
                <label htmlFor="radio1">
                  <input
                    type="radio"
                    className="mr-2"
                    id="radio1"
                    value="video"
                    checked={contentType === "video" ? true : false}
                    {...register("contentType", { required: true })}
                    onChange={(e) => {
                      toggler(e.target.value);
                    }}
                  />
                  Video
                </label>
              </div>

              <div>
                <label htmlFor="radio2" className="space-x-2">
                  <input
                    type="radio"
                    className="mr-2"
                    id="radio2"
                    value="text"
                    checked={contentType === "text"}
                    {...register("contentType", { required: true })}
                    onChange={(e) => {
                      toggler(e.target.value);
                    }}
                  />
                  Texto Estilizado
                </label>
              </div>

              {errors.contentType && (
                <span className="text-warning">Este campo é obrigatório</span>
              )}
            </div>
            
            {/*One day this will be file*/}
            <div className="flex flex-col space-y-2 text-left">
              {contentType === "video" ? (
                <>
                  <label htmlFor="cover-image">
                    Upload do video <span className="text-red-500">*</span>
                  </label>{" "}
                  {/*Input file*/}
                  
                  
                  <Dropzone inputType="video" id="0" onFileChange={setLectureVideo}/>
                </>
              ) : contentType === "text" ? (
                <>
                  <label htmlFor="content">Formate o seu texto abaixo</label>
                  <RichTextEditor value={editorValue} onChange={handleEditorChange}
                  />
                </>
              ) : (
                <p></p>
              )}
              {/* {errors.description && <span className='text-warning'>Este campo é obrigatório</span>}*/}
            </div>
            {/*Create and cancel buttons*/}
            <ModalButtonCompont
              isSubmitting={false}
              typeButtons={`lecture-create-${savedSID}`}
              type={"create"}
            />
          </form>
        </div>
      </div>
    </>
  );
};
