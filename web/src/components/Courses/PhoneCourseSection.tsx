import {
  mdiAccountOutline,
  mdiCompassOutline,
  mdiHomeOutline,
  mdiRobotOutline,
  mdiChevronLeft,
  mdiChevronRight,
  mdiPlay,
  mdiDownload,
} from "@mdi/js";
import { Icon } from "@mdi/react";
import { useState } from "react";

import { useCourse, useSections } from "@contexts/courseStore";

import { Section } from "../../interfaces/Course";

import PhoneExercisesAndLectures from "./PhoneExercisesAndLectures";
// The interface is currently empty and not used anywhere in the code, so it can be safely deleted.

const PhoneCourseSession: React.FC = () => {
  const { sections } = useSections();
  const { course } = useCourse();
  const [showExercises, setShowExercises] = useState(false);
  const [selectedSection, setSelectedSection] = useState<
    { id: string; title: string } | undefined
  >(undefined);
  const uniqueSections = new Set<string>();
  const progress = 40;

  if (showExercises) {
    return selectedSection ? (
      <PhoneExercisesAndLectures
        course={course}
        selectedSection={selectedSection}
      />
    ) : null;
  }

  return (
    <div className="flex flex-col h-screen justify-end bg-[#F2F9FB] w-full">
      <div className="relative">
        <img
          src="/images/books-glasses.jpg"
          alt=""
          className="h-32 w-full object-cover"
        />
        <button className="absolute top-10 left-4 rounded-2xl bg-[#E4E4E4]">
          <Icon path={mdiChevronLeft} size={1} />
        </button>
        <div className="absolute rounded-xl -bottom-12 left-1/2 transform -translate-x-1/2 bg-white w-[75%] p-3 z-10">
          <div className="flex flex-row justify-between">
            <h1>{course.title}</h1>
            <Icon path={mdiDownload} size={1} className="text-[#166276]" />
          </div>
          <hr className="mt-1" />
          <div className="w-full bg-[#E4F2F5] rounded-full h-2.5 mt-2">
            <div
              className="bg-[#166276] h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <hr className="mt-2" />
          <div className="flex flex-row text-[11px] font-extralight justify-between mt-1">
            <p>🏅80 pontos</p>
            <p>⚡️40% concluído</p>
          </div>
        </div>
      </div>

      <button className="flex flex-row justify-center gap-2 items-center ml-4 mr-4 mt-16 mb-4 bg-[#166276] text-black h-10 rounded-md text-xs cursor-default">
        <span className="text-white text-[14px] font-bold">Começar curso</span>
        <div className="rounded-2xl border border-white">
          <Icon path={mdiPlay} size={0.7} className="text-white" />
        </div>
      </button>

      {sections?.map((section: Section, index: number) => {
        if (index <= 3 && !uniqueSections.has(section._id)) {
          uniqueSections.add(section._id);
          return (
            <button
              key={section._id}
              className="flex flex-row justify-between items-center ml-4 mr-4 mb-3 border border-gray text-black h-14 rounded-lg text-xs cursor-pointer"
              onClick={() => {
                setShowExercises(true);
                setSelectedSection({ id: section._id, title: section.title });
              }}
            >
              <div className="flex flex-col items-start ml-3">
                <h2 className="mt-1 font-bold">{section.title}</h2>
                <h2 className="mt-1 text-gray-600 text-[9px]">
                  0/{section.components.length} Não iniciado
                </h2>
              </div>
              <Icon
                path={mdiChevronRight}
                size={1}
                className="mr-3 text-[#166276]"
              />
            </button>
          );
        }
        return null;
      })}

      <div className="flex justify-center mb-2">
        <h2 className="text-[red] text-[14px] font-bold underline">
          Retirar curso
        </h2>
      </div>

      <div className="flex-grow" />
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

export default PhoneCourseSession;
