import React, { useState } from "react";

import GenericModalComponent from "@/shared/components/GenericModalComponent";

import GenericModalComponentUser from "./UserGenericContainerComponent";
/*

This component is used to display the user details modal in the admin dashboard.
It displays the user's name, email, status, motivations, 
academic experiences and professional experiences.
It also allows the admin to approve or reject the user's application.

The Informations are being parsed to the UserGenericContainerComponent and GenericModalComponent

*/
interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userDetails: any;
  token: string;
  applicationId: string;
  onHandleStatus: () => void;
  userApplication: any;
  contentCreator: any;
  loading: boolean;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  userDetails,
  token,
  applicationId,
  onHandleStatus,
  userApplication,
  contentCreator,
  loading,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState([true, false, false]);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  if (!isOpen) return null;

  const toggleDropdown = (index: number) => {
    setIsDropdownOpen((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const handleReject = () => {
    setIsRejectModalOpen(true);
  };

  const handleApprove = () => {
    setIsApproveModalOpen(true);
  };

  const closeModal = () => {
    setIsRejectModalOpen(false);
    setIsApproveModalOpen(false);
    onHandleStatus();
  };

  const renderModal = () => {
    const modalProps = {
      isOpen: isRejectModalOpen || isApproveModalOpen,
      onClose: closeModal,
      title: isRejectModalOpen ? "Rejeitar aplicação" : "Aprovar aplicação",
      contentText: isRejectModalOpen
        ? "Justifique a rejeição da aplicação"
        : "",
      confirmBtnText: isRejectModalOpen ? "Rejeitar" : "Aprovar",
      onConfirm: closeModal,
      userId: applicationId,
      token: token,
      onHandleStatus: onHandleStatus,
      userDetails: userDetails,
      isReject: isRejectModalOpen,
      loading: loading,
    };

    if (isRejectModalOpen || isApproveModalOpen) {
      return <GenericModalComponentUser {...modalProps} />;
    }
    return null;
  };

  return (
    <>
      <GenericModalComponent
        title="Perfil de usuário"
        contentText=""
        confirmBtnText=""
        cancelBtnText=""
        onClose={onClose}
        isVisible={isOpen}
        onConfirm={() => {}}
        isConfirmDisabled={false}
        loading={loading}
        width="900px"
      >
        <div className="overflow-y-auto max-h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center bg-white p-2 md:p-4 rounded-l-lg mt-4 relative">
              <dt className="text-[#166276] text-base font-bold font-['Lato']">
                Nome
              </dt>
              <dd
                id="name"
                className="text-base font-['Montserrat'] text-gray-900 break-all"
              >
                {userDetails.firstName} {userDetails.lastName}
              </dd>
            </div>
            <div className="flex flex-col items-center bg-white p-2 md:p-4 rounded-r-lg mt-4">
              <dt className="text-[#166276] text-base font-bold font-['Lato']">
                Email
              </dt>
              <dd
                id="email"
                className="text-base font-['Montserrat'] text-gray-900 break-all"
              >
                {userDetails.email}
              </dd>
            </div>
            <div className="flex flex-col items-center bg-white p-2 md:p-4 rounded-r-lg mt-4">
              <dt className="text-[#166276] text-base font-bold font-['Lato']">
                Status
              </dt>
              <dd
                id="status"
                className="text-base font-['Montserrat'] text-gray-900 break-all"
              >
                {contentCreator
                  ? contentCreator.approved
                    ? "Aprovado"
                    : contentCreator.rejected
                      ? "Recusado"
                      : "Aguardando análise"
                  : null}
              </dd>
            </div>
          </div>
          <button
            onClick={() => {
              toggleDropdown(0);
            }}
            className={`mt-4 py-4 px-2 rounded-lg text-base font-base font-['Lato'] w-full flex items-center transition-colors duration-300 ${
              isDropdownOpen[0]
                ? "rounded-tl-lg rounded-tr-lg bg-primary text-white"
                : "rounded-lg bg-white text-neutral-700 text-grayDark"
            }`}
          >
            <svg
              className={`w-4 h-4 ml-2 transform transition-transform ${
                isDropdownOpen[0] ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
            <span className="ml-2">Motivações</span>
          </button>
          <div
            className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
              isDropdownOpen[0] ? "max-h-screen" : "max-h-0"
            }`}
          >
            <div className="p-4 bg-white rounded-b-lg shadow-sm break-all">
              <p className="text-base font-['Montserrat'] text-gray-900">
                {userApplication?.application?.motivation !== undefined
                  ? userApplication.application.motivation
                  : "No motivation provided"}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              toggleDropdown(1);
            }}
            className={`mt-4 py-4 px-2 rounded-lg text-base font-base font-['Lato'] w-full flex items-center transition-colors duration-300 ${
              isDropdownOpen[1]
                ? "rounded-tl-lg rounded-tr-lg bg-primary text-white"
                : "rounded-lg bg-white text-neutral-700 text-grayDark"
            }`}
          >
            <svg
              className={`w-4 h-4 ml-2 transform transition-transform ${
                isDropdownOpen[1] ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
            <span className="ml-2">Experiências acadêmicas</span>
          </button>
          <div
            className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
              isDropdownOpen[1] ? "max-h-screen" : "max-h-0"
            }`}
          >
            {userApplication?.application?.academicLevel?.length > 0 ? (
              userApplication.application.academicLevel.map(
                (_: any, index: any) => (
                  <div
                    key={index}
                    className="p-4 bg-white rounded-b-lg shadow-sm break-all mt-2"
                  >
                    <p className="text-base font-['Montserrat'] text-gray-900">
                      Academic level:{" "}
                      {userApplication.application.academicLevel[index] ||
                        "Not provided"}
                      <br />
                      Academic status:{" "}
                      {userApplication.application.academicStatus[index] ||
                        "Not provided"}
                      <br />
                      Major:{" "}
                      {userApplication.application.major[index] ||
                        "Not provided"}
                      <br />
                      Institution:{" "}
                      {userApplication.application.institution[index] ||
                        "Not provided"}
                      <br />
                      Education start date:{" "}
                      {userApplication.application.educationStartDate[index] ||
                        "Not provided"}
                      <br />
                      Education end date:{" "}
                      {userApplication.application.educationEndDate[index] ||
                        "Not provided"}
                    </p>
                  </div>
                )
              )
            ) : (
              <p className="p-4 bg-white rounded-b-lg shadow-sm break-all mt-2 text-base font-['Montserrat'] text-gray-900">
                No academic experiences provided
              </p>
            )}
          </div>
          <button
            onClick={() => {
              toggleDropdown(2);
            }}
            className={`mt-4 py-4 px-2 rounded-lg text-base font-base font-['Lato'] w-full flex items-center transition-colors duration-300 ${
              isDropdownOpen[2]
                ? "rounded-tl-lg rounded-tr-lg bg-primary text-white"
                : "rounded-lg bg-white text-neutral-700 text-grayDark"
            }`}
          >
            <svg
              className={`w-4 h-4 ml-2 transform transition-transform ${
                isDropdownOpen[2] ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
            <span className="ml-2">Experiências profissionais</span>
          </button>
          <div
            className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
              isDropdownOpen[2] ? "max-h-screen" : "max-h-0"
            }`}
          >
            {userApplication?.application?.company?.length > 0 ? (
              userApplication.application.company.map((_: any, index: any) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-b-lg shadow-sm break-all mt-2"
                >
                  <p className="text-base font-['Montserrat'] text-gray-900">
                    Company:{" "}
                    {userApplication.application.company[index] ||
                      "Not provided"}
                    <br />
                    Position:{" "}
                    {userApplication.application.position[index] ||
                      "Not provided"}
                    <br />
                    Work activities:{" "}
                    {userApplication.application.workActivities[index] ||
                      "Not provided"}
                    <br />
                    Work start date:{" "}
                    {userApplication.application.workStartDate[index] ||
                      "Not provided"}
                    <br />
                    Work end date:{" "}
                    {userApplication.application.workEndDate[index] ||
                      "Not provided"}
                  </p>
                </div>
              ))
            ) : (
              <p className="p-4 bg-white rounded-b-lg shadow-sm break-all mt-2 text-base font-['Montserrat'] text-gray-900">
                No professional experiences provided
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="text-[#166276] rounded-sm text-base font-base font-['Lato'] underline underline-offset-4"
          >
            Fechar
          </button>
          <div className="flex space-x-4">
            <button
              onClick={handleReject}
              className={`p-3 rounded-lg text-base font-base font-['Lato'] w-32 ${
                contentCreator?.rejected
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#FE4949] hover:bg-[#E44040] text-white"
              }`}
              disabled={contentCreator?.rejected}
            >
              Recusar
            </button>
            <button
              onClick={handleApprove}
              className={`p-3 rounded-lg text-base font-base font-['Lato'] w-32 ${
                contentCreator?.approved
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#49A04A] hover:bg-[#418A42] text-white"
              }`}
              disabled={contentCreator?.approved}
            >
              Aprovar
            </button>
          </div>
        </div>
      </GenericModalComponent>
      {renderModal()}
    </>
  );
};

export default UserDetailsModal;
