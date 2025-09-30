import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { Exercise } from "@/course/types/Course";
import { ModalButtonCompont } from "@/shared/components/ModalButtonCompont";
import { useNotifications } from "@/shared/context/NotificationContext";
import { useExercises } from "@/course/context/courseStore";

import { Answer } from "../types/Answer";

import AnswerCards from "./AnswerCards";

export interface ExercisePartial {
  title: string;
  question: string;
  answers: Answer[];
}

interface Props {
  exercise: Exercise;
  handleEdit: (title: string) => void;
}

interface Inputs {
  title: string;
  question: string;
}

export const EditExercise = ({ exercise, handleEdit }: Props) => {
  const TempAnswers = [
    { text: "", correct: true, feedback: "" },
    { text: "", correct: false, feedback: "" },
  ];

  const [answers, setAnswers] = useState<Answer[]>(
    exercise.answers ?? TempAnswers
  );
  const { addNotification } = useNotifications();
  const { updateCachedExercise } = useExercises();

  const { register, handleSubmit } = useForm<Inputs>();

  /** Token doesnt work, reimplement when it token is implemented */

  const onSubmit: SubmitHandler<Inputs> = async (newData) => {
    const updatedExercise = {
      title: newData.title,
      question: newData.question,
      answers: answers,
      parentSection: exercise.parentSection,
      _id: exercise._id,
    };
    updateCachedExercise(updatedExercise);
    addNotification("Exercício atualizado com sucesso");
    handleEdit(newData.title);
  };

  return (
    <>
      <div className="modal" id={`exercise-edit-${exercise._id}-modal`}>
        <div className="bg-white bg-gradient-to-b rounded w-3/8 h-5/6">
          <div className="p-5 bg-gradient-to-b from-primaryLight overflow-auto h-full">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col space-y-6 divide py-2"
            >
              <div className="rounded-md cursor-pointer p-2 focus:outline-none bg-base-100 border">
                <div className="flex flex-col form-control align-items justify-content w-full">
                  <label className="label">
                    <span className="label-text">Título</span> {/*Title*/}
                  </label>
                  <input
                    type="text"
                    placeholder="Adicione um título a este exercício" /*Add a title to this exercise*/
                    defaultValue={exercise.title}
                    className="input input-bordered w-full max-w-xs"
                    {...register("title", { required: true })}
                  />

                  <label className="label">
                    <span className="label-text">Pergunta</span> {/*Question*/}
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    defaultValue={exercise.question}
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
                answers.length > 0 ? (
                  <div className="rounded-md cursor-pointer p-2 focus:outline-none bg-base-100 border ">
                    <h1 className="text-md font-medium">Resposta</h1>{" "}
                    {/** Answer */}
                    <AnswerCards
                      update={setAnswers}
                      initialAnswers={exercise.answers ?? TempAnswers}
                    />
                  </div>
                ) : (
                  <p>Carregando ...</p>
                ) /** Loading ... */
              }
              {/*Create and cancel buttons*/}
              <ModalButtonCompont
                type="edit"
                isSubmitting={false}
                typeButtons={`exercise-edit-${exercise._id}`}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
