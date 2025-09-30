import React, { createContext, useContext, useState, useEffect } from "react";

import { formatCourse } from "@/course/lib/courseStoreHelper";

import {
  Course,
  Section,
  Component,
  Lecture,
  Media,
  Exercise,
  FormattedCourse,
} from "../types/Course";

// Define the context type
interface CourseContextProps {
  course: Course;
  getFormattedCourse: () => FormattedCourse;
  updateCourse: (course: Course) => void;
  updateCourseField: (fieldChange: Partial<Course>) => void;
  updateCachedCourseSections: (sections: string[]) => void;
  sections: Section[];
  createNewSection: () => Section;
  loadSectionToCache: (section: Section) => Section | null;
  getCachedSection: (sid: string) => Section | null;
  updateCachedSection: (fieldChange: Partial<Section>, sid: string) => void;
  deleteCachedSection: (sid: string) => void;
  updateCachedSectionComponents: (
    sectionId: string,
    components: Component[]
  ) => void;
  deleteCachedSectionComponent: (sectionId: string, compId: string) => void;
  addCachedSectionComponent: (
    sectionId: string,
    component: Component
  ) => Component | null;
  getAllSectionLectures: (sid: string) => Lecture[];
  getAllSectionExercises: (sid: string) => Exercise[];
  lectures: Lecture[];
  getCachedLecture: (lid: string) => Lecture | null;
  updateCachedLecture: (lecture: Lecture) => void;
  deleteCachedLecture: (lid: string) => void;
  loadLectureToCache: (lecture: Lecture) => Lecture | null;
  addLectureToCache: (lecture: Lecture) => Lecture;
  exercises: Exercise[];
  getCachedExercise: (eid: string) => Exercise | null;
  updateCachedExercise: (exercise: Exercise) => void;
  deleteCachedExercise: (eid: string) => void;
  loadExerciseToCache: (exercise: Exercise) => Exercise | null;
  addExerciseToCache: (exercise: Exercise) => Exercise;
  media: Media[];
  addMediaToCache: (media: Media) => void;
  getMedia: (mid: string) => File | null;
  updateMedia: (media: Media) => Media | null;
  deleteMedia: (mid: string) => void;
  getPreviewCourseImg: () => string | null;
}

interface CourseProviderProps {
  children: React.ReactNode;
}

