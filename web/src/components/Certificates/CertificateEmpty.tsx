import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

import noCertificatesImage from "../../assets/no-certificates.png";

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
            <PencilSquareIcon className="w-5 h-5" />
            <p className="font-normal">Criar novo curso</p>{" "}
            {/** Create new course */}
          </label>
        </div>
      </div>
    </div>
  );
};
export default emptyState;
