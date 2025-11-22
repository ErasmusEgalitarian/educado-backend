import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useFieldArray, Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

import { useFileUpload } from "@/features/media/hooks/use-file-upload";
import { UploadFile } from "@/shared/api/types.gen";
import { FormInput } from "@/shared/components/form/form-input";
import { FormTextarea } from "@/shared/components/form/form-textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/shadcn/accordion";
import { Button } from "@/shared/components/shadcn/button";

import {
  formatBytes,
  getAcceptString,
  type MediaFileType,
} from "../lib/media-utils";

import { MediaAssetPreview } from "./media-asset-preview";
import { MediaDropzone } from "./media-dropzone";
import MediaModalPicker from "./media-picker-modal";

// Schema for file metadata in field array
const fileItemSchema = z.object({
  file: z.custom<File>(), // The actual File object (not registered in form)
  filename: z.string().min(1, "Filename is required"),
  alt: z.string(),
  caption: z.string(),
});

const uploadFormSchema = z.object({
  files: z.array(fileItemSchema),
});

type UploadFormValues = z.infer<typeof uploadFormSchema>;

interface MediaInputItemProps {
  file: File;
  index: number;
  control: Control<UploadFormValues>;
  onRemove: (index: number) => void;
  disabled: boolean;
}

const MediaInputItem = ({
  file,
  index,
  control,
  onRemove,
  disabled,
}: MediaInputItemProps) => {
  const { t } = useTranslation();
  const [previewUrl] = useState(() => URL.createObjectURL(file));

  // Cleanup blob URL when component unmounts
  useEffect(() => {
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const previewAsset = {
    id: 0,
    name: file.name,
    mime: file.type,
    url: previewUrl,
    size: file.size / 1024,
    alternativeText: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as UploadFile;

  return (
    <div className="group relative rounded-lg border bg-card transition-all hover:border-primary/50 hover:shadow-sm">
      <div className="flex items-center gap-3 p-3">
        {/* Preview */}
        <div className="shrink-0">
          <MediaAssetPreview
            asset={previewAsset}
            className="h-12 w-12 rounded"
            imageClassName="object-cover"
            enableFullScreen={true}
            size="thumbnail"
          />
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatBytes(file.size)}
          </p>
        </div>

        {/* Actions */}
        <div className="shrink-0 flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              onRemove(index);
            }}
            className="h-8 w-8 shrink-0"
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Metadata Form - Accordion Content */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="metadata" className="border-none">
          <AccordionTrigger className="px-3 py-2 text-xs hover:no-underline">
            {t("media.editMetadata", "Metadata")}
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3">
            <div className="space-y-3 pt-2">
              <FormInput
                control={control}
                fieldName={`files.${index}.filename`}
                inputSize="sm"
                label={t("files.filename", "Filename")}
                placeholder="Enter filename"
                type="text"
                disabled={disabled}
              />
              <FormTextarea
                control={control}
                fieldName={`files.${index}.alt`}
                inputSize="sm"
                label={t("files.alternativeText", "Alternative Text")}
                placeholder={t("files.describeTheImage", "Describe the image")}
                rows={2}
                disabled={disabled}
              />
              <FormTextarea
                control={control}
                fieldName={`files.${index}.caption`}
                inputSize="sm"
                label={t("files.caption", "Caption")}
                placeholder={t("files.addACaption", "Add a caption")}
                rows={2}
                disabled={disabled}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

interface MediaInputProps {
  variant?: "upload" | "select";
  value?: UploadFile | null;
  onChange?: (value: UploadFile | null) => void;
  onUploadComplete?: (files: UploadFile[]) => void;
  fileTypes?: MediaFileType | MediaFileType[]; // Types of files allowed. If not provided, defaults to image and video
  maxFiles?: number; // If not provided, unlimited files allowed
  disabled?: boolean;
}

/**
 * MediaInput component allows users to upload or select media files.
 * Supports "upload" and "select" modes.
 */
export const MediaInput = ({
  variant = "select",
  value,
  onChange,
  onUploadComplete,
  fileTypes,
  maxFiles,
  disabled,
}: MediaInputProps) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { uploadFile, isUploading } = useFileUpload();

  const acceptString = getAcceptString(fileTypes);

  // Form for managing file metadata
  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      files: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "files",
  });

  const handleFileSelect = (files: File[]) => {
    const filesToAdd = files.map((file) => ({
      file,
      filename: file.name,
      alt: "",
      caption: "",
    }));

    if (maxFiles === 1) {
      // Single file mode: replace existing files
      form.setValue("files", filesToAdd.slice(0, 1));
      return;
    }

    // Multiple files mode
    const currentCount = fields.length;
    const newTotal = currentCount + filesToAdd.length;

    if (maxFiles && newTotal > maxFiles) {
      toast.error(
        t("files.errorMaxFilesExceeded", "Maximum file limit exceeded"),
        {
          description: t(
            "files.errorMaxFilesExceededDescription",
            `You can only upload up to ${String(maxFiles)} files`
          ),
        }
      );
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

  const handleUpload = async () => {
    const formValues = form.getValues();

    if (formValues.files.length === 0) {
      return;
    }

    try {
      const result = await uploadFile(formValues.files);

      if (!result) {
        return;
      }

      if (Array.isArray(result) && result.length > 0) {
        if (variant === "upload") {
          // For upload-only mode, call onUploadComplete with all files
          onUploadComplete?.(result as unknown as UploadFile[]);
        } else {
          // For select mode, call onChange with the first file
          const firstFile = result[0];
          onChange?.(firstFile as unknown as UploadFile);
        }
        form.reset({ files: [] });
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const isDisabled = (disabled ?? false) || isUploading;

  return (
    <div className="space-y-4">
      {variant === "select" && (
        <MediaDropzone
          variant={variant}
          value={value}
          onFileSelect={handleFileSelect}
          onClick={() => {
            setIsModalOpen(true);
          }}
          onClear={() => {
            onChange?.(null);
          }}
          accept={acceptString}
          disabled={isDisabled}
        />
      )}

      {variant === "upload" && (
        <MediaDropzone
          variant={variant}
          value={null}
          onFileSelect={handleFileSelect}
          accept={acceptString}
          disabled={isDisabled}
          maxFiles={maxFiles}
        />
      )}

      {variant === "upload" && fields.length > 0 && (
        <div className="space-y-3">
          <div className="space-y-2">
            {fields.map((field, index) => (
              <MediaInputItem
                key={field.id}
                file={field.file}
                index={index}
                control={form.control}
                onRemove={handleRemoveFile}
                disabled={isDisabled}
              />
            ))}
          </div>

          <Button
            type="button"
            onClick={() => {
              void handleUpload();
            }}
            disabled={isDisabled}
            className="w-full"
          >
            {isUploading
              ? t("common.uploading", "Uploading...")
              : t("common.upload", "Upload")}
          </Button>
        </div>
      )}

      {variant === "select" && (
        <MediaModalPicker
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSelect={(file) => {
            onChange?.(file);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
