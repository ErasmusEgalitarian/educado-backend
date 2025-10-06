import { Icon } from "@mdi/react";
import { BsClockFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";

import StarRating from "../../../shared/components/StarRating";
import { Course } from "../types/Course";
import categories from "../types/courseCategories";

/**
 * Displays a course in a card format
 *
 * @param {Course} course The course to be displayed
 * @returns HTML Element
 */
export const CourseGridCard = ({ course }: { course: Course }) => {
  const { t } = useTranslation();
  const maxTitleLength = 20;
  //Only load the picture, when the picture is loaded

  return (
    <div className="shadow-course-card border rounded-lg h-full w-full m-auto">
      {/* Card content */}
      <div className="bg-white w-full">
        <div className="p-4">
          {/* Card title */}
          <div className="flex items-center gap-5 border-b border-lightgray pb-2 my-5">
            <svg
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 18H0V0H2V16H4V14H8V16H10V13H14V16H16V14H20V18ZM16 11H20V13H16V11ZM10 3H14V6H10V3ZM14 12H10V7H14V12ZM4 7H8V9H4V7ZM8 13H4V10H8V13Z"
                fill="#383838"
              />
            </svg>

            <h2 className="text-gray-800 text-xl font-medium">
              {course.title.slice(0, maxTitleLength) +
                (course.title.length > maxTitleLength ? "..." : "")}
            </h2>
          </div>

          {/* Card info */}
          <div className="flex flex-col justify-between mt-8 text-grayMedium">
            {/* Course category */}
            <div className="flex flex-row gap-5">
              <div className="flex flex-row">
                <Icon
                  path={
                    categories[course.category]?.icon ?? categories.default.icon
                  }
                  className="w-4 mr-1"
                />
                <p>{categories[course.category]?.br ?? course.category}</p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <BsClockFill />
                <p>
                  {course.estimatedHours != null ? course.estimatedHours : "?"}{" "}
                  {t('courses.hours')}
                </p>
              </div>
            </div>

            {/* Course rating */}
            <div className="w-32">
              <StarRating rating={course.rating ?? 0} />
            </div>

            <div className="flex gap-3 justify-end mt-5">
              <button
                onClick={() =>
                  (window.location.href = `/courses/manager/${course._id}/0`)
                }
                className="text-primary text-xs font-bold"
              >
                <span className="border-b border-primary">{t('common.edit')}</span>
              </button>
              <button className="btn btn-secondary">
                {t('common.view')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
