import { useNavigate } from "react-router-dom";

import { useNotifications } from "@components/notification/NotificationContext";
import { useMedia, useCourse, useSections } from "@contexts/courseStore";
import { getUserToken } from "@helpers/userInfo";
import { SubmitFunction } from "@interfaces/Course";
import { prepareFormData } from "@utilities/formDataUtils";

export const useCourseManagingHelper = () => {
  const { addNotification } = useNotifications();
  const { addMediaToCache, updateMedia, getMedia } = useMedia();
  const { course, updateCourseField, getFormattedCourse } = useCourse();
  const { sections, getCachedSection } = useSections();
  const token = getUserToken();
  const navigate = useNavigate();
  const coverImg = getMedia(course._id);

  const handleDialogEvent = (
    message: string,
    onConfirm: () => void,
    dialogTitle: string,
    setDialogTitle: (title: string) => void,
    setDialogMessage: (message: string) => void,
    setDialogConfirm: (confirm: () => void) => void,
    setShowDialog: (show: boolean) => void,
  ) => {
    setDialogTitle(dialogTitle);
    setDialogMessage(message);
    setDialogConfirm(() => onConfirm);
    setShowDialog(true);
  };

  const handleCourseImageUpload = (
    file: File | null,
    courseImg: File | null,
    courseId: string,
  ) => {
    if (!file) return;
    const newMedia = { id: courseId, file: file, parentType: "c" };
    if (!courseImg) {
      addMediaToCache(newMedia);
      updateCourseField({ coverImg: courseId + "_c" });
    } else {
      updateMedia(newMedia);
    }
  };

  const handleSaveAsDraft = async (
    submitFunction: SubmitFunction,
  ): Promise<void> => {
    handleCourseSubmit(submitFunction);
  };

  const handlePublishCourse = async (
    submitFunction: SubmitFunction,
  ): Promise<void> => {
    handleCourseSubmit(submitFunction, true);
  };

  const handleCourseSubmit = async (
    submitFunction: SubmitFunction,
    publish = false,
  ): Promise<void> => {
    try {
      const updatedCourse = getFormattedCourse();
      if (publish) updatedCourse.courseInfo.status = "published";
      const formData = prepareFormData(updatedCourse);
      await submitFunction(formData, token);
      onSuccessfulSubmit();
    } catch (err) {
      console.error(err);
    }
  };

  const onSuccessfulSubmit = () => {
    navigate("/courses");
    addNotification("Seções salvas com sucesso!");
  };

  const checkAllSectionsGotComponents = () => {
    const emptySections = [];
    for (const sec of sections) {
      if (sec.components.length === 0) {
        addNotification(`Secção: "${sec.title}", está vazia!`);
        emptySections.push(sec);
      }
    }
    return emptySections.length === 0;
  };

  const someSectionMissingRequiredFields = () => {
    return course.sections.some((section) => {
      const secInfo = getCachedSection(section);
      return secInfo?.title === "" || secInfo?.description === "";
    });
  };

  const courseMissingRequiredFields = () => {
    const errors = {
      title: course.title === "",
      description: course.description === "",
      category: course.category === "",
      difficulty: course.difficulty === 0,
      coverimg: !coverImg,
    };

    const isMissingRequiredFields = Object.values(errors).some(
      (error) => error,
    );
    return { errors, isMissingRequiredFields };
  };

  return {
    handleDialogEvent,
    handleCourseImageUpload,
    handleSaveAsDraft,
    handlePublishCourse,
    checkAllSectionsGotComponents,
    someSectionMissingRequiredFields,
    courseMissingRequiredFields,
  };
};
