import { mdiArrowLeft, mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import Icon from "@mdi/react";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";

import { ErrorBoundary } from "@/shared/components/error/error-boundary";
import { ErrorDisplay } from "@/shared/components/error/error-display";
import { GlobalLoader } from "@/shared/components/global-loader";
import ReusableAlertDialog from "@/shared/components/modals/reusable-alert-dialog";
import { useAlertDialog } from "@/shared/components/modals/use-alert-dialog";
import { PageContainer } from "@/shared/components/page-container";
import { Button } from "@/shared/components/shadcn/button";
import { Separator } from "@/shared/components/shadcn/seperator";
import { toAppError } from "@/shared/lib/error-utilities";

import { CourseQueryFunction } from "../api/course-queries";
import CourseEditorInformation, {
  type CourseEditorInformationRef,
} from "../components/course-editor-information";
import CourseEditorMenuButton from "../components/course-editor-menu-button";
import CourseEditorReview from "../components/course-editor-review";
import CourseEditorSections, {
  type CourseEditorSectionsRef,
} from "../components/course-editor-sections";
import {
  useCourseEditorSteps,
  type CourseEditorStep,
} from "../hooks/use-course-editor-steps";

const CourseEditorPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { alertProps, openAlert } = useAlertDialog();

  // State for menu collapse
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

  // Refs to access form state from child components. Used to prevent navigation with unsaved changes.
  const informationFormRef = useRef<CourseEditorInformationRef>(null);
  const sectionsFormRef = useRef<CourseEditorSectionsRef>(null);

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
    { id: "information", label: t("courseManager.generalInfo") },
    { id: "sections", label: t("courseManager.createSections") },
    { id: "review", label: t("courseManager.reviewCourse") },
  ];

  const handleStepComplete = (step: CourseEditorStep, courseId?: string) => {
    // If a courseId is provided (from create operation), store it
    if (courseId !== undefined && courseId !== "") {
      setActualCourseId(courseId);
    }
    completeStep(step, true); // Complete and move to next step
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
          message={`${t("common.loading")} ${t("courseManager.course").toLowerCase()}...`}
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
            ref={sectionsFormRef}
            courseId={queryCourse?.documentId}
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
      return `${t("common.edit")} ${t("courseManager.course")} ${hasTitle ? "'" + queryCourse.title + "'" : ""}`;
    }

    return `${t("common.create")} ${t("courseManager.course")}`;
  };

  const handleBack = () => {
    // Check isDirty at the moment of click
    const informationDirty = informationFormRef.current?.isDirty() ?? false;
    const sectionsDirty = sectionsFormRef.current?.isDirty() ?? false;

    const hasChanges = informationDirty || sectionsDirty;

    if (hasChanges) {
      openAlert();
    } else {
      handleReturnToCourses();
    }
  };

  const handleReturnToCourses = () => {
    navigate("/courses");
  };

  return (
    <PageContainer title={getPageTitle()}>
      <div className="flex gap-x-6 md:gap-x-20 w-full overflow-x-hidden">
        {/*------------ Left side - Step Navigation ------------*/}
        <div
          className={`transition-all duration-300 ${
            isMenuCollapsed ? "w-16" : "w-full md:w-3/7"
          }`}
        >
          <div className="flex flex-col gap-4 mb-6">
            {!isMenuCollapsed && (
              <h1 className="text-2xl text-greyscale-text-caption">
                {getPageTitle()}
              </h1>
            )}
            <div className="flex flex-row justify-between items-center w-full">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsMenuCollapsed(!isMenuCollapsed);
                }}
                size="lg"
                iconPlacement="left"
                className={
                  isMenuCollapsed
                    ? "justify-center w-12 h-12 p-0"
                    : "justify-start"
                }
                icon={() => (
                  <Icon
                    path={isMenuCollapsed ? mdiChevronRight : mdiChevronLeft}
                    size={1}
                  />
                )}
              >
                {!isMenuCollapsed && t("common.collapse")}
              </Button>
              {!isMenuCollapsed && (
                <Button
                  variant="secondary"
                  onClick={handleBack}
                  iconPlacement="left"
                  size="lg"
                  icon={() => <Icon path={mdiArrowLeft} size={1} />}
                >
                  {t("common.back")}
                </Button>
              )}
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col gap-y-5 my-6">
            {steps.map((step) => {
              // Indicator color:
              // - Green if step is completed
              // - Blue if step is available and not completed (includes current step when not completed)
              // - Transparent if step is not available yet
              // Indicator color using CSS vars (see index.css):
              // - Blue if current step OR available and not completed
              // - Green if completed (but current step takes precedence and stays blue)
              // - Transparent if not available yet
              let borderLeftColorClass = "[border-left-color:transparent]";
              if (canNavigateToStep(step.id)) {
                if (isStepActive(step.id)) {
                  borderLeftColorClass =
                    "[border-left-color:var(--color-primary-surface-default)]";
                } else if (isStepCompleted(step.id)) {
                  borderLeftColorClass =
                    "[border-left-color:var(--color-success-surface-default)]";
                } else {
                  borderLeftColorClass = "[border-left-color:transparent]";
                }
              }

              return (
                <div
                  key={step.id}
                  className={`flex items-center pl-2 border-l-[4px] ${borderLeftColorClass}`}
                >
                  <CourseEditorMenuButton
                    isActive={isStepActive(step.id)}
                    isCompleted={isStepCompleted(step.id)}
                    canNavigate={canNavigateToStep(step.id)}
                    label={step.label}
                    onClick={() => {
                      goToStep(step.id);
                    }}
                    isCollapsed={isMenuCollapsed}
                  />
                </div>
              );
            })}
          </div>
          <Separator className="my-6" />
        </div>

        {/*------------ Right side - Content ------------*/}
        <div className="w-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-bold text-3xl text-greyscale-text-title">
              {steps.find((s) => s.id === currentStep)?.label}
            </h1>
          </div>
          <ErrorBoundary>{getSectionComponent()}</ErrorBoundary>
        </div>
      </div>

      {/* Leave confirmation alert */}
      <ReusableAlertDialog
        {...alertProps}
        title={t("courseManager.unsavedChangesTitle")}
        description={t("courseManager.unsavedChangesMessage")}
        confirmAction={{
          label: t("common.leave"),
          onClick: handleReturnToCourses,
        }}
        cancelAction={{
          label: t("common.stay"),
          onClick: () => {
            // Just close the dialog
          },
        }}
      />
    </PageContainer>
  );
};

export default CourseEditorPage;
