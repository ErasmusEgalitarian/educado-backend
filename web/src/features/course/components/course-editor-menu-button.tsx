import {
  mdiCheckboxBlankCircleOutline,
  mdiCheckboxBlankOutline,
  mdiCheckboxMarked,
  mdiCheckCircleOutline,
} from "@mdi/js";
import Icon from "@mdi/react";

import { Button } from "@/shared/components/shadcn/button";
import { cn } from "@/shared/lib/utils";

interface CourseEditorMenuButtonProps {
  isActive: boolean;
  isCompleted: boolean;
  canNavigate: boolean;
  label: string;
  onClick: () => void;
}

const CourseEditorMenuButton = ({
  isActive,
  isCompleted,
  canNavigate,
  label,
  onClick,
}: CourseEditorMenuButtonProps) => {
  // Determine icon based on completion status
  const icon = isCompleted ? (
    <Icon
      path={mdiCheckboxMarked}
      size={1}
      className="text-primary-surface-default"
    />
  ) : (
    <Icon
      path={mdiCheckboxBlankOutline}
      size={1}
      className="text-primary-surface-default"
    />
  );

  return (
    <div
      className={cn(
        isActive ? "border-l-4 border-primary-surface-default" : "",
        "w-full justify-start"
      )}
    >
      <Button
        variant="ghost"
        className="w-full justify-start"
        iconPlacement="left"
        icon={() => icon}
        disabled={!canNavigate}
        onClick={onClick}
      >
        {label}
      </Button>
    </div>
  );
};

export default CourseEditorMenuButton;
