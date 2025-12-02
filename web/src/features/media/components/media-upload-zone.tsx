import { zodResolver } from "@hookform/resolvers/zod";
import { mdiChevronDown, mdiClose } from "@mdi/js";
import { Icon } from "@mdi/react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useFileUpload } from "@/features/media/hooks/use-file-upload";
import type { UploadFile } from "@/shared/api/types.gen";
import { ErrorDisplayWithRetry } from "@/shared/components/error/error-display";
import { Button } from "@/shared/components/shadcn/button";
import { Form } from "@/shared/components/shadcn/form";
import { useNotifications } from "@/shared/context/NotificationContext";
import { toAppError } from "@/shared/lib/error-utilities";
import { cn } from "@/shared/lib/utils";
import type { AppError } from "@/shared/types/app-error";

import {
  uploadFormSchema,
  type UploadFormValues,
  type UploadFileItem,
} from "../lib/media-schemas";
import {
  formatBytes,
  splitFilename,
  fileToUploadFilePreview,
  type MediaFileType,
} from "../lib/media-utils";

import { MediaAssetPreview } from "./media-asset-preview";
import { MediaMetadataForm } from "./media-metadata-form";
import { MediaUploadCard } from "./media-upload-card";

interface MediaFilePreviewItemProps {
  file: File;
  index: number;
  form: ReturnType<typeof useForm<UploadFormValues>>;
  onRemove: (index: number) => void;
  disabled: boolean;
}

/**
 * A single file preview item with collapsible metadata editing.
 */
