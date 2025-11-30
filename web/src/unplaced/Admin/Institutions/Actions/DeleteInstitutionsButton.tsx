import { useState } from "react";
import Icon from "@mdi/react";
import { mdiDelete } from "@mdi/js";
import { toast } from "react-toastify";

import { getUserToken } from "@/features/auth/lib/userInfo";
import { Institution } from "@/features/user/types/Institution";
import GenericModalComponent from "@/shared/components/GenericModalComponent";
import { useNotifications } from "@/shared/context/NotificationContext";
import { useApi } from "@/shared/hooks/useAPI";
import { institutionService } from "@/unplaced/services/Institution.services";

export const DeleteInstitutionButton = ({
  institutionId,
  refreshFn,
}: {
  institutionId: string;
  refreshFn: () => void | Promise<unknown>;
}) => {
  const [showModal, setShowModal] = useState(false);
  const { call: deleteInstitution, isLoading } = useApi(
    institutionService.deleteInstitution
  );

  const { addNotification } = useNotifications();

  const handleConfirm = async () => {
    try {
      await deleteInstitution(institutionId, getUserToken());
      await refreshFn();
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
        <Icon path={mdiDelete} size={0.9} color="currentColor" />
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
