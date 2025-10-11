import { CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useRef, useState, ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

interface OverlayStatusWrapperProps {
  isLoading: boolean;
  isSuccess: boolean;
  children: ReactNode;
  loadingMessage?: string;
  successMessage?: string;
  customOverlay?: ReactNode;
  className?: string;
}

/**
 * A wrapper component that displays overlay status states (loading, success) over its children.
 *
 * @remarks
 * This component maintains the height of the content during state transitions to prevent layout shifts.
 * It automatically measures the content height and transitions between showing the actual content
 * and status overlays using opacity animations.
 *
 * @param props - The component props
 * @param props.isLoading - Whether to display the loading overlay
 * @param props.isSuccess - Whether to display the success overlay
 * @param props.children - The content to be wrapped and potentially hidden by overlays
 * @param props.loadingMessage - Custom message to display during loading state. Defaults to "Loading..."
 * @param props.successMessage - Custom message to display during success state. Defaults to "Success!"
 * @param props.customOverlay - Optional custom overlay element to display instead of default loading/success overlays
 * @param props.className - Additional CSS classes to apply to the content wrapper
 *
 * @example
 * ```tsx
 * <OverlayStatusWrapper
 *   isLoading={isSubmitting}
 *   isSuccess={submitSuccess}
 *   loadingMessage="Saving changes..."
 *   successMessage="Changes saved!"
 * >
 *   <YourContent />
 * </OverlayStatusWrapper>
 * ```
 */
export const OverlayStatusWrapper = ({
  isLoading,
  isSuccess,
  children,
  loadingMessage = "Loading...",
  successMessage = "Success!",
  customOverlay,
  className = "",
}: Readonly<OverlayStatusWrapperProps>) => {
  const [lockedHeight, setLockedHeight] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Lock height when entering loading/success state, unlock when leaving
  useEffect(() => {
    if ((isLoading || isSuccess) && contentRef.current) {
      // Capture current height before showing overlay
      setLockedHeight(contentRef.current.offsetHeight);
    } else {
      // Allow natural height when not showing overlay
      setLockedHeight(null);
    }
  }, [isLoading, isSuccess]);

  let activeOverlay = null;
  let showOverlay = false;

  if (isLoading) {
    showOverlay = true;
    activeOverlay = customOverlay ?? (
      <div className="flex items-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">{loadingMessage}</span>
      </div>
    );
  } else if (isSuccess) {
    // Show success for a brief moment, then hide the overlay
    showOverlay = true;
    activeOverlay = customOverlay ?? (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <span className="text-sm font-medium">{successMessage}</span>
      </div>
    );
  }

  return (
    <div
      className="relative w-full transition-all"
      style={{ height: lockedHeight ?? "auto" }}
    >
      {/* Base Layer */}
      <div
        ref={contentRef}
        className={cn(
          `transition-opacity duration-300 ${showOverlay ? "opacity-0 pointer-events-none" : "opacity-100"}`,
          className
        )}
      >
        {children}
      </div>

      {/* Overlay Layer */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 
          ${showOverlay ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        {activeOverlay}
      </div>
    </div>
  );
};
