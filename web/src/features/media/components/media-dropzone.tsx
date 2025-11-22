import { mdiCloudUpload, mdiImageSearch } from "@mdi/js";
import Icon from "@mdi/react";
import { X } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";

import { UploadFile } from "@/shared/api/types.gen";
import { Button } from "@/shared/components/shadcn/button";
import { cn } from "@/shared/lib/utils";

import { MediaAssetPreview } from "./media-asset-preview";

export type MediaDropzoneVariant = "upload" | "select";

interface MediaDropzoneProps {
  variant?: MediaDropzoneVariant;
  value?: File | UploadFile | null;
  onFileSelect?: (files: File[]) => void;
  onClear?: () => void;
  accept?: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void; // For \"select\" mode to trigger modal
  maxFiles?: number; // Maximum number of files allowed
}

export const MediaDropzone = ({
  variant = "upload",
  value,
  onFileSelect,
  onClear,
  accept = "image/*,video/*,application/pdf",
  disabled = false,
  className,
  onClick,
  maxFiles,
}: MediaDropzoneProps) => {
  const { t } = useTranslation();
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<UploadFile | null>(null);

  // Convert File to UploadFile-like object for preview
  useEffect(() => {
    if (!value) {
      setPreviewAsset(null);
      return;
    }

    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewAsset({
        id: "preview",
        name: value.name,
        mime: value.type,
        url,
        size: value.size / 1024, // KB
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as unknown as UploadFile);

      return () => {
        URL.revokeObjectURL(url);
      };
    }

    setPreviewAsset(value);
  }, [value]);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled && variant === "upload") {
        setIsDragging(true);
      }
    },
    [disabled, variant]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled || variant !== "upload") return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0 && onFileSelect) {
        onFileSelect(files);
      }
    },
    [disabled, variant, onFileSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onFileSelect) {
      onFileSelect(Array.from(e.target.files));
    }
  };

  const handleClick = () => {
    if (disabled) return;
    if (onClick) {
      onClick();
    } else {
      document.getElementById(inputId)?.click();
    }
  };

  // If we have a value, we render the preview directly
  // This is useful for single-file selection mode
  if (value && previewAsset) {
    return (
      <div
        className={cn(
          "relative w-full h-64 rounded-lg border overflow-hidden group",
          className
        )}
      >
        <MediaAssetPreview
          asset={previewAsset}
          className="h-full w-full"
          imageClassName="object-contain"
          enableFullScreen
        />
        {!disabled && onClear && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all cursor-pointer h-64",
        isDragging && !disabled
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="mb-4 text-muted-foreground">
        <Icon
          path={variant === "upload" ? mdiCloudUpload : mdiImageSearch}
          size={2}
        />
      </div>
      <h3 className="mb-2 text-lg font-semibold">
        {variant === "upload"
          ? t("media.uploadFile", "Upload File")
          : t("media.selectFile", "Select File")}
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        {variant === "upload"
          ? t(
              "media.dragAndDrop",
              "Drag and drop a file here, or click to select"
            )
          : t(
              "media.clickToSelect",
              "Click to select from library or upload new"
            )}
      </p>

      {variant === "upload" && (
        <input
          id={inputId}
          type="file"
          className="hidden"
          onChange={handleFileInput}
          accept={accept}
          disabled={disabled}
          multiple={!maxFiles || maxFiles > 1}
        />
      )}
    </div>
  );
};
