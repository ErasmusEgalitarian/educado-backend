import Icon from "@mdi/react";
import { mdiChevronDown, mdiPlus } from "@mdi/js";

// Icons

// Demo datas
const courses = [
  {
    id: 0,
    name: "Reading 1",
  },
  {
    id: 1,
    name: "Finance 2",
  },
];

const course_lectures = [
  {
    id: 0,
    name: "Variables",
  },
  {
    id: 1,
    name: "Constant",
  },
  {
    id: 2,
    name: "Functions",
  },
  {
    id: 3,
    name: "Quiz 1",
  },
];

export const OptionsBar = () => {
  return (
    <div className="flex flex-col w-56 border-r border-gray-300">
      <button className="relative text-sm focus:outline-hidden group">
        <div className="flex items-center justify-between w-full h-16 px-4 border-b border-gray-300 hover:bg-gray-300">
          <span className="font-medium">Dropdown</span>
          <Icon
            path={mdiChevronDown}
            size={0.9}
            color="currentColor"
            className="w-4 h-4"
          />
        </div>
        <div className="absolute z-10 flex-col items-start hidden w-full pb-1 bg-white shadow-lg group-focus:flex">
          {courses.map((option, key) => {
            return (
              <a
                className="w-full px-4 py-2 text-left hover:bg-gray-300"
                href="#"
                key={key}
              >
                {option.name}
              </a>
            );
          })}
        </div>
      </button>
      <div className="flex flex-col grow p-4 overflow-auto">
        {course_lectures.map((lecture, key) => {
          return (
            <a
              key={key}
              className="flex items-center shrink-0 h-10 px-2 text-sm font-medium rounded-sm hover:bg-gray-300"
              href="#"
            >
              <span className="leading-none">
                {key + 1} - {lecture.name}
              </span>
            </a>
          );
        })}

        <a
          className="flex items-center shrink-0 h-10 px-3 mt-auto text-sm font-medium bg-gray-200 rounded-sm hover:bg-gray-300"
          href="#"
        >
          <Icon
            path={mdiPlus}
            size={1}
            color="currentColor"
            className="h-5 w-5"
          />
          <span className="ml-2 leading-none">New Item</span>
        </a>
      </div>
    </div>
  );
};
