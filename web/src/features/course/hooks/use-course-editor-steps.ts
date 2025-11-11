import { useState, useEffect } from "react";

import type { Course } from "@/shared/api/types.gen";

export type CourseEditorStep = "information" | "sections" | "review";

export interface StepState {
  current: CourseEditorStep;
  completed: Set<CourseEditorStep>;
}

interface UseCourseEditorStepsProps {
  /** Existing course data (for edit mode) */
  course?: Course;
  /** Whether we're in edit mode */
  isEditMode: boolean;
}

/**
 * Hook to manage course editor step navigation and completion state.
 *
 * @example
 * ```tsx
 * const { currentStep, completedSteps, goToStep, completeStep, canNavigateToStep } = useCourseEditorSteps({
 *   course: data,
 *   isEditMode: true
 * });
 * ```
 */
export const useCourseEditorSteps = ({
  course,
  isEditMode,
}: UseCourseEditorStepsProps) => {
  const [stepState, setStepState] = useState<StepState>({
    current: "information",
    completed: new Set<CourseEditorStep>(),
  });

  // Course will exist when the query for an initial course has loaded.
  // The query will run if a path of "/courses/:courseId/edit" will provide one.
  // If not, we are in create mode and skip the init below.

  // Initialize completed steps based on existing course data (edit mode)
  useEffect(() => {
    if (isEditMode && course) {
      const completed = new Set<CourseEditorStep>();

      // Check if basic information is complete
      const hasBasicInfo = course.title !== "";
      const hasCategories =
        course.course_categories != null && course.course_categories.length > 0;

      // 1. Check if "information" is completed
      if (hasBasicInfo && hasCategories) {
        completed.add("information");
      }

      // 2. Check if "sections" is completed
      if (course.course_sections != null && course.course_sections.length > 0) {
        completed.add("sections");
      }

      // If both are complete, mark review as accessible (not necessarily completed)
      // Review step is "completed" when the course is published
      if (course.publishedAt != null && course.publishedAt !== "") {
        completed.add("review");
      }

      setStepState((prev) => ({
        ...prev,
        completed,
      }));
    }
  }, [isEditMode, course]);

  /**
   * Navigate to a specific step
   */
  const goToStep = (step: CourseEditorStep) => {
    if (canNavigateToStep(step)) {
      setStepState((prev) => ({
        ...prev,
        current: step,
      }));
    }
  };

  /**
   * Mark a step as completed and optionally move to the next step
   */
  const completeStep = (step: CourseEditorStep, moveToNext = true) => {
    setStepState((prev) => {
      const newCompleted = new Set(prev.completed);
      newCompleted.add(step);

      let newCurrent = prev.current;
      if (moveToNext) {
        newCurrent = getNextStep(step);
      }

      return {
        current: newCurrent,
        completed: newCompleted,
      };
    });
  };

  /**
 * Go back to the previous step
 */
const goToPreviousStep = () => {
  setStepState((prev) => {
    const prevStep = getPreviousStep(prev.current);
    if (!prevStep) return prev; // Already at the first step
    return {
      ...prev,
      current: prevStep,
    };
  });
};


  /**
   * Check if we can navigate to a specific step.
   * - In edit mode: can navigate to any completed step or the first incomplete step
   * - In create mode: can only navigate to completed steps or the next incomplete step
   */
  const canNavigateToStep = (targetStep: CourseEditorStep): boolean => {
    const { completed } = stepState;

    // Can always go to current step
    if (targetStep === stepState.current) return true;

    // Can navigate to any completed step
    if (completed.has(targetStep)) return true;

    // Check if previous step is completed (can go to next incomplete step)
    const previousStep = getPreviousStep(targetStep);
    if (previousStep != null && completed.has(previousStep)) return true;

    // In edit mode with course data, allow navigation to information step
    if (isEditMode && targetStep === "information") return true;

    return false;
  };

  /**
   * Check if a step is completed
   */
  const isStepCompleted = (step: CourseEditorStep): boolean => {
    return stepState.completed.has(step);
  };

  /**
   * Check if a step is currently active
   */
  const isStepActive = (step: CourseEditorStep): boolean => {
    return stepState.current === step;
  };

  /**
   * Get the next step in the flow
   */
  const getNextStep = (currentStep: CourseEditorStep): CourseEditorStep => {
    switch (currentStep) {
      case "information":
        return "sections";
      case "sections":
        return "review";
      case "review":
        return "review"; // Last step
      default:
        return "information";
    }
  };

  /**
   * Get the previous step in the flow
   */
  const getPreviousStep = (
    currentStep: CourseEditorStep,
  ): CourseEditorStep | null => {
    switch (currentStep) {
      case "sections":
        return "information";
      case "review":
        return "sections";
      case "information":
        return null; // First step
      default:
        return null;
    }
  };

  return {
    currentStep: stepState.current,
    completedSteps: stepState.completed,
    goToStep,
    completeStep,
    goToPreviousStep,
    canNavigateToStep,
    isStepCompleted,
    isStepActive,
  };
};
