import { TFunction } from "i18next";
import { z } from "zod";

// ============================================================================
// Media Metadata Limits
// ============================================================================

/** Character limits for media metadata fields */
export const MEDIA_METADATA_LIMITS = {
    filename: 50,
    alt: 125,
    caption: 200,
} as const;

// ============================================================================
// Filename Validation
// ============================================================================

/**
 * Characters that are invalid in filenames across Windows, macOS, and Linux.
 * - Windows: \ / : * ? " < > |
 * - macOS/Linux: / and null character
 * We use the union of all to ensure cross-platform compatibility.
 */
const INVALID_FILENAME_CHARS = /[\\/:*?"<>|]/;

/**
 * Reserved filenames in Windows (case-insensitive).
 */
const WINDOWS_RESERVED_NAMES = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;

/**
 * Validates that a string is a valid filename (without extension).
 * 
 * Rules:
 * - Must not be empty or only whitespace
 * - Must not contain invalid characters: \ / : * ? " < > |
 * - Must not be a Windows reserved name (CON, PRN, AUX, NUL, COM1-9, LPT1-9)
 * - Must not start or end with a space or period
 * - Maximum length of 50 characters
 */
export const isValidFilename = (name: string): boolean => {
    if (name.length === 0 || name.trim().length === 0) return false;
    if (name.length > MEDIA_METADATA_LIMITS.filename) return false;
    if (INVALID_FILENAME_CHARS.test(name)) return false;
    if (WINDOWS_RESERVED_NAMES.test(name)) return false;
    if (name.startsWith(" ") || name.endsWith(" ")) return false;
    if (name.startsWith(".") || name.endsWith(".")) return false;
    return true;
};

/**
 * Creates a translated filename schema.
 * @param t - The i18next translation function
 */
export const createFilenameSchema = (t: TFunction) =>
    z
        .string()
        .min(1, t("media.validation.filenameRequired"))
        .max(MEDIA_METADATA_LIMITS.filename, t("media.validation.filenameMaxLength", { count: MEDIA_METADATA_LIMITS.filename }))
        .refine((val) => val.trim().length > 0, {
            message: t("media.validation.filenameEmpty"),
        })
        .refine((val) => !INVALID_FILENAME_CHARS.test(val), {
            message: t("media.validation.filenameInvalidChars"),
        })
        .refine((val) => !WINDOWS_RESERVED_NAMES.test(val), {
            message: t("media.validation.filenameReserved"),
        })
        .refine((val) => !val.startsWith(" ") && !val.endsWith(" "), {
            message: t("media.validation.filenameNoSpaces"),
        })
        .refine((val) => !val.startsWith(".") && !val.endsWith("."), {
            message: t("media.validation.filenameNoPeriods"),
        });

// ============================================================================
// Media Metadata Schemas
// ============================================================================

/**
 * Creates a translated schema for media asset form (used in MediaCard).
 * Alt and caption are optional for existing assets.
 * @param t - The i18next translation function
 */
export const createMediaAssetFormSchema = (t: TFunction) =>
    z.object({
        filename: createFilenameSchema(t),
        alt: z
            .string()
            .max(MEDIA_METADATA_LIMITS.alt, t("media.validation.altMaxLength", { count: MEDIA_METADATA_LIMITS.alt }))
            .optional(),
        caption: z
            .string()
            .max(MEDIA_METADATA_LIMITS.caption, t("media.validation.captionMaxLength", { count: MEDIA_METADATA_LIMITS.caption }))
            .optional(),
    });

/**
 * Creates a translated schema for file metadata in the upload zone field array.
 * @param t - The i18next translation function
 */
export const createUploadFileItemSchema = (t: TFunction) =>
    z.object({
        file: z.custom<File>(),
        filename: createFilenameSchema(t),
        extension: z.string(),
        alt: z.string().max(MEDIA_METADATA_LIMITS.alt, t("media.validation.altMaxLength", { count: MEDIA_METADATA_LIMITS.alt })),
        caption: z.string().max(MEDIA_METADATA_LIMITS.caption, t("media.validation.captionMaxLength", { count: MEDIA_METADATA_LIMITS.caption })),
    });

/**
 * Creates a translated schema for the upload form with array of files.
 * @param t - The i18next translation function
 */
export const createUploadFormSchema = (t: TFunction) =>
    z.object({
        files: z.array(createUploadFileItemSchema(t)),
    });

// ============================================================================
// Type Exports
// ============================================================================

export type MediaAssetFormValues = z.infer<ReturnType<typeof createMediaAssetFormSchema>>;
export type UploadFileItem = z.infer<ReturnType<typeof createUploadFileItemSchema>>;
export type UploadFormValues = z.infer<ReturnType<typeof createUploadFormSchema>>;
