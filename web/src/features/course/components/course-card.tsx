/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Course } from "@/shared/api/types.gen";
import { Badge } from "@/shared/components/shadcn/badge";
import { Button } from "@/shared/components/shadcn/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/shadcn/card";

import StarRating from "../../../shared/components/star-rating";

/**
 * Displays a course in a card format
 *
 * @param {Course} course The course to be displayed
 * @returns HTML Element
 */


export const CourseCard = ({ course }: { course: Course }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // --- STATUS: draft vs published -----------------------------------------

  const isPublished = Boolean(course.creator_published_at);

  const statusLabel = isPublished
    ? t("courses.status.published", "Published")
    : t("courses.status.draft", "Draft");

  const handleEdit = () => {
    navigate(`/courses/${course.documentId}/edit`);
  };

  const handleView = () => {
    toast.info("View course feature coming soon!");
  };

  return (
    <Card>
      <CardHeader className="w-full max-w-sm flex flex-col justify-between h-full">
        <div className="flex items-center justify-between gap-2 text-[#28363E] min-w-0">
          {/* left side: icon + title */}

          <div className="flex items-center gap-2 min-w-0">
            <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
              <path
                d="M20 18H0V0H2V16H4V14H8V16H10V13H14V16H16V14H20V18ZM16 11H20V13H16V11ZM10 3H14V6H10V3ZM14 12H10V7H14V12ZM4 7H8V9H4V7ZM8 13H4V10H8V13Z"
                fill="currentColor"
              />
            </svg>

            <CardTitle className="flex-1 min-w-0 truncate" title={course.title}>
              {course.title}
            </CardTitle>
          </div>

          {/* right side: status badge */}

          <Badge
            variant="outline"
            className={
              "whitespace-nowrap text-xs font-medium px-2 py-0.5 " +
              (isPublished
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-amber-200 bg-amber-50 text-amber-800")
            }
          >
            {statusLabel}
          </Badge>
        </div>

        <div className="w-full border-t border-[#C1CFD7] my-2 mx-auto" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {(course.course_categories ?? []).map((category) => (
              <Badge key={category.id} variant="outline">
                {category.name}
              </Badge>
            ))}
          </div>

          <p className="text-sm text-gray-600">
            {course.durationHours != null ? `${course.durationHours} ${t("courses.hours")}` : "—"}
          </p>
        </div>

        <StarRating rating={4.2} size="sm" className="mt-2" />
      </CardContent>
      <CardFooter className="flex justify-end items-center">
        <Button
          variant="link"
          onClick={handleEdit}
          className="text-[#246670] decoration-[#246670] underline"
        >
          {t("common.edit")}
        </Button>
        <Button variant="secondary" onClick={handleView}>
          {t("common.view")}
        </Button>
      </CardFooter>
    </Card>
  );
};
