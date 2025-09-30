import { useState, useEffect } from "react";

import { Answer } from "../types/Answer";

interface Props {
  update: any;
  initialAnswers: Answer[];
}

const AnswerCards = ({ update: updateAnswers, initialAnswers }: Props) => {
  const [answers, setAnswers] = useState(initialAnswers);
  useEffect(() => {
    setAnswers(initialAnswers);
  }, [initialAnswers]);
  const toggler = (index: number) => {
    const updatedAnswerCards = answers.map((answer, idx) => {
      if (idx === index) {
        answer.correct = true;
      }

      if (idx != index && answer.correct) {
        answer.correct = false;
      }
      return answer;
    });

    setAnswers(updatedAnswerCards);
    updateAnswers(updatedAnswerCards);
  };
  const handleAnswerCardAdd = () => {
    const withAddedAnswer = answers.concat({
      text: "",
      correct: false,
      feedback: "",
    });

    setAnswers(withAddedAnswer);
    updateAnswers(withAddedAnswer);
  };

  const handleAnswerCardDelete = (index: number) => {
    try {
      const withOneLessAnswer = [...answers];
      withOneLessAnswer.splice(index, 1);
      setAnswers(withOneLessAnswer);
      updateAnswers(withOneLessAnswer);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswerCardChange = (e: any, index: number) => {
    const { value } = e.target;

    const list = [...answers];
    list[index].text = value;

    setAnswers(list);
    updateAnswers(list);
  };

  const handleQuestionCardChange = (e: any, index: number) => {
    const { value } = e.target;

    const list = [...answers];
    list[index].feedback = value;

    setAnswers(list);
    updateAnswers(list);
  };

  return (
    <div className="">
      {answers.map((answer, index) => (
        <div
          key={index}
          className="card w-full bg-base-100 border hover:shadow-xl"
        >
          <div className="card-body">
            <div className="flex items-center gap-8 w-full items-baseline">
              {index > 1 ? (
                <div className="form-control w-1/10 card-actions flex justify-around ">
                  <label
                    onClick={() => {
                      handleAnswerCardDelete(index);
                    }}
                    className="btn btn-square btn-sm absolute top-2 right-2  "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 12H6"
                      />
                    </svg>
                  </label>
                </div>
              ) : (
                <div />
              )}

              <div className="w-1/3 flex flex-col space-y-2 text-left">
                <p>
                  A resposta está{" "}
                  {answer.correct ? (
                    <span> correta</span>
                  ) : (
                    <span> incorreta</span>
                  )}
                </p>
                <div className="form-control w-1/10">
                  {/*Toggle True or False  */}
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={answer.correct}
                    onChange={() => {
                      toggler(index);
                    }}
                  />
                </div>
              </div>

              {/* <div 
                            className='w-1/3 flex flex-col space-y-2 text-left'>
                                 <input type="checkbox" value="" className="sr-only peer" checked></input>
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                                    
                                </div>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Checked toggle</span>
                          </div>
                        </div> */}

              <div className="flex flex-col space-y-2 text-left">
                <p>Resposta</p> {/** Answer */}
                <textarea
                  className="form-control w-1/10 textarea textarea-success disabled:bg-white disabled:border-white h-18"
                  placeholder="Insira a alternativa"
                  required={true}
                  name="answer"
                  defaultValue={answer.text || ""}
                  onChange={(e) => {
                    handleAnswerCardChange(e, index);
                  }}
                />
              </div>

              <div className="flex flex-col space-y-2 text-left">
                <p>Comentário </p> {/** Feedback */}
                <textarea
                  className="form-control w-1/10 textarea textarea-success disabled:bg-white disabled:border-white h-18"
                  placeholder="Insira um comentário que justifique a resposta estar correta ou incorreta"
                  required={true}
                  name="feedback"
                  defaultValue={answer.feedback || ""}
                  onChange={(e) => {
                    handleQuestionCardChange(e, index);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/*A button to create a new answer. The user is not allowed to create more than 4 answers*/}
      {answers.length < 4 && (
        <div
          key={-1}
          onClick={handleAnswerCardAdd}
          className="rounded-2xl flex flex-col space-y-2 bg-none border border-dashed border-4 hover:shadow-xl"
        >
          <div className="card-body">
            <div className="card-actions flex justify-around items-center h-full">
              <div className="flex flex-row space-x-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Adicionar resposta {/** Add answer */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerCards;
