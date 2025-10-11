import { mdiArrowLeft } from "@mdi/js";
import Icon from "@mdi/react";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";

import ReusableAlertDialog from "@/shared/components/modals/reusable-alert-dialog";
import { useAlertDialog } from "@/shared/components/modals/use-alert-dialog";
import { PageContainer } from "@/shared/components/page-container";
import { Button } from "@/shared/components/shadcn/button";
import { Separator } from "@/shared/components/shadcn/seperator";

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
  const { data, error, isLoading } = useQuery({
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
    course: data,
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
    if (error) {
      return (
        <div className="text-red-500">
          {t("courseEditor.fetchCourseDataError", { message: error.message })}
        </div>
      );
    }

    if (isLoading && isEditMode) {
      return <div>{t("common.loading")}</div>;
    }

    switch (currentStep) {
      case "information":
        return (
          <CourseEditorInformation
            ref={informationFormRef}
            course={data}
            onComplete={(courseId) => {
              handleStepComplete("information", courseId);
            }}
          />
        );
      case "sections":
        return (
          <CourseEditorSections
            ref={sectionsFormRef}
            courseId={data?.documentId}
            onComplete={() => {
              handleStepComplete("sections");
            }}
          />
        );
      case "review":
        return (
          <CourseEditorReview
            course={data}
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
      const hasTitle = data?.title != null && data.title.trim() !== "";
      return `${t("common.edit")} ${t("courseManager.course")} ${hasTitle ? "'" + data.title + "'" : ""}`;
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
      <div className="flex gap-x-20">
        {/*------------ Left side - Step Navigation ------------*/}
        <div className="w-3/7">
          <div className="flex flex-row justify-between items-center gap-4 mb-6">
            <h1 className="text-2xl text-greyscale-text-caption">
              {getPageTitle()}
            </h1>
            <Button
              variant="outline"
              onClick={handleBack}
              iconPlacement="left"
              size="sm"
              icon={() => <Icon path={mdiArrowLeft} size={1} />}
            >
              {t("common.back")}
            </Button>
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
        </div>

        {/*------------ Right side - Content ------------*/}
        <div className="w-full">
          <h1 className="font-bold text-3xl text-greyscale-text-title mb-6">
            {steps.find((s) => s.id === currentStep)?.label}
          </h1>
          {getSectionComponent()}
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
