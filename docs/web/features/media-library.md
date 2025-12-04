# Media Feature

Technical documentation for the media library feature, which provides a complete system for uploading, browsing, previewing, and managing media assets (images, videos, documents).

## Overview

The media library integrates with Strapi's upload API and follows the application's feature-based architecture. It supports:

- File upload with drag-and-drop
- Metadata editing (filename, alt text, caption) before or after upload
- Image preview with zoom, rotate, and download
- Video playback
- Responsive image sizes
- Bulk delete operations
- Form integration with React Hook Form

## Architecture

```
features/media/
├── api/
│   └── media-mutations.tsx
├── components/
│   ├── index.ts
│   ├── image-fullscreen-preview.tsx
│   ├── media-asset-preview.tsx
│   ├── media-bulk-actions.tsx
│   ├── media-card.tsx
│   ├── media-display-editor.tsx
│   ├── media-metadata-form.tsx
│   ├── media-picker-modal.tsx
│   ├── media-picker-trigger.tsx
│   ├── media-upload-card.tsx
│   └── media-upload-zone.tsx
├── hooks/
│   └── use-file-upload.ts
├── lib/
│   ├── media-columns.tsx
│   ├── media-schemas.ts
│   └── media-utils.ts
└── pages/
    └── media-overview-page.tsx
```

### File Reference

