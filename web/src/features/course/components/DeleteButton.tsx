import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Services
import { useNotifications } from "../../../shared/context/NotificationContext";
import CourseServices from "../../../unplaced/services/course.services";
import SectionServices from "../../../unplaced/services/section.services";

export enum DeleteType {
  course = "course",
  section = "section",
  lecture = "lecture",
  exercise = "exercise",
}

interface DeleteButtonProps {
  id: string | undefined;
  token: string;
  deleteType: DeleteType;
}

export const DeleteButton = ({ id, token, deleteType }: DeleteButtonProps) => {
  const [res, setRes] = useState<any>();

  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  /**
   * Delete courses and redirect to courses page
   * Uses window.location.href to redirect instead of navigate, as navigate doesn't update the page
   *
   * @param id The course id
   * @param token The user token
   */
  const clickDelete = async () => {
    if (confirm("Você tem certeza?")) {
      // Checks what type of delete is being made
      switch (deleteType) {
        case "course":
          deleteCourse(id, token);
          break;

        case "section":
          deleteSection(id, token);
          break;

        case "lecture":
          break;

        case "exercise":
          break;

        default:
          break;
      }
    }
  };

  /**
   * Delete the course and redirect to courses page
   *
   * @param id Course id
   * @param token User token
   */
  const deleteCourse = async (id: string | undefined, token: string) => {
    setRes(await CourseServices.deleteCourse(id, token));

    // const responseFile = await StorageService.deleteFile(ImgId, token);

    if (statusFeedback()) {
      navigate("/courses");
    }
  };

  /**
   * Delete the Section and redirect to the parent course page
   *
   * @param id Section id
   * @param token User token
   */
  const deleteSection = async (id: string | undefined, token: string) => {
    setRes(await SectionServices.deleteSection(id, token));

    if (statusFeedback()) {
      navigate("/courses"); // Should be the parent course page
    }
  };

  /**
   * Display a toast message based on the response status code
   *
   * @param status The status code of the response
   */
  const statusFeedback = () => {
    if (res.status >= 200 && res.status <= 299) {
      addNotification("Excluído");
      {
        /* Course deleted */
      }
      return true;
    } else if (res.status >= 400 && res.status <= 599) {
      toast.error(
        `(${res.status}, ${res.statusText}) while attempting to delete course`
      );
      return false;
    }
  };

  return (
    <button
      type="button"
      onClick={clickDelete}
      className="left-0 std-button bg-warning hover:bg-red-800 ml-4"
    >
      Excluir
    </button>
  );
};