// Create context with initial value
const CourseContext = createContext<CourseContextProps>({
  course: {} as Course,
  getFormattedCourse: () => ({}) as FormattedCourse,
  updateCourse: () => {},
  updateCourseField: () => {},
  updateCachedCourseSections: () => {},
  sections: [] as Section[],
  createNewSection: () => ({
    _id: "",
    title: "",
    description: "",
    totalPoints: 0,
    parentCourse: "",
    components: [],
    __v: 0,
  }),
  loadSectionToCache: () => ({}) as Section,
  getCachedSection: () => null,
  updateCachedSection: () => {},
  deleteCachedSection: () => {},
  updateCachedSectionComponents: () => {},
  deleteCachedSectionComponent: () => {},
  addCachedSectionComponent: () => ({}) as Component,
  getAllSectionLectures: () => [],
  getAllSectionExercises: () => [],
  lectures: [],
  getCachedLecture: () => null,
  updateCachedLecture: () => {},
  deleteCachedLecture: () => {},
  loadLectureToCache: () => ({}) as Lecture,
  addLectureToCache: () => ({}) as Lecture,
  exercises: [],
  getCachedExercise: () => null,
  updateCachedExercise: () => {},
  deleteCachedExercise: () => {},
  loadExerciseToCache: () => ({}) as Exercise,
  addExerciseToCache: () => ({}) as Exercise,
  media: [],
  addMediaToCache: () => {},
  getMedia: () => null,
  updateMedia: () => ({}) as Media,
  deleteMedia: () => {},
  getPreviewCourseImg: () => null,
});

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [course, setCourse] = useState<Course>({
    title: "",
    description: "",
    category: "personal finance",
    difficulty: 1,
    status: "draft",
    estimatedHours: 0,
    sections: [],
    coverImg: "",
    _id: "0",
    creator: "",
  });
  const [sections, setSections] = useState<Section[]>([] as Section[]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [idMaker, setIdMaker] = useState({ section: 0, component: 0 });

  useEffect(() => {
    return () => {};
  }, []);

  const getFormattedCourse = () => {
    const formattedCourse: FormattedCourse = formatCourse(
      course,
      sections,
      lectures,
      exercises,
      media
    );
    return formattedCourse;
  };

  const updateCourse = (newCourse: Course) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      ...newCourse,
    }));
  };

  const updateCourseField = (fieldChange: Partial<Course>) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      ...fieldChange,
    }));
  };

  const updateCachedCourseSections = (newSections: string[]) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      sections: newSections ?? [],
    }));
  };

  const createNewSection = () => {
    const newId = idMaker.section + 1;
    setIdMaker((prevIdMaker) => ({
      ...prevIdMaker,
      section: prevIdMaker.section + 1,
    }));
    const newSection = {
      _id: newId.toString(),
      title: "",
      description: "",
      totalPoints: 0,
      parentCourse: course._id ?? "0",
      components: [],
      __v: 0,
    };
    setSections((prevSections) => [...prevSections, newSection]);
    setCourse((prevCourse) => {
      return {
        ...prevCourse,
        sections: [...prevCourse.sections, newSection._id],
      };
    });
    return newSection;
  };

  const loadSectionToCache = (newSection: Section) => {
    if (sections.find((section) => section._id === newSection._id)) return null;
    setSections((prevSections) => [...prevSections, newSection]);
    return newSection;
  };

  const getCachedSection = (sid: string) => {
    return sections.find((section) => section._id === sid) || null;
  };

  const updateCachedSection = (fieldChange: Partial<Section>, sid: string) => {
    setSections((prevSections) => {
      const index = prevSections.findIndex((s) => s._id === sid);
      if (index === -1) return prevSections;
      const updatedSection = { ...prevSections[index], ...fieldChange };
      const updatedSections = [...prevSections];
      updatedSections[index] = updatedSection;
      return updatedSections;
    });
  };

  const updateCachedSectionComponents = (
    sectionId: string,
    adjustedComponents: Component[]
  ) => {
    setSections((prevSections) => {
      const index = prevSections.findIndex((s) => s._id === sectionId);
      if (index === -1) return prevSections;

      // Create a new array with the updated section
      const newSections = [...prevSections];
      newSections[index] = {
        ...newSections[index],
        components: adjustedComponents,
      };

      return newSections;
    });
  };

  const deleteCachedSectionComponent = (sectionId: string, compId: string) => {
    setSections((prevSections) => {
      const sectionIndex = prevSections.findIndex((s) => s._id === sectionId);
      if (sectionIndex === -1) return prevSections;

      const updatedComponents = prevSections[sectionIndex].components.filter(
        (component) => {
          if (component.compId !== compId) return true;

          if (component.compType === "lecture") {
            deleteCachedLecture(compId);
          } else if (component.compType === "exercise") {
            deleteCachedExercise(compId);
          }
          return false;
        }
      );
      const updatedSections = [...prevSections];
      updatedSections[sectionIndex] = {
        ...prevSections[sectionIndex],
        components: updatedComponents,
      };
      return updatedSections;
    });
  };

  const addCachedSectionComponent = (
    sectionId: string,
    component: Component
  ) => {
    const newId = idMaker.component + 1;
    setIdMaker((prevIdMaker) => ({ ...prevIdMaker, component: newId }));
    component._id = newId.toString();

    const sectionIndex = sections.findIndex((s) => s._id === sectionId);

    if (sectionIndex === -1) return null;
    setSections((prevSections) => {
      const updatedComponents = [
        ...prevSections[sectionIndex].components,
        component,
      ];
      const updatedSections = [...prevSections];
      updatedSections[sectionIndex] = {
        ...prevSections[sectionIndex],
        components: updatedComponents,
      };

      return updatedSections;
    });

    return component;
  };

  const deleteCachedSection = (sid: string) => {
    setExercises((prevExercises) =>
      prevExercises.filter((exercise) => exercise.parentSection !== sid)
    );
    setLectures((prevLectures) => {
      return prevLectures.filter((lecture) => {
        if (lecture.parentSection !== sid) {
          return true;
        }
        if (lecture.contentType === "video") {
          deleteMedia(lecture._id);
        }
        return false;
      });
    });
    setSections((prevSections) =>
      prevSections.filter((section) => section._id !== sid)
    );
    setCourse((prevCourse) => {
      return {
        ...prevCourse,
        sections: prevCourse.sections?.filter((sectionId) => sectionId !== sid),
      };
    });
  };

  const getAllSectionLectures = (sid: string) => {
    return lectures.filter((lecture) => lecture.parentSection === sid);
  };

  const getAllSectionExercises = (sid: string) => {
    return exercises.filter((exercise) => exercise.parentSection === sid);
  };

  const getCachedExercise = (eid: string) => {
    return exercises.find((exercise) => exercise._id === eid) || null;
  };

  const updateCachedLecture = (newLecture: Lecture) => {
    setLectures((prevLectures) => {
      const index = prevLectures.findIndex(
        (lecture) => lecture._id === newLecture._id
      );
      const updatedLectures = [...prevLectures];
      updatedLectures[index] = newLecture;
      return updatedLectures;
    });
  };

  const loadLectureToCache = (newLecture: Lecture) => {
    if (lectures.find((lecture) => lecture._id === newLecture._id)) return null;
    setLectures((prevLectures) => [...prevLectures, newLecture]);
    return newLecture;
  };

  const deleteCachedLecture = (lid: string) => {
    setLectures((prevLectures) =>
      prevLectures.filter((lecture) => {
        if (lecture._id === lid && lecture.contentType === "video") {
          deleteMedia(lid);
        }
        return lecture._id !== lid;
      })
    );
  };

  const getCachedLecture = (lid: string) => {
    return lectures.find((lecture) => lecture._id === lid) || null;
  };

  const addLectureToCache = (newLecture: Lecture) => {
    const newId = idMaker.component + 1;
    setIdMaker((prevIdMaker) => ({ ...prevIdMaker, component: newId }));
    newLecture._id = newId.toString();
    setLectures((prevLectures) => [...prevLectures, newLecture]);
    return newLecture;
  };

  const updateCachedExercise = (newExercise: Exercise) => {
    setExercises((prevExercises) => {
      const index = prevExercises.findIndex(
        (exercise) => exercise._id === newExercise._id
      );
      const updatedExercises = [...prevExercises];
      updatedExercises[index] = newExercise;
      return updatedExercises;
    });
  };

  const loadExerciseToCache = (newExercise: Exercise) => {
    if (exercises.find((exercise) => exercise._id === newExercise._id))
      return null;
    setExercises((prevExercises) => [...prevExercises, newExercise]);
    return newExercise;
  };

  const deleteCachedExercise = (eid: string) => {
    setExercises((prevExercises) =>
      prevExercises.filter((exercise) => exercise._id !== eid)
    );
  };

  const addExerciseToCache = (newExercise: Exercise) => {
    const newId = idMaker.component + 1;
    setIdMaker((prevIdMaker) => ({ ...prevIdMaker, component: newId }));
    newExercise._id = newId.toString();
    setExercises((prevExercises) => [...prevExercises, newExercise]);
    return newExercise;
  };

  const addMediaToCache = (newMedia: Media) => {
    if (media.find((media) => media.id === newMedia.id)) return;
    setMedia((prevMedia) => [...prevMedia, newMedia]);
  };

  const getMedia = (mid: string) => {
    const mediaItem = media.find((media) => media.id === mid);
    return mediaItem ? mediaItem.file : null;
  };

  const deleteMedia = (mid: string) => {
    setMedia((prevMedia) => prevMedia.filter((media) => media.id !== mid));
  };

  const updateMedia = (newMedia: Media) => {
    const index = media.findIndex((media) => media.id === newMedia.id);
    if (index === -1) return null;
    const updatedMedia = [...media];
    updatedMedia[index] = newMedia;
    setMedia(updatedMedia);
    return newMedia;
  };

  const getPreviewCourseImg = () => {
    const coverImg = getMedia(course._id);
    return coverImg ? URL.createObjectURL(coverImg) : null;
  };

  const value = {
    course,
    getFormattedCourse,
    updateCourse,
    updateCourseField,
    updateCachedCourseSections,
    sections,
    createNewSection,
    loadSectionToCache,
    getCachedSection,
    updateCachedSection,
    deleteCachedSection,
    updateCachedSectionComponents,
    deleteCachedSectionComponent,
    addCachedSectionComponent,
    getAllSectionExercises,
    getAllSectionLectures,
    lectures,
    getCachedLecture,
    updateCachedLecture,
    deleteCachedLecture,
    addLectureToCache,
    loadLectureToCache,
    exercises,
    getCachedExercise,
    updateCachedExercise,
    deleteCachedExercise,
    addExerciseToCache,
    loadExerciseToCache,
    media,
    addMediaToCache,
    getMedia,
    updateMedia,
    deleteMedia,
    getPreviewCourseImg,
  };

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
};

