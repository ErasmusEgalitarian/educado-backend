import { forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/components/shadcn/button";

interface CourseEditorSectionsProps {
  courseId?: string;
  onComplete?: () => void;
}

export interface CourseEditorSectionsRef {
  isDirty: () => boolean;
}

const CourseEditorSections = forwardRef<
  CourseEditorSectionsRef,
  CourseEditorSectionsProps
>(({ courseId, onComplete }, ref) => {
  const { t } = useTranslation();

  // For now, sections always return false since there's no form yet
  useImperativeHandle(ref, () => ({
    isDirty: () => false,
  }));

  return (
    <div className="flex flex-col gap-y-6">
      <div className="rounded-xl p-6 shadow-lg border border-greyscale-border">
        <h2 className="text-2xl font-bold text-greyscale-text-title mb-4">
          {t("courseManager.createSections")}
        </h2>
        <p className="text-greyscale-text-body mb-6">
          Course ID: {courseId ?? "No course ID"}
        </p>
        <p className="text-greyscale-text-caption mb-6">
          Section management will be implemented here. For now, you can skip to
          the review step.
        </p>

        <div className="flex gap-4">
          <Button
            onClick={() => {
              onComplete?.();
            }}
          >
            {t("common.continue")}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onComplete?.();
            }}
          >
            Skip to Review
          </Button>
        </div>
      </div>
    </div>
  );
});

CourseEditorSections.displayName = "CourseEditorSections";

export default CourseEditorSections;
