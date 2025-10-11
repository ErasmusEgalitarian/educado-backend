import { mdiLoading } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";

import { cn } from "@/shared/lib/utils";

// Spinner component used by all variants
interface SpinnerProps {
  iconSize: number;
}

const Spinner: React.FC<SpinnerProps> = ({ iconSize }) => (
  <Icon
    path={mdiLoading}
    size={iconSize}
    className="animate-spin text-primary-text-default"
    spin
  />
);

export interface GlobalLoaderProps {
  /**
   * The variant of the loader:
   * - spinner: Just the spinning icon
   * - inline: Spinner with inline message
   * - container: Full container with title, description, and spinner
   */
  variant?: "spinner" | "inline" | "container";

  /**
   * For container variant: whether to take full viewport height (default: false)
   * When true, centers content in full viewport. When false, uses natural height.
   */
  fullHeight?: boolean;

  /**
   * Message to display with the loader
   * - For inline variant: displays next to spinner
   * - For container variant: used as title if no title prop provided
   */
  message?: string;

  /**
   * Title for container variant (optional, defaults to message if not provided)
   */
  title?: string;

  /**
   * Description for container variant (optional)
   */
  description?: string;

  /**
   * Size of the spinner icon
   */
  size?: number;

  /**
   * Additional className for the container
   */
  className?: string;
}

/**
 * GlobalLoader component for displaying consistent loading states throughout the app.
 *
 * @example
 * // Just a spinner
 * <GlobalLoader />
 *
 * @example
 * // Spinner with inline message
 * <GlobalLoader variant="inline" message="Loading courses..." />
 *
 * @example
 * // Full container with title and description
 * <GlobalLoader
 *   variant="container"
 *   title="Loading Course Data"
 *   description="Please wait while we fetch your courses..."
 *   fullHeight
 * />
 */
export const GlobalLoader: React.FC<GlobalLoaderProps> = ({
  variant = "spinner",
  fullHeight = false,
  message,
  title,
  description,
  size = 1,
  className,
}) => {
  // Spinner variant: just the icon
  if (variant === "spinner") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <Spinner iconSize={size} />
      </div>
    );
  }

  // Inline variant: spinner with message next to it
  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <Spinner iconSize={0.8} />
        {message !== undefined && message !== "" ? (
          <span className="text-greyscale-text-body text-sm">{message}</span>
        ) : null}
      </div>
    );
  }

  // Container variant: full container with title, description, and centered spinner
  const displayTitle = title ?? message;

  return (
    <div
      className={cn(
        "flex items-center justify-center p-8",
        fullHeight && "min-h-screen",
        className
      )}
    >
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <Spinner iconSize={1.5} />

        {displayTitle !== undefined && displayTitle !== "" ? (
          <h2 className="text-xl font-semibold text-greyscale-text-title">
            {displayTitle}
          </h2>
        ) : null}

        {description !== undefined && description !== "" ? (
          <p className="text-sm text-greyscale-text-subtitle">{description}</p>
        ) : null}
      </div>
    </div>
  );
};

export default GlobalLoader;
