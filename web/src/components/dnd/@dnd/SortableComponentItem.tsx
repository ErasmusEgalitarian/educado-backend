import { BACKEND_URL } from "../../../helpers/environment";
import { useState, useEffect } from "react";

// Hooks
import { getUserToken } from "../../../helpers/userInfo";
import { useApi } from "@hooks/useAPI";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSections, useLectures, useExercises } from "@contexts/courseStore";


// icons
import { mdiDeleteCircle, mdiDotsVerticalCircle } from "@mdi/js";
import { Icon } from "@mdi/react";
import { mdiDraw, mdiPencilCircle, mdiTextBox, mdiVideo } from "@mdi/js";

import LectureService from "@services/lecture.services";
import ExerciseServices from "@services/exercise.services";

//pop-ups

import { EditLecture } from "../../EditLecturePopUp";
import { EditExercise } from "../../Exercise/EditExercisePopUp";

import { Component, Exercise, Lecture } from "@interfaces/Course";

interface Props {
  component: Component;
  sid: string;
}

export function SortableComponentItem({ component, sid }: Props) {
  const token = getUserToken();
  const isLectureComponent = component.compType === "lecture";
  const { loadLectureToCache, getCachedLecture} = useLectures();
  const { loadExerciseToCache, getCachedExercise} = useExercises();
  const [data, setData] = useState<Exercise | Lecture | null>(isLectureComponent ? getCachedLecture(component.compId) : getCachedExercise(component.compId));
  const [newTitle, setNewTitle] = useState("");
  const { deleteCachedSectionComponent } = useSections();

  // Fetch the section data from the server.
  //  const { data, error } = useSWR(
  //     token ? [cid, map.get(cid), token] : null,
  //     ComponentService.getComponentDetail
  //   );
  
  const isLectureData = (data: Exercise | Lecture | null): data is Lecture => {
    return (data as Lecture)?.contentType !== undefined;
  }
  
  const { call: getComponentDetails, isLoading: fetchLoading} = useApi(isLectureComponent ? LectureService.getLectureDetail : ExerciseServices.getExerciseDetail);

  useEffect(() => {
      if (data || token === "") return;
      const fetchData = async () => {
        const url = `${BACKEND_URL}/api/${component.compType}s/${component.compId}`;
        try {
          const res = await getComponentDetails(url, token);
          setData(res);
          if (component.compType === "lecture") {
            loadLectureToCache(res);
          } else {
            loadExerciseToCache(res);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
  }, [token]);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: component.compId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleComponentDeletion = async () => {
    if (confirm("Tem certeza de que deseja excluir esse componente?")) {
      deleteCachedSectionComponent(sid, component.compId); // removes comp from section
    }   
  }

  

  const handleEdit = (newTitle: string) => {
    setData((prevData: Exercise | Lecture | null) => {
      if (!prevData) return prevData;
      return { ...prevData, title: newTitle } as Exercise | Lecture;
    });
  }
  const getIcon = () => {
    if (isLectureData(data)) {
      if ((data as Lecture).contentType === "video") {
        return <Icon path={mdiVideo} size={1} />;
      }
      return <Icon path={mdiTextBox} size={1} />;
    }
    
    return <Icon path={mdiDraw} size={1} />;     
  };

  useEffect(() => {
    if (data) {
      setNewTitle(data.title);
    }
  }, [data]);

  //If data is not found yet, show a loading message.
  if (!data || fetchLoading) {
    return <p>Loading...</p>;
  }

  //Else show the sections.
  return (
    <div className="w-full rounded border bg-secondary rounded-lg mb-4">
      <div className="flex justify-between ">
        <div className="flex space-x-2 text-primary items-center ml-5 text-right">
          {getIcon()}
          <p className="font-semibold">{newTitle}</p>
        </div>

        <div className="flex text-primary mr-4">
          {/**edit a lecture or exercise and pencil icon*/}
          <label
            htmlFor={component.compType + "-edit-" + data._id}
            className="btn btn-ghost hover:bg-transparent hover:text-primaryHover p-0"
          >
            <Icon path={mdiPencilCircle} size={1.2}></Icon>
          </label>

            <input
              type="checkbox"
              id={component.compType + "-edit-" + data._id}
              className="modal-toggle"
            />
            {isLectureData(data) ? (
              <EditLecture lecture={data} handleEdit={handleEdit} />
            ) : (
              <EditExercise exercise={data} handleEdit={handleEdit} />
            )}

            {/**delete a lecture or exercise and trash icon*/}
            <div
              className="btn btn-ghost hover:bg-transparent hover:text-primaryHover"
              onClick={() => handleComponentDeletion()}
            >
              <Icon path={mdiDeleteCircle} size={1.2}></Icon>
            </div>

            <div
              className=""
              ref={setNodeRef}
              style={style}
              {...attributes}
              {...listeners}
            >
              {/**Move a lecture or exercise and "move" icon*/}
              <div className="btn btn-ghost hover:bg-transparent hover:text-primaryHover">
                <Icon path={mdiDotsVerticalCircle} size={1.2}></Icon>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
