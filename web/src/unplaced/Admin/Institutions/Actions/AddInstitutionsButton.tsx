import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Institution } from "@/features/user/types/Institution";
import GenericModalComponent from "@/shared/components/GenericModalComponent";
import { useNotifications } from "@/shared/context/NotificationContext";
import { useApi } from "@/shared/hooks/useAPI";
import AuthServices from "@/unplaced/services/auth.services";

export const AddInstitutionButton = () => {
  const [showModal, setShowModal] = useState(false);
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const {
    call: addInstitution,
    isLoading,
    error: apiError,
  } = useApi(AuthServices.addInstitution);

  // Use-form setup
  const { register, handleSubmit } = useForm<Institution>();

  // Function to execute upon accepting an application
  const onSubmit: SubmitHandler<Institution> = async (institutionData) => {
    try {
      const res = await addInstitution({
        ...institutionData,
      });
      setShowModal(false);
      navigate("/educado-admin/applications");
      addNotification(
        "Adicionado " + res.institutionName + " como nova instituição"
      );
    } catch (err) {
      //apiError from useApi hook
      if (apiError !== null) {
        const errorCause = apiError?.response?.data?.error?.code;
        switch (errorCause) {
          case "E1201":
            toast.error(" Não foi possível carregar a Instituição", {
              hideProgressBar: true,
            });
            break;
          case "E1202":
            toast.error(" já é uma instituição registrada", {
              hideProgressBar: true,
            });
            break;
          case "E1203":
            toast.error(" já está registrado em outra instituição", {
              hideProgressBar: true,
            });
            break;
          case "E1204":
            toast.error(" já está registrado em outra instituição", {
              hideProgressBar: true,
            });
            break;
          default:
            toast.error("Ocorreu um erro desconhecido", {
              hideProgressBar: true,
            });
        }
      } else {
        console.error(err);
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <button
        id="newInstitutionButton"
        className="btn text-base bg-[#166276]"
        onClick={(e) => {
          e.preventDefault();
          setShowModal(true);
        }}
        disabled={isLoading}
      >
        <div className="flex justify-center items-center space-x-2">
          {isLoading ? (
            <span className="spinner-border animate-spin rounded-full border-2 border-t-transparent w-4 h-4" />
          ) : null}
          <span>Adicionar</span>
        </div>
      </button>

      {showModal && (
        <GenericModalComponent
          onConfirm={handleSubmit(onSubmit)}
          onClose={handleClose}
          isVisible={showModal}
          title="Adicionar Instituição"
          contentText=""
          confirmBtnText="Adicionar"
          loading={isLoading}
          children={
            <form className="form-control flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                <label>
                  <span>Nome da Instituição</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Instituição"
                  {...register("institutionName", { required: true })}
                  className="input"
                  id="institution"
                />

                <label>
                  <span>Domínio</span>
                </label>
                <input
                  type="text"
                  required
                  pattern="@([\w\-]+\.)+[\w\-]{2,4}"
                  title="@domain.com"
                  placeholder="@domain.com"
                  {...register("domain", { required: true })}
                  className="input"
                  id="domain"
                />

                <label>
                  <span>Segundo Domínio</span>
                </label>
                <input
                  type="text"
                  placeholder="@domain.com (opcional)"
                  title="@domain.com"
                  pattern="@([\w\-]+\.)+[\w\-]{2,4}$"
                  {...register("secondaryDomain")}
                  className="input"
                  id="secondary-domain"
                />
              </div>
            </form>
          }
        />
      )}
    </>
  );
};
