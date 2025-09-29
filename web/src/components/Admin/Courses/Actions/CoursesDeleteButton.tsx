import { useState } from "react";
import GenericModalComponent from "@components/GenericModalComponent";
import { MdDelete } from "react-icons/md";

import { useNotifications } from "@components/notification/NotificationContext";
import { getUserToken } from "@helpers/userInfo";
import { useApi } from "@hooks/useAPI";
import { toast } from "react-toastify";
import courseService from "@services/course.services";

import { CreatorPopulatedCourse } from "@interfaces/Course";
import { KeyedMutator } from "swr";

export const CoursesDeleteButton = ({
  courseId,
  refreshFn,
}: {
  courseId: string;
  refreshFn: KeyedMutator<CreatorPopulatedCourse[]>;
}) => {
  const [showModal, setShowModal] = useState(false);
  const { call: deleteCourse, isLoading } = useApi(courseService.deleteCourse);

  const { addNotification } = useNotifications();

  const handleConfirm = async () => {
    try {
      await deleteCourse(courseId, getUserToken());

      refreshFn();
      addNotification("Curso deletada com sucesso !");
      setShowModal(false);
    } catch (err) {
      toast.error(err as string);
      console.error(err);
    }
  };

  return (
    <>
      <button
        className="btn btn-circle bg-primary hover:bg-cyan-900 border-transparent"
        onClick={() => setShowModal(true)}
      >
        <MdDelete />
      </button>
      {showModal && (
        <GenericModalComponent
          onConfirm={handleConfirm}
          onClose={() => setShowModal(false)}
          isVisible={showModal}
          confirmBtnText="Deletar"
          loading={isLoading}
          title="Deletando curso"
          contentText="Você tem certeza de que deseja excluir este Curso?"
          width="w-[600px]"
        />
      )}
    </>
  );
};