// Custom hooks to access specific parts of the state
export const useCourse = () => {
  const context = useContext(CourseContext);
  return {
    course: context.course,
    getFormattedCourse: context.getFormattedCourse,
    updateCourse: context.updateCourse,
    updateCourseField: context.updateCourseField,
    updateCachedCourseSections: context.updateCachedCourseSections,
  };
};

export const useSections = () => {
  const context = useContext(CourseContext);
  return {
    sections: context.sections,
    createNewSection: context.createNewSection,
    loadSectionToCache: context.loadSectionToCache,
    getCachedSection: context.getCachedSection,
    updateCachedSection: context.updateCachedSection,
    deleteCachedSection: context.deleteCachedSection,
    updateCachedSectionComponents: context.updateCachedSectionComponents,
    deleteCachedSectionComponent: context.deleteCachedSectionComponent,
    addCachedSectionComponent: context.addCachedSectionComponent,
    getAllSectionLectures: context.getAllSectionLectures,
    getAllSectionExercises: context.getAllSectionExercises,
  };
};

export const useLectures = () => {
  const context = useContext(CourseContext);
  return {
    lectures: context.lectures,
    getCachedLecture: context.getCachedLecture,
    updateCachedLecture: context.updateCachedLecture,
    loadLectureToCache: context.loadLectureToCache,
    addLectureToCache: context.addLectureToCache,
  };
};

export const useExercises = () => {
  const context = useContext(CourseContext);
  return {
    exercises: context.exercises,
    getCachedExercise: context.getCachedExercise,
    updateCachedExercise: context.updateCachedExercise,
    loadExerciseToCache: context.loadExerciseToCache,
    addExerciseToCache: context.addExerciseToCache,
  };
};

export const useMedia = () => {
  const context = useContext(CourseContext);
  return {
    media: context.media,
    addMediaToCache: context.addMediaToCache,
    getMedia: context.getMedia,
    updateMedia: context.updateMedia,
    deleteMedia: context.deleteMedia,
    getPreviewCourseImg: context.getPreviewCourseImg,
  };
};
