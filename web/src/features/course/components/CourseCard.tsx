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
import { Badge } from "@/shared/components/shadcn/badge";

import { Icon } from "@mdi/react";
import StarRating from "../../../shared/components/StarRating";
import categories from "../types/courseCategories";
import { Course } from "../types/Course";

/**
 * Displays a course in a card format
 *
 * @param {Course} course The course to be displayed
 * @returns HTML Element
 */
export const CourseCard = ({ course }: { course: Course }) => {
  const maxTitleLength = 20;
  const maxDescLength = 40;
  return (
    <Card className="w-full max-w-sm flex flex-col justify-between h-full">
      <div>
        <CardHeader>
          <div className="flex items-center gap-2">
            <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
              <path
                d="M20 18H0V0H2V16H4V14H8V16H10V13H14V16H16V14H20V18ZM16 11H20V13H16V11ZM10 3H14V6H10V3ZM14 12H10V7H14V12ZM4 7H8V9H4V7ZM8 13H4V10H8V13Z"
                fill="#383838"
              />
            </svg>
            <CardTitle className="truncate">
              {course.title.slice(0, maxTitleLength) +
                (course.title.length > maxTitleLength ? "..." : "")}
            </CardTitle>
          </div>

          <CardDescription className="flex flex-col gap-1">
            <Badge
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
            </Badge>
            <p>
              {course.estimatedHours != null ? course.estimatedHours : "?"}{" "}
              horas
            </p>
          </CardDescription>
        </CardHeader>

        <CardContent className="mb-2">
          {course.description.slice(0, maxDescLength) +
            (course.description.length > maxDescLength ? "..." : "")}
        </CardContent>
      </div>

      <CardFooter className="flex flex-col gap-2 items-center mt-auto">
        <div className="flex gap-2">
          <Button
            effect="hoverUnderline"
            variant="link"
            onClick={() =>
              (window.location.href = `/courses/manager/${course._id}/0`)
            }
          >
            Editar
          </Button>
          <Button effect="hoverUnderline" variant="link">
            Visualizar
          </Button>
        </div>
        <div className="flex items-center">
          <div className="w-32">
            <StarRating rating={course.rating ?? 0} />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
