import {
  type Control,
  type FieldValues,
  type Path,
  useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormInput } from "@/shared/components/form/form-input";
import { FormTextarea } from "@/shared/components/form/form-textarea";

import { MEDIA_METADATA_LIMITS } from "../lib/media-schemas";

interface MediaMetadataFormProps<TFieldValues extends FieldValues> {
  /** React Hook Form control */
  control: Control<TFieldValues>;
  /** Base path for field names (e.g., "" for root level or "files.0" for nested) */
  basePath?: string;
  /** Field name mapping - allows customizing field names */
  fieldNames?: {
    filename?: string;
    alt?: string;
    caption?: string;
  };
  /** Whether fields are disabled */
  disabled?: boolean;
  /** Optional file extension to display (for existing files) */
  fileExtension?: string;
  /** Size of the input fields */
  inputSize?: "xs" | "sm" | "md" | "lg";
}

/**
 * Reusable form fields for media metadata (filename, alt text, caption).
 * Used in both MediaCard (editing existing assets) and MediaUploadZone (new uploads).
 *
 * Must be used inside a <Form> provider from shadcn/ui.
 */
export const MediaMetadataForm = <TFieldValues extends FieldValues>({
  control,
  basePath = "",
  fieldNames = {},
  disabled = false,
  fileExtension,
  inputSize = "sm",
}: MediaMetadataFormProps<TFieldValues>) => {
  const { t } = useTranslation();

  // Build field paths, supporting both root-level and nested fields
  const getFieldPath = (field: string): Path<TFieldValues> => {
    const customName = fieldNames[field as keyof typeof fieldNames];
    if (customName) return customName as Path<TFieldValues>;

    if (basePath) {
      return `${basePath}.${field}` as Path<TFieldValues>;
    }
    return field as Path<TFieldValues>;
  };

  // Watch field values for character counts
  const filenameValue = useWatch({
    control,
    name: getFieldPath("filename"),
  }) as string | undefined;
  const altValue = useWatch({ control, name: getFieldPath("alt") }) as
    | string
    | undefined;
  const captionValue = useWatch({ control, name: getFieldPath("caption") }) as
    | string
    | undefined;

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <FormInput
          control={control}
          fieldName={getFieldPath("filename")}
          inputSize={inputSize}
          label={t("media.fileName")}
          placeholder={t("media.fileNamePlaceholder")}
          type="text"
          isRequired
          disabled={disabled}
          maxLength={MEDIA_METADATA_LIMITS.filename}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          {fileExtension ? (
            <span>
              {t("media.extension")}:{" "}
              <span className="font-medium">{fileExtension}</span>
            </span>
          ) : (
            <span />
          )}
          <span>
            {filenameValue?.length ?? 0} / {MEDIA_METADATA_LIMITS.filename}
          </span>
        </div>
      </div>

      <div>
        <FormTextarea
          control={control}
          fieldName={getFieldPath("alt")}
          inputSize={inputSize}
          label={t("media.alternativeText")}
          placeholder={t("media.alternativeTextPlaceholder")}
          rows={2}
          maxLength={MEDIA_METADATA_LIMITS.alt}
          disabled={disabled}
        />
        <div className="text-right text-xs text-muted-foreground mt-1">
          {altValue?.length ?? 0} / {MEDIA_METADATA_LIMITS.alt}
        </div>
      </div>

      <div>
        <FormTextarea
          control={control}
          fieldName={getFieldPath("caption")}
          inputSize={inputSize}
          label={t("media.caption")}
          placeholder={t("media.captionPlaceholder")}
          rows={2}
          maxLength={MEDIA_METADATA_LIMITS.caption}
          disabled={disabled}
        />
        <div className="text-right text-xs text-muted-foreground mt-1">
          {captionValue?.length ?? 0} / {MEDIA_METADATA_LIMITS.caption}
        </div>
      </div>
    </div>
  );
};
