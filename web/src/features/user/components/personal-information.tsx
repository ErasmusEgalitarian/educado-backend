//Imports
import { useState, ChangeEvent } from "react";

import Modals from "@/auth/components/Modals";

import { getBaseApiUrl } from "../../../shared/config/api-config";

interface PersonalInformationFormProps {
  formData: any;
  errors: any;
  handleCharCountBio: any;
  toggleMenu1: any;
  imageClick: any;
  handleFileChange: any;
  handleProfilePictureDelete: any;
  myRef: any;
  register: any;
  handleInputChange: any;
  profilePictureUrl?: string;
}

//Exporting UI content&structure of
const PersonalInformationForm = (props: PersonalInformationFormProps) => {
  const {
    formData,
    errors,
    handleCharCountBio,
    toggleMenu1,
    imageClick,
    handleFileChange,
    handleProfilePictureDelete,
    myRef,
    register,
    handleInputChange,
    profilePictureUrl,
  } = props;
  //State for pop up modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  //States for the inputfield of the first modal
  const [modalInputValue, setModalInputValue] = useState("");
  const [intError, setIntError] = useState(false);

  //Inputfield validation
  const handleInputNumbersOnly = (e: ChangeEvent<HTMLInputElement>): void => {
    // Disable non-numeric characters
    const numericInput = e.target.value.replace(/\D/g, "");

    setModalInputValue(numericInput);
    setIntError(!/^\d*$/.test(e.target.value));
  };

  // Helper get correct image URL
  const getImageUrl = (url: string | undefined): string => {
    if (!url) return "";
    if (url.startsWith('http')) return url;

    let strapiBase = getBaseApiUrl();
    if (strapiBase.endsWith('/api')) {
      strapiBase = strapiBase.slice(0, -4);
    }
    return `${strapiBase}${url}`;
  };
  
  return (
    <>
      {/* content of personal information when drop down button is clicked */}
      {toggleMenu1 && (
        /* Image */
        <div className="border border-[#166276] p-4 rounded-b-lg text-left bg-white shadow-xl">
          {/* Display selected image if uploaded, otherwise display icon with initials*/}
          {profilePictureUrl ? (
            <div className="relative inline-block">
              <img
                src={getImageUrl(profilePictureUrl)}
                className="w-[120px] h-[120px] rounded-full border-2 border-white object-cover"
                alt="Profile"
              />
            </div>
          ) : (
            <div
              onClick={imageClick}
              className="w-[120px] h-[120px] p-[30px] bg-cyan-800 rounded-[60px] border-2 border-white justify-center items-center gap-[30px] inline-flex cursor-pointer"
            >
              <div className="text-white text-4xl font-bold font-['Montserrat']">
                {formData.userName.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            ref={myRef}
            style={{ display: "none" }}
          />

          {/* Buttons for changing/deleting profile picture */}
          <div className="flex gap-4 mt-2">
            <button
              type="button"
              onClick={imageClick}
              className="p-7 text-center text-cyan-800 text-lg font-bold font-['Montserrat'] underline"
            >
              Alterar foto de perfil
            </button>
            {profilePictureUrl && (
              <button
                type="button"
                onClick={() => handleProfilePictureDelete()}
                className="p-7 text-center text-red-500 text-lg font-bold font-['Montserrat'] underline"
              >
                Deletar foto
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-7">
            {/* Username */}
            <div className="flex flex-col ">
              <label htmlFor="firstName" className="font-['Montserrat']">
                Nome
                <span className="p-1 text-[#FF4949] text-sm font-normal font-['Montserrat']">
                  *
                </span>
              </label>
              <input
                className="bg-[#E4F2F5] rounded-lg border-none"
                placeholder="User name"
                type="text"
                name="userName"
                value={formData.userName || ""}
                onChange={handleInputChange}
              />
              {errors.userName && (
                <span className="user_name_error">
                  {errors.userName?.message}
                </span>
              )}
            </div>
            {/* Email */}
            <div className="flex flex-col ">
              <label htmlFor="email" className="font-['Montserrat']">
                Email
                <span className="p-1 text-[#FF4949] text-sm font-normal font-['Montserrat']">
                  *
                </span>
              </label>
              <input
                className="bg-[#E4F2F5] rounded-lg border-none"
                placeholder="user@email.com"
                type="email"
                name="userEmail"
                value={formData.userEmail || ""}
                onChange={handleInputChange}
              />
              {errors.userEmail && (
                <span className="user_email_error">
                  {errors.userEmail?.message}
                </span>
              )}
            </div>
          </div>
          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className="font-['Montserrat']">
              Senha:
              <span className="p-2 text-[#FF4949] text-sm font-normal font-['Montserrat']">
                *
              </span>
            </label>
            <div className="grid grid-cols-3 ">
              <input
                className="bg-[#E4F2F5] rounded-lg border-none"
                placeholder="******"
                type="text"
                name="password"
              />
              <button
                type="button"
                className="text-left p-2 text-[#166276] underline"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                Alterar Senha
              </button>
            </div>
            {/* Linkedin */}
            <div className="flex flex-col">
              <label htmlFor="linkedin" className="font-['Montserrat']">
                LinkedIn Link:
                <span className="p-2 text-[#FF4949] text-sm font-normal font-['Montserrat']">
                  *
                </span>
              </label>
              <input
                className="bg-[#E4F2F5] rounded-lg border-none"
                type="text"
                {...register("linkedin", {
                  required: "digite seu nome completo.",
                })}
                name="linkedin"
                value={formData.linkedin ?? ""}
                onChange={handleInputChange}
              />
              {errors.linkedin && (
                <span className="user_linkedin_error">
                  {errors.linkedin?.message}
                </span>
              )}
            </div>
          </div>
          {/* Biograhy */}
          <div className="flex flex-col">
            <label htmlFor="bio" className="font-['Montserrat']">
              Biografia
              <span className="p-2 text-[#FF4949] text-sm font-normal font-['Montserrat']">
                *
              </span>
            </label>
            <textarea
              className="h-[120px] bg-[#E4F2F5] rounded-lg border-none resize-none text-lg font-normal font-['Montserrat']"
              placeholder="Contente mais sobre você"
              maxLength={400}
              name="bio"
              value={formData.bio ?? ""}
              onChange={handleInputChange}
            />
            <div className="text-right text-sm text-gray-400">
              {handleCharCountBio()}/400 caracteres
            </div>
          </div>

          {/* Importing child component containing the pop up modals */}
          <Modals
            setIsModalOpen={setIsModalOpen}
            isSecondModalOpen={isSecondModalOpen}
            modalInputValue={modalInputValue}
            handleInputNumbersOnly={handleInputNumbersOnly}
            intError={intError}
            setIsSecondModalOpen={setIsSecondModalOpen}
            isModalOpen={isModalOpen}
          />
        </div>
      )}

      {/* Create distance between forms */}
      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-3" />
      </div>
    </>
  );
}
export default PersonalInformationForm;
