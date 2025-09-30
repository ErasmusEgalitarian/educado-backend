/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from "react";
import { toast } from "react-toastify";

import AdminServices from "../../services/admin.services";
import AuthServices from "../../services/auth.services";

import "react-toastify/dist/ReactToastify.css";
import GenericModalComponent from "@/shared/components/GenericModalComponent";
/*
This code bassicly extends the GenericModalCompoent
Where we re use the GenericMopdalComponent, but with the help of the, we add
some additional fields to the modal, like the name and email of the user.

!!!! Please DONT try to merge the UserGenericContainerComponent with the GenericModalComponent!!!!!

*/
interface UserGenericContainerComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  contentText: string;
  confirmBtnText: string;
  onConfirm: () => void;
  userId: string;
  token: string;
  onHandleStatus: () => void;
  userDetails: any;
  isReject: boolean;
  loading: boolean;
}

const UserGenericContainerComponent: React.FC<
  UserGenericContainerComponentProps
> = ({
  isOpen,
  onClose,
  title,
  contentText,
  confirmBtnText,
  userId,
  token,
  onHandleStatus,
  userDetails,
  isReject,
}) => {
  const [reason, setReason] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);
  const [Loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAction = async () => {
    if (isReject && !reason.trim()) {
      setIsInputValid(false);
      return;
    }

    setLoading(true);

    try {
      if (isReject) {
        await AuthServices.RejectApplication(userId, reason);
        toast.success("Application rejected!");
      } else {
        await AuthServices.AcceptApplication(userId);
        await AdminServices.changeUserRole(userId, token, "creator");
        toast.success("Application approved!");
      }
      onClose();
      onHandleStatus();
    } catch (error: any) {
      console.error("Failed to process application:", error);
      toast.error(
        error.response?.data?.error + ", But we still aproved the application"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <GenericModalComponent
      title={title}
      contentText={contentText}
      confirmBtnText={confirmBtnText}
      cancelBtnText="Voltar"
      onClose={onClose}
      isVisible={isOpen}
      onConfirm={handleAction}
      isConfirmDisabled={(isReject && !isInputValid) || Loading}
      loading={Loading}
      width="w-[900px]" // Add this line to define the width
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col bg-white p-4 md:p-6 rounded-l-lg mt-4 relative">
          <dt className="text-[#166276] text-base font-bold font-lato">Nome</dt>
          <dd
            id="name"
            className="text-base font-montserrat text-gray-900 break-all"
          >
            {userDetails.firstName} {userDetails.lastName}
          </dd>
          <div className="absolute right-0 top-1/4 h-3/5 w-px bg-[#E7F3F6]" />
        </div>
        <div className="flex flex-col bg-white p-4 md:p-6 rounded-r-lg mt-4">
          <dt className="text-[#166276] text-base font-bold font-lato">
            Email
          </dt>
          <dd
            id="email"
            className="text-base font-montserrat text-gray-900 break-all"
          >
            {userDetails.email}
          </dd>
        </div>
      </div>
      {isReject && (
        <>
          <p className="mt-4">Justificativa</p>
          <input
            type="text"
            className={`mt-2 p-2 pl-4 rounded-lg w-full border ${isInputValid ? "border-transparent" : "border-red-500"}`}
            placeholder="Justificativa da análise"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setIsInputValid(true);
            }}
          />
          {!isInputValid && (
            <p className="text-red-500 text-sm mt-1">
              Justificativa é obrigatória.
            </p>
          )}
        </>
      )}
      <p className="mt-4">Essa ação não pode ser desfeita.</p>
    </GenericModalComponent>
  );
};

export default UserGenericContainerComponent;
