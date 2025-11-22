import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { MediaInput } from "@/features/media/components/media-input";
import type { MediaFileType } from "@/features/media/lib/media-utils";
import type { UploadFile } from "@/shared/api/types.gen";
import { cn } from "@/shared/lib/utils";

interface FormFileUploadProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  fileTypes?: MediaFileType | MediaFileType[];
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
}

export const FormFileUpload = <T extends FieldValues>({
  name,
  control,
  fileTypes,
  maxFiles = 1,
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
      <MediaInput
        variant="select"
        value={singleValue}
        onChange={handleChange}
        fileTypes={fileTypes}
        maxFiles={maxFiles}
        disabled={disabled}
      />
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
};
