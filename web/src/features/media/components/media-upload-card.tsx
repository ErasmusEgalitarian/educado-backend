import { mdiCloudUpload } from "@mdi/js";
import Icon from "@mdi/react";
import { useCallback, useId, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/components/shadcn/button";
import { useNotifications } from "@/shared/context/NotificationContext";
import { cn } from "@/shared/lib/utils";

import {
  getAcceptString,
  isFileTypeAllowed,
  type MediaFileType,
} from "../lib/media-utils";

interface MediaUploadCardProps {
  /** Types of files allowed (image, video, file). Defaults to image and video. */
  fileTypes?: MediaFileType | MediaFileType[];
  /** Maximum number of files allowed. If 1, only single file selection. */
  maxFiles?: number;
  /** Maximum file size in bytes. */
  maxFileSize?: number;
  /** Callback when files are selected (via click or drag) */
  onFilesSelected: (files: File[]) => void;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * A dashed card UI component for triggering file uploads.
 * Supports drag & drop and click to open file browser.
 *
 * This is a primitive component - it only handles the UI and file selection.
 * It does NOT handle:
 * - File previews
 * - Metadata editing
 * - Upload logic
 */
export const MediaUploadCard = ({
  fileTypes,
  maxFiles,
  maxFileSize,
  onFilesSelected,
  disabled = false,
  className,
}: MediaUploadCardProps) => {
  const { t } = useTranslation();
  const { addNotification } = useNotifications();
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);

  const acceptString = getAcceptString(fileTypes);
  const allowMultiple = !maxFiles || maxFiles > 1;

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const allFiles = Array.from(e.dataTransfer.files);
      let validFiles = allFiles.filter((file) =>
        isFileTypeAllowed(file, fileTypes)
      );
      const typeRejectedCount = allFiles.length - validFiles.length;

      if (typeRejectedCount > 0) {
        addNotification(
          t("media.filesRejectedType", { count: typeRejectedCount })
        );
      }

      // Enforce maxFileSize limit
      if (maxFileSize) {
        const sizeValidFiles = validFiles.filter(
          (file) => file.size <= maxFileSize
        );
        const sizeRejectedCount = validFiles.length - sizeValidFiles.length;
        if (sizeRejectedCount > 0) {
          addNotification(
            t("media.filesRejectedSize", {
              count: sizeRejectedCount,
              maxSize: Math.round(maxFileSize / 1024 / 1024),
            })
          );
        }
        validFiles = sizeValidFiles;
      }

      // Enforce maxFiles limit
      if (maxFiles && validFiles.length > maxFiles) {
        addNotification(t("files.maxFilesExceeded", { count: maxFiles }));
        validFiles = validFiles.slice(0, maxFiles);
      }

      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    },
    [
      disabled,
      onFilesSelected,
      fileTypes,
      maxFiles,
      maxFileSize,
      addNotification,
      t,
    ]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      let files = Array.from(e.target.files);

      // Enforce maxFileSize limit
      if (maxFileSize) {
        const sizeValidFiles = files.filter((file) => file.size <= maxFileSize);
        const sizeRejectedCount = files.length - sizeValidFiles.length;
        if (sizeRejectedCount > 0) {
          addNotification(
            t("media.filesRejectedSize", {
              count: sizeRejectedCount,
              maxSize: Math.round(maxFileSize / 1024 / 1024),
            })
          );
        }
        files = sizeValidFiles;
      }

      // Enforce maxFiles limit
      if (maxFiles && files.length > maxFiles) {
        addNotification(t("files.maxFilesExceeded", { count: maxFiles }));
        files = files.slice(0, maxFiles);
      }

      if (files.length > 0) {
        onFilesSelected(files);
      }
      // Reset input so same file can be selected again
      e.target.value = "";
    }
  };

  const handleClick = () => {
    if (!disabled) {
      document.getElementById(inputId)?.click();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const validKeyPressed = e.key === "Enter" || e.key === " ";

    if (validKeyPressed && !disabled) {
      e.preventDefault();
      handleClick(); // Open file dialog
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={cn(
        "relative flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed p-12 transition-all cursor-pointer min-h-48",
        isDragging && !disabled
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="mb-4 text-muted-foreground">
        <Icon path={mdiCloudUpload} size={2} />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{t("media.uploadFile")}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs mb-4">
        {t("media.dragAndDrop")}
      </p>
      <Button type="button" variant="secondary" disabled={disabled}>
        {t("media.browseFiles")}
      </Button>

      <input
        id={inputId}
        type="file"
        className="hidden"
        onChange={handleFileInput}
        accept={acceptString}
        disabled={disabled}
        multiple={allowMultiple}
      />
    </button>
  );
};
