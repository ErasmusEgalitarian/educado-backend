import { useState } from "react";
import GenericModalComponent from "@components/GenericModalComponent";
import { MdCreate } from "react-icons/md";

import { useNotifications } from "@components/notification/NotificationContext";
import { useApi } from "@hooks/useAPI";
import { getUserToken } from "@helpers/userInfo";
import { toast } from "react-toastify";
import courseService from "@services/course.services";

import { CreatorPopulatedCourse } from "@interfaces/Course";
import { KeyedMutator } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";

export const CoursesUpdateButton = ({
  course,
  refreshFn,
}: {
  course: CreatorPopulatedCourse;
  refreshFn: KeyedMutator<CreatorPopulatedCourse[]>;
}) => {
  const [showModal, setShowModal] = useState(false);

  const { addNotification } = useNotifications();

  type FormInputs = Pick<
    CreatorPopulatedCourse,
    "title" | "difficulty" | "category" | "description"
  >;

  const { register, handleSubmit, reset } = useForm<FormInputs>({
    defaultValues: {
      title: course.title,
      description: course.description,
      category: course.category,
      difficulty: course.difficulty,
    },
    shouldUseNativeValidation: true,
  });

  const { call: updateCourse, isLoading } = useApi(
    courseService.updateCourseDetail
  );

  const onSubmit: SubmitHandler<FormInputs> = async (formData) => {
    const token = getUserToken();
    try {
      await updateCourse({ ...formData }, course._id, token);
      refreshFn();
      addNotification("Curso atualizada com sucesso !");
      setShowModal(false);
    } catch (err) {
      toast.error(String(err));
      console.error(err);
    }
  };

  const handleClose = () => {
    reset();
    setShowModal(false);
  };

  const emptyInputWarning = "Field cannot be empty";

  return (
    <>
      <button
        className="btn btn-circle bg-primary hover:bg-cyan-900 border-transparent"
        onClick={() => setShowModal(true)}
      >
        <MdCreate />
      </button>

      {showModal && (
        <GenericModalComponent
          onConfirm={handleSubmit(onSubmit)}
          onClose={handleClose}
          isVisible={showModal}
          title="Atualizar Curso"
          confirmBtnText="Atualizar"
          loading={isLoading}
          width="w-[600px]"
          children={
            <form
              className="form-control flex flex-col"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col space-y-4">
                <label>
                  <span>Nome do curso</span>
                </label>
                <input
                  className="input"
                  type="text"
                  required
                  {...register("title", { required: emptyInputWarning })}
                />

                <div className="flex justify-between space-x-4">
                  <div className="flex flex-col w-full">
                    <label>
                      <span>Nível</span>
                    </label>
                    <select className="select" {...register("difficulty")}>
                      <option value={1}>Iniciante</option>
                      <option value={2}>Intermediário</option>
                      <option value={3}>Avançado</option>
                    </select>
                  </div>

                  <div className="flex flex-col w-full">
                    <label>
                      <span>Categoria</span>
                    </label>
                    <select className="select" {...register("category")}>
                      <option value={"personal finance"}>
                        Personal finance
                      </option>
                      <option value={"health and workplace safety"}>
                        Health and workplace safety
                      </option>
                      <option value={"sewing"}>Sewing</option>
                      <option value={"electronics"}>Electronics</option>
                      <option value={undefined}>No category</option>
                    </select>
                  </div>
                </div>

                <label>
                  <span>Descrição</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  rows={4}
                  {...register("description", { required: emptyInputWarning })}
                />
              </div>
            </form>
          }
        />
      )}
    </>
  );
};