| File | Purpose |
|------|---------|
| **api/** | |
| `media-mutations.tsx` | TanStack Query mutations for upload, update, delete, and bulk delete operations |
| **components/** | |
| `index.ts` | Public exports and module documentation |
| `image-fullscreen-preview.tsx` | Modal for viewing images with zoom, pan, rotate, and download controls |
| `media-asset-preview.tsx` | Renders appropriate preview based on MIME type (image, video, or file icon) |
| `media-bulk-actions.tsx` | UI panel for multi-select operations (bulk delete) |
| `media-card.tsx` | Card component with compact (grid) and extended (sidebar) variants for displaying assets |
| `media-display-editor.tsx` | Wrapper around DataDisplay for browsing media with grid/table views and selection |
| `media-metadata-form.tsx` | Reusable form fields for filename, alt text, and caption |
| `media-picker-modal.tsx` | Modal with tabs for uploading new files or browsing existing library |
| `media-picker-trigger.tsx` | Clickable trigger that opens picker modal, shows selected asset preview |
| `media-upload-card.tsx` | Dashed dropzone card for drag-and-drop or click file selection |
| `media-upload-zone.tsx` | Complete upload flow: dropzone + file previews + metadata editing + upload button |
| **hooks/** | |
| `use-file-upload.ts` | Hook for uploading files with FormData and metadata to Strapi |
| **lib/** | |
| `media-columns.tsx` | TanStack Table column definitions for media table view |
| `media-schemas.ts` | Zod validation schemas for filenames and metadata fields |
| `media-utils.ts` | Utility functions for URLs, file types, formatting, and downloads |
| **pages/** | |
| `media-overview-page.tsx` | Main media library page combining upload zone and display editor |

### Component Hierarchy

```
MediaPickerTrigger (form integration)
└── MediaPickerModal
    ├── Tab: Upload
    │   └── MediaUploadZone
    │       ├── MediaUploadCard (dropzone)
    │       └── MediaFilePreviewItem[] (per file)
    │           ├── MediaAssetPreview
    │           └── MediaMetadataForm
    │
    └── Tab: Browse
        └── MediaDisplayEditor
            └── DataDisplay (grid of MediaCards)
                └── MediaCard
                    ├── MediaAssetPreview
                    └── ImageFullscreenPreview (on click)
```

---

## Components

### Primary Components

#### `MediaUploadZone`

Complete upload flow with file selection, previews, metadata editing, and upload button.

```tsx
import { MediaUploadZone } from "@/features/media/components/media-upload-zone";

<MediaUploadZone
  fileTypes={["image", "video"]}
  maxFiles={10}
  onUploadComplete={(files) => {
    console.log("Uploaded:", files);
  }}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fileTypes` | `MediaFileType \| MediaFileType[]` | `["image", "video"]` | Allowed file types |
| `maxFiles` | `number` | `undefined` | Maximum files allowed |
| `onUploadComplete` | `(files: UploadFile[]) => void` | — | Callback after successful upload |
| `disabled` | `boolean` | `false` | Disable all interactions |
| `uploadButtonLabel` | `string` | `t("common.upload")` | Custom upload button label |
| `secondaryAction` | `{ label: string; onClick: (files: UploadFile[]) => void }` | — | Optional secondary action button |

---

#### `MediaPickerTrigger`

Trigger component for opening the media picker modal. Displays either a placeholder card or a preview of the selected asset.

```tsx
import { MediaPickerTrigger } from "@/features/media/components/media-picker-trigger";

const [selectedFile, setSelectedFile] = useState<UploadFile | null>(null);

<MediaPickerTrigger
  value={selectedFile}
  onChange={setSelectedFile}
  fileTypes="image"
  maxFiles={1}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `UploadFile \| null` | — | Current selected file |
| `onChange` | `(file: UploadFile \| null) => void` | — | Selection change callback |
| `fileTypes` | `MediaFileType \| MediaFileType[]` | — | Allowed file types |
| `maxFiles` | `number` | `1` | Max files for upload in modal |
| `disabled` | `boolean` | `false` | Disable interactions |

---

#### `FormFileUpload`

React Hook Form integration wrapper around `MediaPickerTrigger`.

```tsx
import { FormFileUpload } from "@/shared/components/form/form-file-upload";

<FormFileUpload
  name="coverImage"
  control={form.control}
  fileTypes="image"
  maxFiles={1}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `Path<T>` | — | Form field name |
| `control` | `Control<T>` | — | React Hook Form control |
| `fileTypes` | `MediaFileType \| MediaFileType[]` | — | Allowed file types |
| `maxFiles` | `number` | `1` | Maximum files |
| `disabled` | `boolean` | `false` | Disable interactions |

---

#### `MediaDisplayEditor`

Wrapper around `DataDisplay` for browsing the media library with grid/table views and optional selection.

```tsx
import MediaDisplayEditor from "@/features/media/components/media-display-editor";

<MediaDisplayEditor
  defaultMode="edit"
  enableBulkActions={true}
  onSelectionChange={(asset) => {
    console.log("Selected:", asset);
  }}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultMode` | `"view" \| "edit" \| "select"` | `"view"` | Initial display mode |
| `onSelectionChange` | `(asset: UploadFile \| null) => void` | — | Selection callback |
| `enableBulkActions` | `boolean` | `true` | Enable multi-select bulk operations |
| `selectionLimit` | `number \| null` | — | Max selectable items (`null` = unlimited) |

---

### Primitive Components

#### `MediaAssetPreview`

Renders a preview based on asset MIME type: image, video player, or file icon.

1. For images, `ImageFullscreenPreview` is available on click (if `enableFullScreen` is true).
2. For videos, an HTML5 video player with controls is shown.
3. For other files, a file icon with filename is displayed.

```tsx
import { MediaAssetPreview } from "@/features/media/components/media-asset-preview";

<MediaAssetPreview
  asset={uploadFile}
  size="medium"
  enableFullScreen={true}
  showVideoControls={true}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asset` | `UploadFile` | — | The asset to preview |
| `size` | `MediaPreviewSize` | `"medium"` | Image size variant |
| `enableFullScreen` | `boolean` | `false` | Enable fullscreen for images |
| `showVideoControls` | `boolean` | `true` | Show video player controls |
| `className` | `string` | — | Container class |
| `imageClassName` | `string` | — | Image element class |

**Size variants:**

The size variant determines which responsive image to fetch from Strapi. If the requested size is unavailable, it falls back to the original image URL.

| Size | Typical Usage |
|------|---------------|
| `thumbnail` | Table rows, small previews |
| `small` | Grid cards |
| `medium` | Selection preview, modal thumbnails |
| `large` | Large displays |
| `original` | Fullscreen preview |

---

#### `MediaUploadCard`

Dashed dropzone card for triggering file selection via drag-and-drop or click.

```tsx
import { MediaUploadCard } from "@/features/media/components/media-upload-card";

<MediaUploadCard
  fileTypes={["image", "video"]}
  maxFiles={5}
  onFilesSelected={(files) => {
    console.log("Selected files:", files);
  }}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fileTypes` | `MediaFileType \| MediaFileType[]` | `["image", "video"]` | Allowed file types |
| `maxFiles` | `number` | — | Maximum files allowed |
| `onFilesSelected` | `(files: File[]) => void` | — | File selection callback |
| `disabled` | `boolean` | `false` | Disable interactions |

---

#### `MediaMetadataForm`

Reusable form fields for filename, alt text, and caption. Must be used inside a `<Form>` provider.

Validation happens in the parent. Refer to the reusable schemas in `media-schemas.ts`.

```tsx
import { MediaMetadataForm } from "@/features/media/components/media-metadata-form";

<Form {...form}>
  <MediaMetadataForm
    control={form.control}
    basePath="files.0"
    fileExtension=".jpg"
    inputSize="sm"
  />
</Form>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `control` | `Control<T>` | — | React Hook Form control |
| `basePath` | `string` | `""` | Field name prefix (e.g., `"files.0"`) |
| `fieldNames` | `{ filename?, alt?, caption? }` | — | Custom field name mapping |
| `disabled` | `boolean` | `false` | Disable all fields |
| `fileExtension` | `string` | — | Extension to display (e.g., `.jpg`) |
| `inputSize` | `"xs" \| "sm" \| "md" \| "lg"` | `"sm"` | Input field size |

---

#### `ImageFullscreenPreview`

Modal for viewing images in fullscreen with zoom, pan, rotate, and download controls.

> [!CAUTION]
> The transformations are pure CSS only and do not modify the original image. Ideally rotation should be saved back to the server via metadata update. Perhaps cropping could be supported in the future as well.

```tsx
import { ImageFullscreenPreview } from "@/features/media/components/image-fullscreen-preview";

<ImageFullscreenPreview
  src="https://example.com/image.jpg"
  alt="Description"
  isOpen={isPreviewOpen}
  onClose={() => setIsPreviewOpen(false)}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | — | Image URL |
| `alt` | `string` | `"Preview"` | Alt text |
| `isOpen` | `boolean` | — | Modal visibility |
| `onClose` | `() => void` | — | Close callback |

**Keyboard shortcuts:**
- `Escape` — Close modal
- `+` / `-` — Zoom in/out
- `R` — Rotate 90°

---

## Utility Functions

Located in `features/media/lib/media-utils.ts`.

### URL Handling

#### `getAssetUrl(url?: string): string`

Constructs a full URL for an asset, handling relative paths and different URL formats.

```ts
getAssetUrl("/uploads/image.jpg");
// => "http://localhost:1337/uploads/image.jpg"

getAssetUrl("https://cdn.example.com/image.jpg");
// => "https://cdn.example.com/image.jpg"
```

### File Type Detection

#### `getFileType(mime?: string): "image" | "video" | "file"`

Returns the media file type based on MIME type.

```ts
getFileType("image/png");  // => "image"
getFileType("video/mp4");  // => "video"
getFileType("application/pdf");  // => "file"
```

#### `isFileTypeAllowed(file: File, fileTypes?: MediaFileType | MediaFileType[]): boolean`

Validates if a file matches allowed media types.

```ts
isFileTypeAllowed(pngFile, ["image", "video"]);  // => true
isFileTypeAllowed(pdfFile, "image");  // => false
```

### File Utilities

#### `splitFilename(filename: string): { name: string; extension: string }`

Splits a filename into name and extension parts.

```ts
splitFilename("photo.jpg");
// => { name: "photo", extension: ".jpg" }
```

#### `getFileExtension(filename?: string): string`

Returns the uppercase file extension.

```ts
getFileExtension("document.pdf");  // => "PDF"
```

#### `formatBytes(bytes?: number): string`

Formats byte size into human-readable string.

```ts
formatBytes(1536);  // => "1.5 KB"
formatBytes(2097152);  // => "2 MB"
```

#### `getAcceptString(fileTypes?: MediaFileType | MediaFileType[]): string`

Generates an `accept` attribute string for file inputs.

```ts
getAcceptString(["image", "file"]);
// => "image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.7z"
```

#### `downloadFile(url: string, filename: string): Promise<void>`

Downloads a file from URL, falling back to opening in new tab if download fails.

```ts
await downloadFile("https://example.com/doc.pdf", "document.pdf");
```

#### `fileToUploadFilePreview(file: File, options?): object`

Converts a `File` to an `UploadFile`-like object for preview purposes.

```ts
const preview = fileToUploadFilePreview(file, { alt: "My image" });
// Creates object with blob URL for immediate preview
```

---

## Validation Schemas

Located in `features/media/lib/media-schemas.ts`.

### Character Limits

```ts
MEDIA_METADATA_LIMITS = {
  filename: 50,   // Cross-platform safe
  alt: 64,       // Used by screen readers and if images fail to load
  caption: 200,  // Use to describe the media content. Often displayed below images.
}
```

### Filename Validation

The `isValidFilename(name: string)` function and `createFilenameSchema(t)` factory validate filenames with these rules:

- Not empty or whitespace only
- Maximum `MEDIA_METADATA_LIMITS.filename` characters
- No invalid characters: `\ / : * ? " < > |`
- Not a Windows reserved name: `CON`, `PRN`, `AUX`, `NUL`, `COM1-9`, `LPT1-9`
- No leading/trailing spaces or periods

### Schema Factories

All schemas accept a translation function for localized error messages:

```ts
import { createMediaAssetFormSchema } from "@/features/media/lib/media-schemas";

const schema = createMediaAssetFormSchema(t);
```

| Factory | Purpose |
|---------|---------|
| `createFilenameSchema(t)` | Filename field validation |
| `createMediaAssetFormSchema(t)` | Existing asset metadata (filename, alt, caption) |
| `createUploadFileItemSchema(t)` | Single file in upload queue |
| `createUploadFormSchema(t)` | Upload form with files array |

---

## API Mutations

Located in `features/media/api/media-mutations.tsx`.

### `useUploadFilesMutation()`

Upload one or more files with optional metadata.

```ts
const uploadMutation = useUploadFilesMutation();

uploadMutation.mutate({
  files: [file1, file2],
  fileInfo: [
    { name: "photo1", alternativeText: "A photo", caption: "Caption" },
    { name: "photo2" },
  ],
});
```

### `useUpdateFileMetadataMutation()`

Update metadata for an existing file.

```ts
const updateMutation = useUpdateFileMetadataMutation();

updateMutation.mutate({
  fileId: 123,
  name: "new-name",
  alternativeText: "Updated alt text",
  caption: "Updated caption",
});
```

### `useDeleteFileMutation()`

Delete a single file.

```ts
const deleteMutation = useDeleteFileMutation();
deleteMutation.mutate(fileId);
```

### `useBulkDeleteFilesMutation()`

Delete multiple files, returning success/failure results.

```ts
const bulkDeleteMutation = useBulkDeleteFilesMutation();

bulkDeleteMutation.mutate([1, 2, 3], {
  onSuccess: (result) => {
    console.log("Deleted:", result.succeeded);
    console.log("Failed:", result.failed);
  },
});
```

---

## Hooks

### `useFileUpload()`

Low-level upload hook with FormData handling.

```ts
import { useFileUpload } from "@/features/media/hooks/use-file-upload";

const { uploadFile, isUploading } = useFileUpload();

const result = await uploadFile([
  { file, filename: "photo.jpg", alt: "Alt text", caption: "Caption" },
]);
```

---

## Usage Examples

### 1. Media Overview Page

The media library page (`media-overview-page.tsx`) combines upload and browse functionality:

```tsx
const MediaOverviewPage = () => {
  const queryClient = useQueryClient();
  const [showUploader, setShowUploader] = useState(false);

  const handleUploadComplete = async () => {
    setShowUploader(false);
    await queryClient.invalidateQueries({ queryKey: [["media"]] });
  };

  return (
    <PageContainer title={t("media.pageTitle")}>
      <Card>
        <CardHeader>
          <CardTitle>{t("media.pageTitle")}</CardTitle>
          <CardAction>
            <Button onClick={() => setShowUploader((v) => !v)}>
              {showUploader ? t("media.hideUpload") : t("media.upload")}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {showUploader && (
            <MediaUploadZone
              onUploadComplete={() => void handleUploadComplete()}
              maxFiles={15}
              fileTypes={["file", "video", "image"]}
            />
          )}
          <MediaDisplayEditor defaultMode="edit" />
        </CardContent>
      </Card>
    </PageContainer>
  );
};
```

### 2. Course Cover Image (Form Integration)

The course editor uses `FormFileUpload` for the cover image field:

```tsx
import { FormFileUpload } from "@/shared/components/form/form-file-upload";

// Inside form component
<FormFileUpload
  fileTypes="image"
  control={form.control}
  name="image"
  maxFiles={1}
/>
```

### 3. Controlled Picker (Test Page)

Direct usage of `MediaPickerTrigger` with React Hook Form:

```tsx
const form = useForm<{ image: UploadFile }>({
  resolver: zodResolver(formSchema),
});

<MediaPickerTrigger
  value={form.watch("image")}
  onChange={(file) => {
    form.setValue("image", file ?? undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }}
  fileTypes="image"
  maxFiles={1}
/>
```

---

## File Type Support

| Type | Extensions | Preview |
|------|------------|---------|
| `image` | All image formats | Full preview with fullscreen option |
| `video` | All video formats | Inline player with controls |
| `file` | PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, ZIP, RAR, 7Z | File icon |
