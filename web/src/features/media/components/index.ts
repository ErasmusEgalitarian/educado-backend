/**
 * Media Components - Architecture and Usage
 * =====================================
 * 
 * This module provides a clean, composable set of components for media management:
 * - Uploading files
 * - Browsing/selecting from media library
 * - Previewing media assets
 * 
 * ## Component Hierarchy
 * 
 * ### Primitives (Building Blocks)
 * - `MediaUploadCard` - Dashed card UI for triggering file selection (drag & drop + click)
 * - `MediaAssetPreview` - Renders preview for images, videos, or file icons
 * - `MediaFilePreviewItem` - Single file preview with collapsible metadata editing (internal)
 * 
 * ### Composites (Complete Features)
 * - `MediaUploadZone` - Full upload flow: card + preview list + metadata + upload button
 * - `MediaPickerTrigger` - Trigger card that opens picker modal, shows selected preview
 * - `MediaPickerModal` - Modal with tabs for uploading new or browsing existing assets
 * 
 * ### Form Integration
 * - `FormFileUpload` - React Hook Form wrapper using MediaPickerTrigger
 * 
 * ## Usage Examples
 * 
 * ### 1. Simple upload zone (e.g., Media Library page)
 * ```tsx
 * <MediaUploadZone
 *   fileTypes={["image", "video"]}
 *   maxFiles={10}
 *   onUploadComplete={(files) => console.log('Uploaded:', files)}
 * />
 * ```
 * 
 * ### 2. File picker for forms (select from library or upload)
 * ```tsx
 * <MediaPickerTrigger
 *   value={selectedFile}
 *   onChange={setSelectedFile}
 *   fileTypes="image"
 *   maxFiles={1}
 * />
 * ```
 * 
 * ### 3. React Hook Form integration
 * ```tsx
 * <FormFileUpload
 *   name="coverImage"
 *   control={form.control}
 *   fileTypes="image"
 * />
 * ```
 * 
 * ## Props Reference
 * 
 * Common props across components:
 * - `fileTypes?: MediaFileType | MediaFileType[]` - Allowed file types: "image" | "video" | "file"
 * - `maxFiles?: number` - Maximum files allowed (1 for single-select mode)
 * - `disabled?: boolean` - Disable interaction
 * 
 * @module media/components
 */

// Primitives
export { MediaUploadCard } from "./media-upload-card";
export { MediaAssetPreview } from "./media-asset-preview";
export type { MediaPreviewSize } from "./media-asset-preview";

// Shared Form Fields
export { MediaMetadataForm } from "./media-metadata-form";

// Re-export schemas and validation utilities from lib
export {
    MEDIA_METADATA_LIMITS,
    filenameSchema,
    isValidFilename,
    mediaMetadataFieldsSchema,
    uploadFileItemSchema,
    uploadFormSchema,
    type MediaMetadataFields,
    type UploadFileItem,
    type UploadFormValues,
} from "../lib/media-schemas";

// Composites
export { MediaUploadZone } from "./media-upload-zone";
export { MediaPickerTrigger } from "./media-picker-trigger";
export { default as MediaPickerModal } from "./media-picker-modal";

// Display/Editor (for media library page)
export { default as MediaDisplayEditor } from "./media-display-editor";
export type { MediaEditorMode } from "./media-display-editor";

// Card variants (for grid display)
export { MediaCard } from "./media-card";

// Fullscreen preview
export { ImageFullscreenPreview } from "./image-fullscreen-preview";
