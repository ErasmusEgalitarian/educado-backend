import { mdiChevronUp, mdiChevronDown } from "@mdi/js";
import { Icon } from "@mdi/react";
import React, { useEffect, useState, ChangeEvent } from "react";
import { UseFormRegister } from "react-hook-form";

import { NewApplication } from "@/features/user/types/application";

interface MotivationProps {
  // Type definitions for props
  register: UseFormRegister<NewApplication>;
  setIsMotivationFilled: (filled: boolean) => void;
}

const Motivation: React.FC<MotivationProps> = ({
  // Destructuring of props
  register,
  setIsMotivationFilled,
}) => {
  // States for whether dynamic form is expanded or collapsed
  const [isMotivationOpen, setIsMotivationOpen] = useState(true);

  //Variable for keeping track of the length of the motivation
  const [motivation, setMotivation] = useState("");
  const maxLength = 800;
  const minLength = 2;

  // Function to make sure motivation is not above 800 characters
  const handleMotivationChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    if (text.length <= maxLength) {
      setMotivation(text);
    }
  };

  // Check if motivation is filled and disable send button if not
  useEffect(() => {
    if (motivation.length > minLength) setIsMotivationFilled(true);
    else setIsMotivationFilled(false);

    // Skip applying the effect if the state of the motivation form hasn't changed
  }, [motivation, setIsMotivationFilled]);

  return (
    <div className="justify-center items-center font-['Montserrat']">
      {/* Collapsed form  */}
      <button
        type="button"
        className={`first_form_open w-[1000px] h-[72px] p-6 shadow-xl flex-col justify-start items-start gap-20 inline-flex font-bold pl-6 ${
          isMotivationOpen
            ? "rounded-tl-lg rounded-tr-lg bg-primary text-white"
            : "rounded-lg bg-white text-neutral-700 text-grayDark"
        }`}
        onClick={() => {
          setIsMotivationOpen(!isMotivationOpen);
        }}
      >
        <div className="flex items-start">
          {isMotivationOpen ? (
            <Icon path={mdiChevronUp} size={1} className="text-white" />
          ) : (
            <Icon path={mdiChevronDown} size={1} className="text-grayDark" />
          )}
          Motivações
        </div>
      </button>

      {/* Expanded form */}
      {isMotivationOpen && (
        <div className="border border-primary p-4 rounded-b-lg text-left bg-white z-50">
          <div className="flex flex-col">
            {/* We want to know more about you! Tell us about your reasons for joining Educado */}
            <label htmlFor="motivation">
              Queremos saber mais sobre você! Nos conte suas motivações para
              fazer parte do Educado
            </label>

            <textarea
              className="bg-secondary rounded-lg border-none"
              placeholder="Escreva aqui porque você quer fazer parte de projeto"
              maxLength={maxLength}
              value={motivation}
              {...register("motivation", { required: true })}
              onChange={handleMotivationChange}
            />

            {/* Display current length of input text and maximum allowed characters */}
            <div className="text-right text-sm text-grayDark mt-2">
              {motivation.length} / {maxLength} caracteres
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Motivation;
