import { mdiFloppy, mdiAlertCircle, mdiCheckCircle } from "@mdi/js";
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
import { useFileUpload } from "@/shared/hooks/use-file-upload";
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from "../api/course-mutations";

type SaveDraftLoader = "none" | "success" | "error";

const CourseEditorPage = () => {
  const { t } = useTranslation();

  // Refs to access form state from child components. Used to prevent navigation with unsaved changes.
  const informationFormRef = useRef<CourseEditorInformationRef>(null);
  const sectionsFormRef = useRef<CourseEditorSectionsRef>(null);

  const createMutation = useCreateCourseMutation();
  const updateMutation = useUpdateCourseMutation();

  const navigate = useNavigate();

  const [saveDraftLoader, setSaveDraftLoader] =
    useState<SaveDraftLoader>("none");

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
  const { uploadFile } = useFileUpload();

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

      // Upload image if provided and take first id
      const imageIds =
        values.image && values.image.length > 0
          ? await uploadFile(values.image)
          : undefined;
      const imageId = imageIds?.[0];
      // Edit = update mutation
      if (isEditMode && docId) {
        // Update existing course
        const result = await updateMutation.mutateAsync({
          documentId: docId,
          title: values.title,
          difficulty: Number(values.difficulty),
          categories: values.categories,
          description: values.description,
          image: imageId,
        });
        console.log("Updated draft course:", result);
      } else {
        // Create = create mutation
        const result = await createMutation.mutateAsync({
          title: values.title,
          difficulty: Number(values.difficulty),
          categories: values.categories ?? [],
          description: values.description,
          image: imageId,
        });

        setSaveDraftLoader("success");

        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving course:", error);
      setSaveDraftLoader("error");

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
            onClick={saveAsDraft}
            className="w-full w-60"
            variant="secondary"
          >
            {createMutation.isPending || updateMutation.isPending ? (
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

          <div className="flex flex-col gap-y-3 mt-6">
            {saveDraftLoader === "success" && (
              <p className="flex text-sm text-success-surface-default gap-x-2">
                <Icon path={mdiCheckCircle} size={0.7} />
                Saved to draft succeeded
              </p>
            )}
            {saveDraftLoader === "error" && (
              <p className="flex items-center justify-center  text-sm text-destructive gap-x-2">
                <Icon path={mdiAlertCircle} size={0.7} />
                Failed to save as draft
              </p>
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
