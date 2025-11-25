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
 * Zod schema for validating filenames (without extension).
 * Use this in form schemas to validate filename inputs.
 */
export const filenameSchema = z
    .string()
    .min(1, "Filename is required")
    .max(MEDIA_METADATA_LIMITS.filename, `Filename must be less than ${String(MEDIA_METADATA_LIMITS.filename)} characters`)
    .refine((val) => val.trim().length > 0, {
        message: "Filename cannot be empty or only whitespace",
    })
    .refine((val) => !INVALID_FILENAME_CHARS.test(val), {
        message: "Filename contains invalid characters: \\ / : * ? \" < > |",
    })
    .refine((val) => !WINDOWS_RESERVED_NAMES.test(val), {
        message: "This filename is reserved and cannot be used",
    })
    .refine((val) => !val.startsWith(" ") && !val.endsWith(" "), {
        message: "Filename cannot start or end with a space",
    })
    .refine((val) => !val.startsWith(".") && !val.endsWith("."), {
        message: "Filename cannot start or end with a period",
    });

// ============================================================================
// Media Metadata Schemas
// ============================================================================

/**
 * Schema for media metadata fields (alt text and caption).
 */
export const mediaMetadataFieldsSchema = z.object({
    filename: filenameSchema,
    alt: z.string().max(MEDIA_METADATA_LIMITS.alt, `Alt text must be less than ${String(MEDIA_METADATA_LIMITS.alt)} characters`),
    caption: z.string().max(MEDIA_METADATA_LIMITS.caption, `Caption must be less than ${String(MEDIA_METADATA_LIMITS.caption)} characters`),
});

/**
 * Schema for file metadata in the upload zone field array.
 */
export const uploadFileItemSchema = z.object({
    file: z.custom<File>(),
    filename: filenameSchema,
    extension: z.string(), // Store extension separately to reconstruct on upload
    alt: z.string().max(MEDIA_METADATA_LIMITS.alt, `Alt text must be less than ${String(MEDIA_METADATA_LIMITS.alt)} characters`),
    caption: z.string().max(MEDIA_METADATA_LIMITS.caption, `Caption must be less than ${String(MEDIA_METADATA_LIMITS.caption)} characters`),
});

/**
 * Schema for the upload form with array of files.
 */
export const uploadFormSchema = z.object({
    files: z.array(uploadFileItemSchema),
});

// ============================================================================
// Type Exports
// ============================================================================

export type MediaMetadataFields = z.infer<typeof mediaMetadataFieldsSchema>;
export type UploadFileItem = z.infer<typeof uploadFileItemSchema>;
export type UploadFormValues = z.infer<typeof uploadFormSchema>;
