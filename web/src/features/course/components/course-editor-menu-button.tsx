import { mdiCheckboxBlankCircleOutline, mdiCheckCircleOutline } from "@mdi/js";
import Icon from "@mdi/react";

import { Button } from "@/shared/components/shadcn/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/shadcn/tooltip";

interface CourseEditorMenuButtonProps {
  isActive: boolean;
  isCompleted: boolean;
  canNavigate: boolean;
  label: string;
  onClick: () => void;
  isCollapsed?: boolean; // The sidebar is collapsed
}

const CourseEditorMenuButton = ({
  isActive,
  isCompleted,
  canNavigate,
  label,
  onClick,
  isCollapsed = false,
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

  const button = (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={
        isCollapsed ? "justify-center w-12 h-12 p-0" : "justify-start w-full"
      }
      iconPlacement="left"
      icon={() => icon}
      disabled={!canNavigate}
      onClick={onClick}
    >
      {!isCollapsed && label}
    </Button>
  );

  // If collapsed, wrap in tooltip
  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right">
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};

export default CourseEditorMenuButton;
