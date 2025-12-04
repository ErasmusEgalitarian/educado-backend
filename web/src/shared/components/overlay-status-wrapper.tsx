import { mdiCheckCircleOutline, mdiLoading } from "@mdi/js";
import Icon from "@mdi/react";
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
  /** Minimum time (ms) to show loading state. Default: 400ms */
  minLoadingDuration?: number;
  /** Minimum time (ms) to show success state. Default: 1200ms */
  minSuccessDuration?: number;
  /** Callback fired after success display duration completes */
  onSuccessComplete?: () => void;
}

/**
 * A wrapper component that displays overlay status states (loading, success) over its children.
 *
 * @remarks
 * This component maintains the height of the content during state transitions to prevent layout shifts.
 * It automatically measures the content height and transitions between showing the actual content
 * and status overlays using opacity animations. Enforces minimum display durations to ensure
 * users can perceive the state changes even with fast operations.
 *
 * @param props - The component props
 * @param props.isLoading - Whether to display the loading overlay
 * @param props.isSuccess - Whether to display the success overlay
 * @param props.children - The content to be wrapped and potentially hidden by overlays
 * @param props.loadingMessage - Custom message to display during loading state. Defaults to "Loading..."
 * @param props.successMessage - Custom message to display during success state. Defaults to "Success!"
 * @param props.customOverlay - Optional custom overlay element to display instead of default loading/success overlays
 * @param props.className - Additional CSS classes to apply to the content wrapper
 * @param props.minLoadingDuration - Minimum time (ms) to show loading state. Defaults to 400ms
 * @param props.minSuccessDuration - Minimum time (ms) to show success state. Defaults to 1200ms
 * @param props.onSuccessComplete - Callback fired after success display duration completes
 *
 * @example
 * ```tsx
 * <OverlayStatusWrapper
 *   isLoading={isSubmitting}
 *   isSuccess={submitSuccess}
 *   loadingMessage="Saving changes..."
 *   successMessage="Changes saved!"
 *   minLoadingDuration={500}
 *   minSuccessDuration={1500}
 *   onSuccessComplete={() => mutation.reset()}
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
  minLoadingDuration = 400,
  minSuccessDuration = 1200,
  onSuccessComplete,
}: Readonly<OverlayStatusWrapperProps>) => {
  const [lockedHeight, setLockedHeight] = useState<number | null>(null);
  const [displayLoading, setDisplayLoading] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const loadingStartTimeRef = useRef<number | null>(null);

  // Handle loading state with minimum duration
  useEffect(() => {
    if (isLoading) {
      loadingStartTimeRef.current = Date.now();
      setDisplayLoading(true);
    } else if (loadingStartTimeRef.current !== null) {
      // Calculate remaining time to show loading
      const elapsed = Date.now() - loadingStartTimeRef.current;
      const remaining = Math.max(0, minLoadingDuration - elapsed);

      if (remaining > 0) {
        const timer = setTimeout(() => {
          setDisplayLoading(false);
          loadingStartTimeRef.current = null;
        }, remaining);
        return () => {
          clearTimeout(timer);
        };
      } else {
        setDisplayLoading(false);
        loadingStartTimeRef.current = null;
      }
    }
  }, [isLoading, minLoadingDuration]);

  // Handle success state with minimum duration
  useEffect(() => {
    if (isSuccess) {
      setDisplaySuccess(true);
      const timer = setTimeout(() => {
        setDisplaySuccess(false);
        onSuccessComplete?.();
      }, minSuccessDuration);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isSuccess, minSuccessDuration, onSuccessComplete]);

  // Lock height when entering loading/success state, unlock when leaving
  useEffect(() => {
    if ((displayLoading || displaySuccess) && contentRef.current) {
      // Capture current height before showing overlay
      setLockedHeight(contentRef.current.offsetHeight);
    } else {
      // Allow natural height when not showing overlay
      setLockedHeight(null);
    }
  }, [displayLoading, displaySuccess]);

  let activeOverlay = null;
  let showOverlay = false;

  if (displayLoading) {
    showOverlay = true;
    activeOverlay = customOverlay ?? (
      <div className="flex items-center gap-2">
        <Icon path={mdiLoading} className="w-5 h-5 animate-spin" />
        <span className="text-sm">{loadingMessage}</span>
      </div>
    );
  } else if (displaySuccess) {
    // Show success for the configured duration
    showOverlay = true;
    activeOverlay = customOverlay ?? (
      <div className="flex items-center gap-2 text-green-600">
        <Icon path={mdiCheckCircleOutline} className="w-5 h-5 text-green-600" />
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
