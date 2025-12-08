/* eslint-disable @typescript-eslint/naming-convention */
import { mdiFloppy, mdiCheckCircle } from "@mdi/js";
import Icon from "@mdi/react";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { ErrorBoundary } from "@/shared/components/error/error-boundary";
import { ErrorDisplay } from "@/shared/components/error/error-display";
import { GlobalLoader } from "@/shared/components/global-loader";
import { PageContainer } from "@/shared/components/page-container";
import { Button } from "@/shared/components/shadcn/button";
import { Separator } from "@/shared/components/shadcn/seperator";
import { toAppError } from "@/shared/lib/error-utilities";

import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useUnpublishCourseMutation,
} from "../api/course-mutations";
import { CourseQueryFunction } from "../api/course-queries";
import CourseEditorInformation, {
  type CourseEditorInformationRef,
} from "../components/course-editor-information";
import CourseEditorMenuButton from "../components/course-editor-menu-button";
import CourseEditorReview from "../components/course-editor-review";
import CourseEditorSections from "../components/course-editor-sections";
import {
  useCourseEditorSteps,
  type CourseEditorStep,
} from "../hooks/use-course-editor-steps";

const CourseEditorPage = () => {
  const { t } = useTranslation();

  // Refs to access form state from child components. Used to prevent navigation with unsaved changes.
  const informationFormRef = useRef<CourseEditorInformationRef>(null);

  const createMutation = useCreateCourseMutation();
  const updateMutation = useUpdateCourseMutation();
  const unPublishMutation = useUnpublishCourseMutation();

  const navigate = useNavigate();

  // Determine if we are editing an existing course or creating a new one
  const { courseId: urlCourseId } = useParams<{ courseId?: string }>();

  // Track the actual course ID (from URL or after creation)
  const [actualCourseId, setActualCourseId] = useState<string | undefined>(
    urlCourseId
  );

  const isEditMode = actualCourseId !== undefined;

  // Fetch existing course data if we have a course ID
  const {
    data: queryCourse,
    error: queryError,
    isLoading: queryIsLoading,
    refetch,
  } = useQuery({
    ...CourseQueryFunction(actualCourseId ?? ""),
    enabled: isEditMode, // Only run query in edit mode
  });

  /* ----------------------------- Step management ---------------------------- */

  // Initialize step management using custom hook
  const {
    currentStep,
    goToStep,
    completeStep,
    canNavigateToStep,
    isStepCompleted,
    isStepActive,
  } = useCourseEditorSteps({
    course: queryCourse,
    isEditMode,
  });

  // Define steps with their metadata
  const steps: {
    id: CourseEditorStep;
    label: string;
  }[] = [
    { id: "information", label: t("courseEditor.generalInfo") },
    { id: "sections", label: t("courseEditor.createSections") },
    { id: "review", label: t("courseEditor.reviewCourse") },
  ];

  const handleStepComplete = (step: CourseEditorStep, courseId?: string) => {
    // If a courseId is provided (from create operation), store it
    if (courseId !== undefined && courseId !== "") {
      setActualCourseId(courseId);
    }
    completeStep(step, true); // Complete and move to next step
  };

  const saveAsDraft = async () => {
    try {
      const values = informationFormRef.current?.getValues();
      if (!values) return;

      const docId = actualCourseId ?? queryCourse?.documentId;

      // Image comes from picker with documentId (same as course-editor-information)
      const imageId = values.image?.documentId;

      // Edit = update mutation
      if (isEditMode && docId) {
        // Update existing course
        await unPublishMutation.mutateAsync({
          documentId: docId,
          title: values.title,
          difficulty: Number(values.difficulty),
          course_categories: values.course_categories,
          description: values.description,
          image: imageId,
        });
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        // Create = create mutation
        await createMutation.mutateAsync({
          title: values.title,
          difficulty: Number(values.difficulty),
          course_categories: values.course_categories,
          description: values.description,
          image: imageId,
          durationHours: 1,
          creator_published_at: "",
        });
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving course:", error);

      // Error handling is managed by react-query
    }
  };

  /* ---------------------------- Render component ---------------------------- */
  const getSectionComponent = () => {
    if (queryError) {
      const appError = toAppError(queryError);
      console.error("Error loading course:", appError);

      return (
        <ErrorDisplay
          error={appError}
          variant="page"
          actions={[
            {
              label: t("common.retry"),
              onClick: () => void refetch(),
              variant: "primary",
            },
          ]}
        />
      );
    }

    if (queryIsLoading && isEditMode) {
      return (
        <GlobalLoader
          variant="container"
          message={`${t("common.loading")} ${t("courses.course").toLowerCase()}...`}
        />
      );
    }

    switch (currentStep) {
      case "information":
        return (
          <CourseEditorInformation
            ref={informationFormRef}
            course={queryCourse}
            onComplete={(courseId) => {
              handleStepComplete("information", courseId);
            }}
          />
        );
      case "sections":
        return (
          <CourseEditorSections
            courseId={queryCourse?.documentId ?? ""}
            onComplete={() => {
              handleStepComplete("sections");
            }}
          />
        );
      case "review":
        return (
          <CourseEditorReview
            course={queryCourse}
            onComplete={() => {
              handleStepComplete("review");
            }}
          />
        );
      default:
        return null;
    }
  };

  const getPageTitle = () => {
    if (isEditMode) {
      const hasTitle =
        queryCourse?.title != null && queryCourse.title.trim() !== "";
      return `${t("common.edit")} ${t("courses.course")} ${hasTitle ? "'" + queryCourse.title + "'" : ""}`;
    }

    return `${t("common.create")} ${t("courses.course")}`;
  };

  return (
    <PageContainer title={getPageTitle()}>
      <div className="flex gap-x-20">
        {/*------------ Left side - Step Navigation ------------*/}
        <div className="w-auto">
          <div className="flex flex-col justify-between items-start gap-4 mb-6">
            <h1 className="text-2xl text-greyscale-text-caption">
              {getPageTitle()}
            </h1>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col gap-y-5 my-6">
            {steps.map((step) => (
              <CourseEditorMenuButton
                key={step.id}
                isActive={isStepActive(step.id)}
                isCompleted={isStepCompleted(step.id)}
                canNavigate={canNavigateToStep(step.id)}
                label={step.label}
                onClick={() => {
                  goToStep(step.id);
                }}
              />
            ))}
          </div>
          <Separator className="my-6" />
          <Button
            disabled={createMutation.isPending || updateMutation.isPending}
            onClick={() => void saveAsDraft()}
            className="w-full"
            variant="secondary"
          >
            {unPublishMutation.isPending || updateMutation.isPending ? (
              <>
                <GlobalLoader variant="spinner" size={0.8} />
                {t("common.saving")}...
              </>
            ) : (
              <>
                <Icon path={mdiFloppy} size={0.6} />
                {t("courseEditor.saveAsDraft")}
              </>
            )}
          </Button>

          {/* ---- Loading save as draft ----- */}

          <div className="flex flex-col gap-y-3 mt-6 w-full">
            {updateMutation.isSuccess && (
              <p className="flex text-sm justify-center text-success-surface-default gap-x-2">
                <Icon path={mdiCheckCircle} size={0.7} />
                Saved to draft succeeded
              </p>
            )}
            {updateMutation.isError && (
              <ErrorDisplay
                error={toAppError(updateMutation.error)}
                variant="bar"
                actions={[
                  {
                    label: t("common.retry"),
                    onClick: () => void refetch(),
                    variant: "primary",
                  },
                ]}
              />
            )}
          </div>
        </div>

        {/*------------ Right side - Content ------------*/}
        <div className="w-full">
          <h1 className="font-bold text-3xl text-greyscale-text-title mb-6">
            {steps.find((s) => s.id === currentStep)?.label}
          </h1>
          <ErrorBoundary>{getSectionComponent()}</ErrorBoundary>
        </div>
      </div>
    </PageContainer>
  );
};

export default CourseEditorPage;
