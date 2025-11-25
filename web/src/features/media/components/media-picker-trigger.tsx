import { mdiClose, mdiImageSearch } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { UploadFile } from "@/shared/api/types.gen";
import { Button } from "@/shared/components/shadcn/button";
import { cn } from "@/shared/lib/utils";

import { MediaAssetPreview } from "./media-asset-preview";
import MediaPickerModal from "./media-picker-modal";

import type { MediaFileType } from "../lib/media-utils";

interface MediaPickerTriggerProps {
  /** Current selected value */
  value?: UploadFile | null;
  /** Callback when a file is selected */
  onChange: (file: UploadFile | null) => void;
  /** Types of files allowed (image, video, file). */
  fileTypes?: MediaFileType | MediaFileType[];
  /** Maximum number of files for upload within the modal. Defaults to 1. */
  maxFiles?: number;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * A picker trigger component that shows:
 * - A dashed card to open the picker modal (when no value selected)
 * - A preview of the selected asset with a clear button (when value is selected)
 *
 * Opens the MediaPickerModal for browsing existing assets or uploading new ones.
 */
export const MediaPickerTrigger = ({
  value,
  onChange,
  fileTypes,
  maxFiles = 1,
  disabled = false,
  className,
}: MediaPickerTriggerProps) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    if (!disabled) {
      setIsModalOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && !disabled) {
      e.preventDefault();
      handleClick();
    }
  };

  const handleSelect = (file: UploadFile) => {
    onChange(file);
    setIsModalOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  // If we have a value, show the preview with clear button
  if (value) {
    return (
      <>
        <div
          className={cn(
            "relative w-full h-64 rounded-lg border overflow-hidden group cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={disabled ? -1 : 0}
        >
          <MediaAssetPreview
            asset={value}
            className="h-full w-full"
            imageClassName="object-contain"
            enableFullScreen
          />
          {!disabled && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleClear}
              type="button"
            >
              <Icon path={mdiClose} size={0.65} />
            </Button>
          )}
        </div>

        <MediaPickerModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSelect={handleSelect}
          fileTypes={fileTypes}
          maxFiles={maxFiles}
        />
      </>
    );
  }

  // No value: show the trigger card
  return (
    <>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all cursor-pointer min-h-48",
          "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <div className="mb-4 text-muted-foreground">
          <Icon path={mdiImageSearch} size={2} />
        </div>
        <h3 className="mb-2 text-lg font-semibold">
          {t("media.selectFile", "Select File")}
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-xs mb-4">
          {t(
            "media.clickToSelect",
            "Click to select from library or upload new"
          )}
        </p>
        <Button type="button" variant="secondary" disabled={disabled}>
          {t("media.browseLibrary", "Browse Library")}
        </Button>
      </div>

      <MediaPickerModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSelect={handleSelect}
        fileTypes={fileTypes}
        maxFiles={maxFiles}
      />
    </>
  );
};