const MediaFilePreviewItem = ({
  file,
  index,
  form,
  onRemove,
  disabled,
}: MediaFilePreviewItemProps) => {
  const [previewUrl] = useState(() => URL.createObjectURL(file));
  const { extension } = splitFilename(file.name);

  // Cleanup blob URL when component unmounts
  useEffect(() => {
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const previewAsset = fileToUploadFilePreview(file, { url: previewUrl });

  return (
    <AccordionPrimitive.Root type="single" collapsible className="w-full">
      <AccordionPrimitive.Item
        value="file-item"
        className="rounded-lg border overflow-hidden data-[state=open]:border-primary-border-default"
      >
        {/* Header - styled like section editor */}
        <AccordionPrimitive.Header className="flex">
          <AccordionPrimitive.Trigger className="flex flex-1 items-center gap-3 px-3 py-2 bg-card transition-colors data-[state=open]:bg-primary-surface-default data-[state=open]:text-white">
            {/* Chevron Icon */}
            <Icon
              path={mdiChevronDown}
              size={0.85}
              className="shrink-0 transition-transform duration-200 [[data-state=open]>&]:rotate-180"
            />

            {/* Preview - clickable for fullscreen, stops accordion trigger */}
            <div
              className="shrink-0"
              onClick={(e) => {
                e.stopPropagation();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                }
              }}
            >
              <MediaAssetPreview
                asset={previewAsset}
                className="h-14 w-14 rounded"
                imageClassName="object-cover"
                enableFullScreen={true}
                size="thumbnail"
              />
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs opacity-70">{formatBytes(file.size)}</p>
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
              className="shrink-0 p-1 rounded hover:bg-black/10 disabled:opacity-50 disabled:pointer-events-none"
              disabled={disabled}
              aria-label="Remove file"
            >
              <Icon path={mdiClose} size={0.85} />
            </button>
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>

        {/* Content */}
        <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <div className="px-3 pb-3 pt-2 bg-card">
            <MediaMetadataForm
              control={form.control}
              basePath={`files.${String(index)}`}
              disabled={disabled}
              fileExtension={extension}
              inputSize="sm"
            />
          </div>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  );
};

interface MediaUploadZoneProps {
  /** Types of files allowed (image, video, file). Defaults to image and video. */
  fileTypes?: MediaFileType | MediaFileType[];
  /** Maximum number of files allowed. */
  maxFiles?: number;
  /** Callback when upload completes successfully */
  onUploadComplete?: (files: UploadFile[]) => void;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
  /** Label for the upload button */
  uploadButtonLabel?: string;
  /** Optional secondary action button (e.g., "Upload and Select") */
  secondaryAction?: {
    label: string;
    onClick: (files: UploadFile[]) => void;
  };
}

/**
 * Complete upload zone with:
 * - MediaUploadCard for file selection trigger
 * - Preview list of selected files with metadata editing
 * - Upload button(s)
 *
 * Use this component when you need the full upload flow with previews and metadata.
 */
export const MediaUploadZone = ({
  fileTypes,
  maxFiles,
  onUploadComplete,
  disabled = false,
  className,
  uploadButtonLabel,
  secondaryAction,
}: MediaUploadZoneProps) => {
  const { t } = useTranslation();
  const { uploadFile, isUploading } = useFileUpload();
  const { addNotification } = useNotifications();
  const [uploadError, setUploadError] = useState<AppError | undefined>(
    undefined
  );

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      files: [],
    },
    mode: "onChange", // Validate on every change to clear errors immediately
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "files",
  });

  const handleFilesSelected = (files: File[]) => {
    const filesToAdd: UploadFileItem[] = files.map((file) => {
      const { name, extension } = splitFilename(file.name);
      return {
        file,
        filename: name,
        extension,
        alt: "",
        caption: "",
      };
    });

    if (maxFiles === 1) {
      // Single file mode: replace existing files
      form.setValue("files", filesToAdd.slice(0, 1));
      return;
    }

    // Multiple files mode
    const currentCount = fields.length;
    const newTotal = currentCount + filesToAdd.length;

    if (maxFiles && newTotal > maxFiles) {
      addNotification(t("files.maxFilesExceeded", { count: maxFiles }));
      // Only add files up to the limit
      const availableSlots = maxFiles - currentCount;
      for (const fileItem of filesToAdd.slice(0, availableSlots)) {
        append(fileItem);
      }
      return;
    }

    // Add all files
    for (const fileItem of filesToAdd) {
      append(fileItem);
    }
  };

  const handleRemoveFile = (index: number) => {
    remove(index);
  };

  const handleUpload = async (): Promise<UploadFile[] | undefined> => {
    const formValues = form.getValues();

    if (formValues.files.length === 0) {
      return undefined;
    }

    // Clear any previous error before attempting upload
    setUploadError(undefined);

    try {
      // Reconstruct full filenames before upload
      const filesWithFullNames = formValues.files.map((item) => ({
        file: item.file,
        filename: item.filename + item.extension, // Reconstruct: "name" + ".ext"
        alt: item.alt,
        caption: item.caption,
      }));

      const result = await uploadFile(filesWithFullNames);

      if (!result) {
        return undefined;
      }

      if (Array.isArray(result) && result.length > 0) {
        const uploadedFiles = result as unknown as UploadFile[];

        // Show success notification for each uploaded file
        for (const file of uploadedFiles) {
          addNotification(
            t("media.uploadFileSuccess", { filename: file.name })
          );
        }

        onUploadComplete?.(uploadedFiles);
        form.reset({ files: [] });
        return uploadedFiles;
      }
    } catch (error) {
      setUploadError(toAppError(error));
    }
    return undefined;
  };

  const handleSecondaryAction = async () => {
    const uploadedFiles = await handleUpload();
    if (uploadedFiles && secondaryAction) {
      secondaryAction.onClick(uploadedFiles);
    }
  };

  const isDisabled = disabled || isUploading;
  const hasFiles = fields.length > 0;
  const hasValidationErrors = Object.keys(form.formState.errors).length > 0;

  // Trigger validation before upload
  const handleUploadWithValidation = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }
    await handleUpload();
  };

  const handleSecondaryActionWithValidation = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }
    await handleSecondaryAction();
  };

  const handleRetry = () => {
    setUploadError(undefined);
    void handleUploadWithValidation();
  };

  return (
    <Form {...form}>
      <div className={cn("space-y-4", className)}>
        {uploadError && (
          <ErrorDisplayWithRetry
            error={uploadError}
            variant="bar"
            onRetry={handleRetry}
          />
        )}

        <MediaUploadCard
          fileTypes={fileTypes}
          maxFiles={maxFiles}
          onFilesSelected={handleFilesSelected}
          disabled={isDisabled}
        />

        {hasFiles && (
          <div className="space-y-3">
            <div className="space-y-2">
              {fields.map((field, index) => (
                <MediaFilePreviewItem
                  key={field.id}
                  file={field.file}
                  index={index}
                  form={form}
                  onRemove={handleRemoveFile}
                  disabled={isDisabled}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => {
                  void handleUploadWithValidation();
                }}
                disabled={isDisabled || hasValidationErrors}
                className="flex-1"
              >
                {isUploading
                  ? `${t("common.uploading")}...`
                  : (uploadButtonLabel ?? t("common.upload"))}
              </Button>

              {secondaryAction && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    void handleSecondaryActionWithValidation();
                  }}
                  disabled={isDisabled || hasValidationErrors}
                  className="flex-1"
                >
                  {secondaryAction.label}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Form>
  );
};
