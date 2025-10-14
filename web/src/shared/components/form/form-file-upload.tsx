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
  // Optional: seed the control with already-selected files (File objects)
  initialFiles?: FileWithMetadata[];
}

export function FormFileUpload<T extends FieldValues>({
  name,
  control,
  uploadType,
  accept,
  maxFiles,
  disabled = false,
  className,
  initialFiles,
}: FormFileUploadProps<T>) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const files = (value as FileWithMetadata[]) || [];

  // Seed initial files into RHF value once if none present
  // This does not alter UI logic; it simply sets the field value
  // so the uploader renders them as already selected.
  if ((!files || files.length === 0) && initialFiles && initialFiles.length > 0) {
    onChange(initialFiles);
  }

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
