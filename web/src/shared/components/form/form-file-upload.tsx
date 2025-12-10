import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { MediaPickerTrigger } from "@/features/media/components/media-picker-trigger";
import type { MediaFileType } from "@/features/media/lib/media-utils";
import type { UploadFile } from "@/shared/api/types.gen";
import { cn } from "@/shared/lib/utils";

import { FormDescription, FormLabel } from "../shadcn/form";

interface FormFileUploadProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  description?: string;
  isRequired?: boolean;
  fileTypes?: MediaFileType | MediaFileType[];
  maxFiles?: number;
  maxFileSize?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * React Hook Form integration for media file selection.
 * Uses MediaPickerTrigger to allow browsing library or uploading new files.
 */
export const FormFileUpload = <T extends FieldValues>({
  name,
  control,
  label,
  description,
  isRequired,
  fileTypes,
  maxFiles = 1,
  maxFileSize,
  disabled = false,
  className,
}: FormFileUploadProps<T>) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  // Support both single UploadFile and array of UploadFile
  const currentValue = value as UploadFile | UploadFile[] | null | undefined;
  const singleValue = Array.isArray(currentValue)
    ? (currentValue[0] ?? null)
    : (currentValue ?? null);

  const handleChange = (file: UploadFile | null) => {
    // If maxFiles is 1, store as single value, otherwise as array
    if (maxFiles === 1) {
      onChange(file);
    } else {
      onChange(file ? [file] : []);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <FormLabel required={isRequired}>{label}</FormLabel>}
      <MediaPickerTrigger
        value={singleValue}
        onChange={handleChange}
        fileTypes={fileTypes}
        maxFiles={maxFiles}
        maxFileSize={maxFileSize}
        disabled={disabled}
      />
      {description && (
        <FormDescription className="text-right">{description}</FormDescription>
      )}
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
};
