import { CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ApiCourseCourseDocument } from "@/shared/api";
import { OverlayStatusWrapper } from "@/shared/components/overlay-status-wrapper";
import { Button } from "@/shared/components/shadcn/button";

import { usePublishCourseMutation } from "../api/course-mutations";

interface CourseEditorReviewProps {
  course?: ApiCourseCourseDocument;
  onComplete?: () => void;
}

const CourseEditorReview = ({
  course,
  onComplete,
}: CourseEditorReviewProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const publishMutation = usePublishCourseMutation();

  const isLoading = publishMutation.isPending;
  const isSuccess = publishMutation.isSuccess;

  const isPublished = course?.publishedAt != null;
  const hasSections = (course?.course_sections?.length ?? 0) > 0;

  const getDifficultyLabel = (difficulty?: number) => {
    switch (difficulty) {
      case 1:
        return t("courseManager.beginner");
      case 2:
        return t("courseManager.intermediate");
      case 3:
        return t("courseManager.advanced");
      default:
        return "-";
    }
  };

  const handlePublish = async () => {
    if (course?.documentId == null) return;

    try {
      await publishMutation.mutateAsync(course.documentId);

      // Wait a moment to show success state
      setTimeout(() => {
        onComplete?.();
        // Navigate to courses list after publishing
        navigate("/courses");
      }, 1500);
    } catch (error) {
      console.error("Error publishing course:", error);
    }
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error-surface-default" />
          <p className="text-greyscale-text-body">
            {t("courseManager.noCourse")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <OverlayStatusWrapper
      isLoading={isLoading}
      isSuccess={isSuccess}
      loadingMessage={t("common.publishing")}
      successMessage={t("common.published")}
    >
      <div className="flex flex-col gap-y-6">
        {/* Course Status Banner */}
        {isPublished && (
          <div className="flex items-center gap-3 p-4 bg-success-surface-lighter rounded-lg border border-success-border-default">
            <CheckCircle className="w-5 h-5 text-success-surface-default" />
            <div>
              <p className="font-semibold text-success-text-title">
                {t("common.published")}
              </p>
              <p className="text-sm text-success-text-body">
                {t("courseEditorReview.thisCourseIsCurrentlyVisibleToStudents")}
                This course is currently visible to students
              </p>
            </div>
          </div>
        )}

        {/* Course Details */}
        <div className="rounded-xl p-6 shadow-lg border border-greyscale-border">
          <h2 className="text-2xl font-bold text-greyscale-text-title mb-6">
            {t("courseManager.courseDetails")}
          </h2>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-sm font-medium text-greyscale-text-caption">
                {t("courseManager.courseName")}
              </label>
              <p className="text-lg text-greyscale-text-title mt-1">
                {course.title}
              </p>
            </div>

            {/* Difficulty */}
            <div>
              <label className="text-sm font-medium text-greyscale-text-caption">
                {t("courseManager.level")}
              </label>
              <p className="text-lg text-greyscale-text-title mt-1">
                {getDifficultyLabel(course.difficulty)}
              </p>
            </div>

            {/* Categories */}
            <div>
              <label className="text-sm font-medium text-greyscale-text-caption">
                {t("categories.categories")}
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {course.course_categories &&
                course.course_categories.length > 0 ? (
                  course.course_categories.map((category) => (
                    <span
                      key={category.documentId}
                      className="px-3 py-1 bg-greyscale-bg rounded-full text-sm text-greyscale-text-body"
                    >
                      {category.name}
                    </span>
                  ))
                ) : (
                  <p className="text-greyscale-text-caption">-</p>
                )}
              </div>
            </div>

            {/* Description */}
            {course.description != null && (
              <div>
                <label className="text-sm font-medium text-greyscale-text-caption">
                  {t("courseManager.description")}
                </label>
                <p className="text-greyscale-text-body mt-1">
                  {course.description}
                </p>
              </div>
            )}

            {/* Image */}
            {course.image && (
              <div>
                <label className="text-sm font-medium text-greyscale-text-caption">
                  {t("courseManager.coverImage")}
                </label>
                <div className="mt-2">
                  <img
                    src={course.image.url}
                    alt={course.title}
                    className="w-full max-w-md rounded-lg border border-greyscale-border"
                  />
                </div>
              </div>
            )}

            {/* Sections Count */}
            <div>
              <label className="text-sm font-medium text-greyscale-text-caption">
                {t("courseManager.createSections")}
              </label>
              <p className="text-lg text-greyscale-text-title mt-1">
                {hasSections
                  ? `${String(course.course_sections?.length ?? 0)} sections`
                  : t("courseManager.noSections")}
              </p>
            </div>
          </div>
        </div>

        {/* Warning if no sections */}
        {!hasSections && !isPublished && (
          <div className="flex items-start gap-3 p-4 bg-warning-surface-lighter rounded-lg border border-warning-border-default">
            <AlertCircle className="w-5 h-5 text-warning-surface-default mt-0.5" />
            <div>
              <p className="font-semibold text-warning-text-title">
                No sections yet
              </p>
              <p className="text-sm text-warning-text-body">
                You can publish this course without sections, but consider
                adding content first for a better student experience.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!isPublished && (
          <div className="flex gap-4 pt-6">
            {showConfirm ? (
              <>
                <Button
                  onClick={() => {
                    void handlePublish();
                  }}
                  disabled={isLoading}
                  variant="primary"
                >
                  {t("common.publish")}
                </Button>
                <Button
                  onClick={() => {
                    setShowConfirm(false);
                  }}
                  disabled={isLoading}
                  variant="outline"
                >
                  {t("common.cancel")}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setShowConfirm(true);
                  }}
                  disabled={isLoading}
                >
                  {t("courseManager.publishCourse")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate("/courses");
                  }}
                  disabled={isLoading}
                >
                  {t("courseManager.saveAsDraft")}
                </Button>
              </>
            )}
          </div>
        )}

        {/* Already published */}
        {isPublished && (
          <div className="flex gap-4 pt-6">
            <Button
              variant="primary"
              onClick={() => {
                navigate("/courses");
              }}
            >
              {t("common.back")}
            </Button>
          </div>
        )}
      </div>
    </OverlayStatusWrapper>
  );
};

export default CourseEditorReview;
