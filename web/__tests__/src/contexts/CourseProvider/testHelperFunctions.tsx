import {
  useCourse,
  useSections,
  useLectures,
  useExercises,
  useMedia,
} from "@/course/context/courseStore";

export const useCombinedHooks = () => {
  const sectionsHook = useSections();
  const courseHook = useCourse();
  const lecturesHook = useLectures();
  const exercisesHook = useExercises();
  const mediaHook = useMedia();
  return { sectionsHook, courseHook, lecturesHook, exercisesHook, mediaHook };
};
