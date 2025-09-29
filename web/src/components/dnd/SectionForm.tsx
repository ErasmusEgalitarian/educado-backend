import { mdiPlus } from "@mdi/js";
import { Icon } from "@mdi/react";
import { useForm, SubmitHandler } from "react-hook-form";

// Hooks
import { useParams } from "react-router-dom";

import { useSections } from "@contexts/courseStore";

import { getUserToken } from "../../helpers/userInfo";

// Services
import SectionServices from "../../services/section.services";

// Icons

interface Inputs {
  title: string;
}

export const SectionForm = () => {
  const token = getUserToken();
  const { id } = useParams();

  const { createNewSection } = useSections();
  // React useForm setup
  const { handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    createNewSection();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <button className="mt-5 flex bg-transparent hover:bg-transparent h-10 w-full float-right space-y-4 btn std-btn border border-dashed border-gray-400">
        <p className="hover:text-gray text-gray-500 normal-case font-semibold flex items-center text-align:center">
          <Icon path={mdiPlus} size={1} className="" />
          Nova seção
        </p>
      </button>
    </form>
  );
};
