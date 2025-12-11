import { Component, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { useExercises } from "@/course/context/courseStore";
import { Answer } from "@/exercise/types/Answer";
import { ModalButtonCompont } from "@/shared/components/modal-button-compont.tsx";
import { useNotifications } from "@/shared/context/NotificationContext";

import AnswerCards from "./AnswerCards";

export interface ExercisePartial {
  title: string;
  question: string;
  answers: Answer[];
}

interface Props {
  savedSID: string;
  handleExerciseCreation: (newComponent: Component) => void;
}

interface Inputs {
  title: string;
  question: string;
}

export const CreateExercise = ({ savedSID, handleExerciseCreation }: Props) => {
  const TempAnswers = [
    { text: "", correct: true, feedback: "" },
    { text: "", correct: false, feedback: "" },
  ];

  const [answers, setAnswers] = useState<Answer[]>(TempAnswers);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { register, handleSubmit, reset } = useForm<Inputs>();
  const { addNotification } = useNotifications();
  const { addExerciseToCache } = useExercises();

  const onSubmit: SubmitHandler<Inputs> = async (newData) => {
    const updatedExercise = {
      title: newData.title,
      question: newData.question,
      answers: answers,
      parentSection: savedSID,
      _id: "0",
    };
    const res = addExerciseToCache(updatedExercise);
    const newComponent = {
      compId: res._id,
      compType: "exercise",
      _id: "0",
    };
    handleExerciseCreation(newComponent);
    clearExerciseModalContent();
    setIsSubmitting(false);
    addNotification("Exercício criado com sucesso");
  };
  const clearExerciseModalContent = () => {
    reset();
    setAnswers(TempAnswers);
  };

  return (
    <>
      <div className="modal" id={`exercise-create-"new"}-modal`}>
        <div className="bg-white bg-linear-to-b rounded-sm w-3/8 h-5/6">
          <div className="p-5 bg-linear-to-b from-primaryLight overflow-auto h-full">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col space-y-6 divide py-2"
            >
              <div className="rounded-md cursor-pointer p-2 focus:outline-hidden bg-base-100 border">
                <div className="flex flex-col form-control align-items justify-content w-full">
                  <label className="label">
                    <span className="label-text">Título</span> {/*Title*/}
                  </label>
                  <input
                    type="text"
                    placeholder="Adicione um título a este exercício" /*Add a title to this exercise*/
                    defaultValue=""
                    className="input input-bordered w-full max-w-xs"
                    {...register("title", { required: true })}
                  />

                  <label className="label">
                    <span className="label-text">Pergunta</span> {/*Question*/}
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    defaultValue=""
                    placeholder="Adicione uma pergunta a este exercício" /*Add a question to this exercise*/
                    {...register("question", { required: true })}
                  />
                </div>
              </div>

              {/* divider */}
              <div className="flex flex-col w-full">
                <div className="divider" />
              </div>

              {/* Answers. Answers sometimes doesn't get loaded hence the conditional rendering ... */}
              {
                <div className="rounded-md cursor-pointer p-2 focus:outline-hidden bg-base-100 border ">
                  <h1 className="text-md font-medium">Resposta</h1>{" "}
                  {/** Answer */}
                  <AnswerCards update={setAnswers} initialAnswers={answers} />
                </div>
              }
              {/*Create and cancel buttons*/}
              <ModalButtonCompont
                type="create"
                isSubmitting={isSubmitting}
                typeButtons={`exercise-create-${savedSID}`}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
