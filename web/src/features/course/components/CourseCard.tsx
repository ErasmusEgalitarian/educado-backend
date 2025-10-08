import { Icon } from "@mdi/react";

import { ApiCourseCourseDocument } from "@/shared/api";
import { Badge } from "@/shared/components/shadcn/badge";
import { Button } from "@/shared/components/shadcn/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/shadcn/card";

import StarRating from "../../../shared/components/StarRating";
import categories from "../types/courseCategories";

/**
 * Displays a course in a card format
 *
 * @param {Course} course The course to be displayed
 * @returns HTML Element
 */
export const CourseCard = ({ course }: { course: ApiCourseCourseDocument }) => {
  const maxTitleLength = 20;
  const maxDescLength = 40;

  return (
    <Card>
      <CardHeader className="w-full max-w-sm flex flex-col justify-between h-full">
        <div className="flex items-center gap-2 text-[#28363E]">
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
            <path
              d="M20 18H0V0H2V16H4V14H8V16H10V13H14V16H16V14H20V18ZM16 11H20V13H16V11ZM10 3H14V6H10V3ZM14 12H10V7H14V12ZM4 7H8V9H4V7ZM8 13H4V10H8V13Z"
              fill="currentColor"
            />
          </svg>
          <CardTitle>
            {course.title.slice(0, maxTitleLength) +
              (course.title.length > maxTitleLength ? "..." : "")}
          </CardTitle>
        </div>
        <div className="w-full border-t border-[#C1CFD7] my-2 mx-auto" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {/* <Badge
            variant="outline"
            className="flex items-center gap-1 text-left max-w-40 truncate"
          >
            <Icon
              className="w-5 shrink-0"
              path={
                categories[course.category]?.icon ?? categories.default.icon
              }
            />
            <span className="truncate">
              {categories[course.category]?.br ?? course.category}
            </span>
          </Badge> */}

          <Icon
            className="w-5 shrink-0 text-[#628397]"
            path={categories[course.category]?.icon ?? categories.default.icon}
          />
          <span className="w-40 text-[#628397] truncate">
            {categories[course.category]?.br ?? course.category}
          </span>

          <p className="text-sm text-gray-600">
            {course.estimatedHours != null ? course.estimatedHours : "?"} horas
          </p>
        </div>

        <div className="flex items-center">
          <div className="w-25 text-[#F1CC4F]">
            <StarRating rating={course.rating} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end items-center">
        <Button
          variant="link"
          onClick={() =>
            (window.location.href = `/courses/manager/${course._id}/0`)
          }
          className="text-[#246670] decoration-[#246670] underline"
        >
          Editar
        </Button>
        <Button variant="secondary">Visualizar</Button>
      </CardFooter>
    </Card>
  );
};
