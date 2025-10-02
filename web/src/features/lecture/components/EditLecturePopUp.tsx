import { mdiInformationSlabCircleOutline } from "@mdi/js";
import { Icon } from "@mdi/react";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { useLectures, useMedia } from "@/course/context/courseStore";
import { Lecture } from "@/course/types/Course";
import { useApi } from "@/shared/hooks/useAPI";
import { convertSrcToFile } from "@/shared/lib/fileHelpers";

import { ModalButtonCompont } from "../../../shared/components/ModalButtonCompont";
import RichTextEditor from "../../../shared/components/RichTextEditor";
import { useNotifications } from "../../../shared/context/NotificationContext";
import StorageServices from "../../../unplaced/services/storage.services";

// Icons

<Icon path={mdiInformationSlabCircleOutline} size={1} />;

interface Inputs {
  title: string;
  description: string;
  contentType: string;
  content: string;
}

interface Props {
  lecture: Lecture; //
  handleEdit: (title: string) => void;
}
/**
 * This component is a modal that opens when the user clicks on the button to create a new lecture.
 * It has a form to input the data of the new lecture.
 *
 * @returns HTML Element
 */
export const EditLecture = ({ lecture, handleEdit }: Props) => {
  const { getMedia, updateMedia, addMediaToCache } = useMedia();
  const { updateCachedLecture } = useLectures();
  //TODO: When tokens are done, Remove dummy token and uncomment useToken

  //const sid = window.location.pathname.split("/")[2];

  // use-form setup
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [contentType, setContentType] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { addNotification } = useNotifications();
  const cachedVideo = getMedia(lecture._id);
  const [lectureVideo, setLectureVideo] = useState<File | null>(cachedVideo);
  const previewFileSrc = lectureVideo
    ? URL.createObjectURL(lectureVideo)
    : null;
  const { call: fetchPreviewVideo, isLoading: loadingPreview } = useApi(
    StorageServices.getMedia
  );

  const toggler = (value: string) => {
    setContentType(value);
  };

  useEffect(() => {
    setLectureVideo(cachedVideo);
  }, [cachedVideo]);

  useEffect(() => {
    if (lecture.contentType !== "video") return;
    if (lectureVideo) return;
    const fetchPreview = async () => {
      const videoId = lecture._id + "_l"; // Assuming `data` is available here
      const fileSrc = await fetchPreviewVideo(videoId);

      const videoSrc = `data:video/mp4;base64,${fileSrc.split(",")[1]}`; //Quickfix - backend has to be adjusted to do this correctly, lasse don't @ me
      if (fileSrc !== null) {
        const file = await convertSrcToFile(videoSrc, videoId);
        const newMedia = {
          id: lecture._id,
          file: file,
          parentType: "l",
        };
        addMediaToCache(newMedia);
      }
    };
    fetchPreview();
  }, [lecture._id]);

  // Initialize the editorValue with data.content if available (for editing)
  useEffect(() => {
    if (lecture?.content !== "") {
      setEditorValue(lecture.content);
      setValue("content", lecture.content); // Initialize form value as well
    }
  }, [lecture, setValue]);

  const handleFileChange = (file: File | null) => {
    if (file === null) return;
    setLectureVideo(file);
  };

  /**
   * Function to handle the submit of the form
   *
   * @param {Inputs} data The data from each field in the form put into an object
   */
  const onSubmit: SubmitHandler<Inputs> = async (newData) => {
    setIsSubmitting(true);
    const updatedLecture = {
      title: newData.title,
      description: newData.description,
      contentType: newData.contentType,
      content: newData.content,
      parentSection: lecture.parentSection,
      _id: lecture._id,
    };
    updateCachedLecture(updatedLecture);
    if (lectureVideo !== null) {
      const newMedia = {
        id: lecture._id,
        file: lectureVideo,
        parentType: "l",
      };
      updateMedia(newMedia);
    }
    handleEdit(newData.title);
    addNotification("Aula atualizada com sucesso");
  };

  const [editorValue, setEditorValue] = useState<string>("");

  const handleEditorChange = (value: string) => {
    setEditorValue(value); // Update local state
    setValue("content", value); // Manually set form value
    lecture.content = value;
  };

  return (
    <>
      {/*Text shown in the top of create lecture*/}
      <div className="modal" id={`lecture-edit-${lecture._id}`}>
        <div className="modal-box bg-linear-to-b from-primaryLight w-11/12 max-w-xl rounded-3xl ">
          <h3 className="font-bold text-lg">Editar sua aula</h3>{" "}
          {/*Create your new lecture!*/}
          {/*Field to input the title of the new lecture*/}
          <form
            className="flex h-full flex-col justify-between space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col space-y-2 text-left">
              <label htmlFor="title">
                Título <span className="text-red-500">*</span>
              </label>{" "}
              {/*Title*/}
              <input
                type="text"
                placeholder="Insira o título da aula"
                defaultValue={lecture.title}
                className="form-field focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent border-none rounded-lg"
                {...register("title", { required: true })}
              />
              {errors.title && (
                <span className="text-warning">Este campo é obrigatório</span>
              )}
            </div>
            {/*Field to input the description of the lecture*/}
            <div className="flex flex-col space-y-2 text-left">
              <label htmlFor="description">
                Descrição <span className="text-red-500">*</span>
              </label>{" "}
              {/*Description*/}
              <textarea
                rows={4}
                placeholder="Insira o conteúdo escrito dessa aula"
                defaultValue={lecture.description}
                className="resize-none form-field focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent border-none rounded-lg"
                {...register("description", { required: true })}
              />
              {/*defaultValue=Add a description to your lecture*/}
              {errors.description && (
                <span className="text-warning">Este campo é obrigatório</span>
              )}
            </div>
            <label htmlFor="content-type">
              Tipo de conteúdo <span className="text-red-500">*</span>
            </label>{" "}
            {/*Content type*/}
            <div className="flex flex-row space-x-8">
              <div>
                <label htmlFor="radio1">
                  <input
                    type="radio"
                    className="mr-2"
                    id="radio1"
                    value="video"
                    checked={
                      (lecture?.contentType === "video" &&
                        contentType === "") ||
                      contentType === "video"
                        ? true
                        : false
                    }
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
                    checked={
                      (lecture?.contentType === "text" && contentType === "") ||
                      contentType === "text"
                        ? true
                        : false
                    }
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
              {(lecture?.contentType === "video" && contentType === "") ||
              contentType === "video" ? (
                <>
                  <label htmlFor="cover-image">
                    Upload do video <span className="text-red-500">*</span>
                  </label>{" "}
                  {/*Input file*/}
                  {!loadingPreview && (
                    <Dropzone
                      inputType="video"
                      id={lecture._id}
                      previewFile={previewFileSrc}
                      onFileChange={handleFileChange}
                    />
                  )}
                </>
              ) : (lecture?.contentType === "text" && contentType === "") ||
                contentType === "text" ? (
                <>
                  <label htmlFor="content">Formate o seu texto abaixo</label>
                  <RichTextEditor
                    value={editorValue} // Use the local editorValue for the content
                    onChange={handleEditorChange}
                  />
                </>
              ) : (
                <p />
              )}
              {/* {errors.description && <span className='text-warning'>Este campo é obrigatório</span>}*/}
            </div>
            {/*Create and cancel buttons*/}
            <ModalButtonCompont
              type="edit"
              isSubmitting={isSubmitting}
              typeButtons={`lecture-edit-${lecture._id}`}
            />
          </form>
        </div>
      </div>
    </>
  );
};
