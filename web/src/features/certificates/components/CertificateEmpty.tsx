import Icon from "@mdi/react";
import { mdiPencilBoxOutline } from "@mdi/js";
import { useNavigate } from "react-router-dom";

import noCertificatesImage from "@/shared/assets/no-certificates.png";

const emptyState = () => {
  const navigate = useNavigate();

  const CourseManager = () => {
    navigate("/courses/manager/0/0");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div
        className="flex flex-col items-center text-center justify-center"
        id="no-certificates-message"
      >
        <img src={noCertificatesImage} className="w-1/3 h-auto mx-auto" />
        <div className="w-[70%]">
          <h1 className="text-xl flex-1 font-bold my-4">
            Você ainda não tem nenhum certificado.
          </h1>
          <p className="text-darkGray flex-1 ">
            Clique no botão abaixo e siga o passo a passo para desenolver o seu
            primeiro curso.
          </p>
          <label
            htmlFor="course-create"
            onClick={CourseManager}
            className="std-button justify-center text-center items-center flex-1 flex modal-button  space-x-"
          >
            <Icon path={mdiPencilBoxOutline} size={0.9} color="currentColor" />
            <p className="font-normal">Criar novo curso</p>{" "}
            {/** Create new course */}
          </label>
        </div>
      </div>
    </div>
  );
};
export default emptyState;
