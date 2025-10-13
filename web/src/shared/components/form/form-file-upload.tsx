import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  FileUpload,
  type UploadType,
  type FileWithMetadata,
} from "../file-upload";
import { cn } from "@/shared/lib/utils";

interface FormFileUploadProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  uploadType?: UploadType;
  accept?: string;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
}

export function FormFileUpload<T extends FieldValues>({
  name,
  control,
  uploadType,
  accept,
  maxFiles,
  disabled = false,
  className,
}: FormFileUploadProps<T>) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const files = (value as FileWithMetadata[]) || [];

  return (
    <div className={cn("space-y-2", className)}>
      <FileUpload
        value={files}
        onChange={onChange}
        uploadType={uploadType}
        accept={accept}
        maxFiles={maxFiles}
        disabled={disabled}
      />
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
}
