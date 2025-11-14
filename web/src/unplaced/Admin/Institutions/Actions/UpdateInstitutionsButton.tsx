import { useState, useEffect, FormEvent } from "react";
import Icon from "@mdi/react";
import { mdiPencil } from "@mdi/js";
import { toast } from "react-toastify";
import { KeyedMutator } from "swr";

import { getUserToken } from "@/auth/lib/userInfo";
import GenericModalComponent from "@/shared/components/GenericModalComponent";
import { useNotifications } from "@/shared/context/NotificationContext";
import { useApi } from "@/shared/hooks/useAPI";
import { institutionService } from "@/unplaced/services/Institution.services";
import { Institution } from "@/user/types/Institution";

export const UpdateInstitutionButton = ({
  institution,
  refreshFn,
}: {
  institution: Institution;
  refreshFn: KeyedMutator<Institution[]>;
}) => {
  const [showModal, setShowModal] = useState(false);

  const [nameInput, setNameInput] = useState(institution.institutionName);
  const [domainInput, setDomainInput] = useState(institution.domain);
  const [secondaryDomainInput, setSecondaryDomainInput] = useState(
    institution.secondaryDomain
  );

  const { call: updateInstitution, isLoading } = useApi(
    institutionService.updateInstitution
  );

  useEffect(() => {
    setNameInput(institution.institutionName);
    setDomainInput(institution.domain);
    setSecondaryDomainInput(institution.secondaryDomain);
  }, [showModal]);

  const { addNotification } = useNotifications();

  const handleSumbit = async (e?: FormEvent<HTMLFormElement>) => {
    try {
      if (e) {
        e.preventDefault();
        e.currentTarget.reportValidity();
        if (!e.currentTarget.checkValidity()) {
          e.currentTarget.reportValidity();
          return;
        }
      }
      await updateInstitution(institution._id!, getUserToken(), {
        institutionName: nameInput,
        domain: domainInput,
        secondaryDomain: secondaryDomainInput,
      });

      refreshFn();
      setShowModal(false);
      addNotification("Instituição atualizada com sucesso !");
    } catch (err) {
      toast.error(String(err));
      console.error(err);
    }
  };

  const handleClose = () => {
    setNameInput("");
    setDomainInput("");
    setSecondaryDomainInput("");

    setShowModal(false);
  };

  return (
    <>
      <button
        className="btn btn-circle bg-primary hover:bg-cyan-900 border-transparent"
        onClick={() => {
          setShowModal(true);
        }}
      >
        <Icon path={mdiPencil} size={0.9} color="currentColor" />
      </button>

      {showModal && (
        <GenericModalComponent
          onConfirm={(e) => handleSumbit(e)}
          onClose={handleClose}
          isVisible={showModal}
          title="Atualizar Instituições"
          confirmBtnText="Atualizar"
          loading={isLoading}
          children={
            <form className="form-control flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                <label>
                  <span>Nome da Instituição</span>
                </label>
                <input
                  type="text"
                  name="institution-name"
                  required
                  placeholder="Instituição"
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value);
                  }}
                  className="input"
                />

                <label>
                  <span>Domínio</span>
                </label>
                <input
                  type="text"
                  name="domain"
                  required
                  pattern="@([\w\-]+\.)+[\w\-]{2,4}"
                  title="@domain.com"
                  placeholder="@domain.com"
                  value={domainInput}
                  onChange={(e) => {
                    setDomainInput(e.target.value);
                  }}
                  className="input"
                />

                <label>
                  <span>Segundo Domínio</span>
                </label>
                <input
                  type="text"
                  name="secondary-domain"
                  placeholder="@domain.com (opcional)"
                  title="@domain.com (opcional)"
                  pattern="@([\w\-]+\.)+[\w\-]{2,4}$"
                  value={secondaryDomainInput}
                  onChange={(e) => {
                    setSecondaryDomainInput(e.target.value);
                  }}
                  className="input"
                />
              </div>
            </form>
          }
        />
      )}
    </>
  );
};
