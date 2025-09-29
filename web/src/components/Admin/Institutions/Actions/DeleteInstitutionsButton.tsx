import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { KeyedMutator } from "swr";

import GenericModalComponent from "@components/GenericModalComponent";
import { useNotifications } from "@components/notification/NotificationContext";
import { getUserToken } from "@helpers/userInfo";
import { useApi } from "@hooks/useAPI";
import { Institution } from "@interfaces/Institution";
import { institutionService } from "@services/Institution.services";

export const DeleteInstitutionButton = ({
  institutionId,
  refreshFn,
}: {
  institutionId: string;
  refreshFn: KeyedMutator<Institution[]>;
}) => {
  const [showModal, setShowModal] = useState(false);
  const { call: deleteInstitution, isLoading } = useApi(
    institutionService.deleteInstitution,
  );

  const { addNotification } = useNotifications();

  const handleConfirm = async () => {
    try {
      await deleteInstitution(institutionId, getUserToken());
      refreshFn();
      addNotification("Instituição deletada com sucesso !");
    } catch (err) {
      toast.error(err as string);
      console.error(err);
    }
  };

  return (
    <>
      <button
        className="btn btn-circle bg-primary hover:bg-cyan-900 border-transparent"
        onClick={() => {
          setShowModal(true);
        }}
      >
        <MdDelete />
      </button>
      {showModal && (
        <GenericModalComponent
          onConfirm={handleConfirm}
          onClose={() => {
            setShowModal(false);
          }}
          isVisible={showModal}
          confirmBtnText="Deletar"
          loading={isLoading}
          title="Deletando Instituições"
          contentText="Você tem certeza de que deseja excluir este Instituições?"
          width="w-[600px]"
        />
      )}
    </>
  );
};
