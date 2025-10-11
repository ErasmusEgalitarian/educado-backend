import {
  mdiAccountOutline,
  mdiCompassOutline,
  mdiHomeOutline,
  mdiRobotOutline,
  mdiChevronLeft,
  mdiBookOpenBlankVariantOutline,
  mdiPlay,
  mdiNotebookEditOutline,
} from "@mdi/js";
import { Icon } from "@mdi/react";
import { useState } from "react";

import { useSections } from "@/course/context/courseStore";

import { Course, Exercise, Lecture } from "../types/Course";

import PhoneCourseSection from "./PhoneCourseSection";

interface PhoneExercisesAndLecturesProps {
  course: Course;
  selectedSection: { id: string; title: string };
}

const PhoneExercisesAndLectures: React.FC<PhoneExercisesAndLecturesProps> = ({
  course,
  selectedSection,
}) => {
  const { getAllSectionExercises, getAllSectionLectures } = useSections();

  const [lectureData] = useState<Lecture[]>(
    getAllSectionLectures(selectedSection.id),
  );
  const [exerciseData] = useState<Exercise[]>(
    getAllSectionExercises(selectedSection.id),
  );

  const [showCourseSection, setShowCourseSection] = useState(false);

  const uniqueLectures = new Set<string>();
  const uniqueExercises = new Set<string>();

  if (showCourseSection) {
    return <PhoneCourseSection />;
  }

  return (
    <div className="flex flex-col h-screen justify-end bg-[#F2F9FB] w-full">
      <div className="flex flex-row justify-center mt-8">
        <button
          className="ml-4"
          onClick={() => {
            setShowCourseSection(true);
          }}
        >
          <Icon path={mdiChevronLeft} size={1} />
        </button>
        <h2 className="text-lg mx-auto">{course.title}</h2>
        <div className="w-8" />
      </div>

      <div className="ml-6 mt-2">
        <h2 className="font-bold text-2xl">{selectedSection.title}</h2>
      </div>

      <div className="flex justify-center mt-2">
        <hr className="w-5/6" />
      </div>

      {lectureData.map((lecture: Lecture) => {
        if (!uniqueLectures.has(lecture._id)) {
          uniqueLectures.add(lecture._id);
          return (
            <button
              key={lecture._id}
              className="flex flex-row justify-between items-center ml-5 mr-5 mt-4 border-2 border-gray text-black h-14 rounded-lg text-xs cursor-default"
            >
              <div className="flex flex-col items-start">
                <h2 className="ml-3 mt-1 font-bold">{lecture.title}</h2>
                <h2 className="ml-3 mt-1 text-gray-600 text-[9px]">
                  Não iniciado
                </h2>
              </div>
              <div className="flex mr-3 bg-[#166276] rounded-2xl w-7 h-7 justify-center items-center">
                <Icon
                  path={
                    lecture.contentType === "video"
                      ? mdiPlay
                      : mdiNotebookEditOutline
                  }
                  size={lecture.contentType === "video" ? 0.9 : 0.7}
                  className="text-white"
                />
              </div>
            </button>
          );
        }
        return null;
      })}

      {exerciseData.map((exercise: Exercise) => {
        if (!uniqueExercises.has(exercise._id)) {
          uniqueExercises.add(exercise._id);
          return (
            <button
              key={exercise._id}
              className="flex flex-row justify-between items-center ml-5 mr-5 mt-4 border-2 border-gray text-black h-14 rounded-lg text-xs cursor-default"
            >
              <div className="flex flex-col items-start ml-3">
                <h2 className="mt-1 font-bold">{exercise.title}</h2>
                <h2 className="mt-1 text-gray-600 text-[9px]">Não iniciado</h2>
              </div>
              <div className="flex mr-3 bg-[#166276] rounded-2xl w-7 h-7 justify-center items-center">
                <Icon
                  path={mdiBookOpenBlankVariantOutline}
                  size={0.65}
                  className="text-white"
                />
              </div>
            </button>
          );
        }
        return null;
      })}

      <div className="grow" />
      <nav
        className="bg-white p-1 shadow-lg"
        style={{
          boxShadow:
            "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        <ul className="flex space-x-2 text-[10px]">
          <li className="flex-1 bg-[#166276] text-white p-1 rounded-xl flex flex-col items-center font-bold">
            <Icon path={mdiHomeOutline} size={0.6} color="white" />
            <span className="mt-1">Central</span>
          </li>
          <li className="flex-1 text-[#AAB4BA] p-1 flex flex-col items-center">
            <Icon path={mdiCompassOutline} size={0.6} color="#AAB4BA" />
            <span className="mt-1">Explore</span>
          </li>
          <li className="flex-1 text-[#AAB4BA] p-1 flex flex-col items-center">
            <Icon path={mdiRobotOutline} size={0.6} color="#AAB4BA" />
            <span className="mt-1">Edu</span>
          </li>
          <li className="flex-1 text-[#AAB4BA] p-1 flex flex-col items-center">
            <Icon path={mdiAccountOutline} size={0.6} color="#AAB4BA" />
            <span className="mt-1">Perfil</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default PhoneExercisesAndLectures;
