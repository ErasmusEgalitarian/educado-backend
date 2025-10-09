import { mdiCheckboxBlankCircleOutline, mdiCheckCircleOutline } from "@mdi/js";
import Icon from "@mdi/react";

import { Button } from "@/shared/components/shadcn/button";

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
      path={mdiCheckCircleOutline}
      size={1}
      className="text-success-surface-default"
    />
  ) : (
    <Icon
      path={mdiCheckboxBlankCircleOutline}
      size={1}
      className="text-greyscale-text-body"
    />
  );

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className="w-full justify-start"
      iconPlacement="left"
      icon={() => icon}
      disabled={!canNavigate}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default CourseEditorMenuButton;
