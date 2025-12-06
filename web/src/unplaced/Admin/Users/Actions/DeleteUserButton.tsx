/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from "react";
import { toast } from "react-toastify";

import { getUserToken } from "@/auth/lib/userInfo";
import GenericModalComponent from "@/shared/components/generic-modal-component.tsx";
import { useNotifications } from "@/shared/context/NotificationContext";
import { useApi } from "@/shared/hooks/useAPI";
import AdminServices from "@/unplaced/services/admin.services";
import "react-toastify/dist/ReactToastify.css";
interface DeleteUserButtonProps {
  applicationId: string;
  onDelete: () => void;
}

const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({
  applicationId,
  onDelete,
}) => {
  const { addNotification } = useNotifications();
  const [showModal, setShowModal] = useState(false);

  const {
    call: deleteUser,
    isLoading,
    error,
  } = useApi(AdminServices.deleteUser);

  const handleDelete = async () => {
    try {
      const token = getUserToken();
      if (!token) {
        console.error("No token found");
        return;
      }
      await deleteUser(applicationId, token);
      addNotification("Usuário deletado com sucesso");
      onDelete();
      setShowModal(false); // Close the modal after deletion
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user.");
    }
  };

  const handleClick = () => {
    setShowModal(true); // Show the confirmation modal
  };

  const handleCancel = () => {
    setShowModal(false); // Hide the modal if user cancels
  };

  return (
    <>
      <div
        key={applicationId}
        id="deleteUser"
        className="flex items-center justify-center p-4 -ml-2 mr-6 bg-[#166276] rounded-full font-semibold text-base text-white cursor-pointer hover:bg-[#164E63]"
        onClick={handleClick}
      >
        <svg
          className="shrink-0 size-3.5"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="white"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            fillRule="evenodd"
            d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <GenericModalComponent
          onConfirm={handleDelete}
          onClose={handleCancel}
          isVisible={showModal}
          loading={isLoading}
          confirmBtnText="Deletar"
          title="Deletando usuário"
          contentText="Você tem certeza de que deseja excluir este usuário?"
        />
      )}
    </>
  );
};

export default DeleteUserButton;
