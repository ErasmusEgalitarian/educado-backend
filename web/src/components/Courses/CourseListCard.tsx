// interfaces
import { Course } from "../../interfaces/Course"
// Components
import { Icon } from '@mdi/react';
import { mdiStar } from "@mdi/js";


/**
 * Displays a course in a card format
 * 
 * @param {Course} course The course to be displayed
 * @returns HTML Element
 */
export const CourseListCard = ({ course }: { course: Course }) => {
  //only load coursecard if ti exists
  if(!course || !course.title) {
    return null;
  }

  return (
    <tr
    key={course._id}
    className="border-b border-gray-300 bg-white text-base font-['Montserrat']"
  >
    <td>
      <div className="flex items-center px-5 py-5">
          <p
            className="text-gray-900 whitespace-no-wrap"
            id="name"
            style={{ wordBreak: "break-word" }}
          >
            {course.title}
          </p>
      </div>
    </td>
    <td style={{ wordBreak: "break-word" }}>
      <p className="text-gray-900 whitespace-no-wrap px-5 py-5">
        {course.category}
      </p>
    </td>
    <td>
      <p
        className="text-gray-900 whitespace-no-wrap px-5 py-5"
      >
        {course.estimatedHours != null ? course.estimatedHours : "?"} horas
      </p>
    </td>
    <td>
      <p className="text-gray-900 px-5 py-5">
        {course.numOfSubscriptions} alunos
      </p>
    </td>
    <td>
        <div className='flex items-center gap-2 text-star px-5 py-5'>
                <Icon path={mdiStar} className="text-star h-4" /> {course.rating}
        </div>
    </td>
    <td>
        <button  onClick={()=>window.location.href = `/courses/manager/${course._id}/0`} className="cursor-pointer">
            <svg stroke="currentColor" fill="#166276" stroke-width="0" viewBox="0 0 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
        </button>
    </td>
  </tr>
  )
}