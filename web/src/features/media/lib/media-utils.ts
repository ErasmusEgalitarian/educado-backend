import { mdiFile, mdiFileImage, mdiFileVideo } from "@mdi/js";

import { getBaseApiUrl } from "@/shared/config/api-config";

/* ----------------------------- I like comments ---------------------------- */

export type MediaFileType = "image" | "video" | "file";

/** [Educado] Returns a fully qualified URL for a media asset, handling relative paths and absolute URLs.
 * 
 * Examples:
 * - Input: "/uploads/image.jpg" => "http://localhost:1337/uploads/image.jpg"
 * - Input: "https://cdn.example.com/image.jpg" => "https://cdn.example.com/image.jpg"
 * - Input: "blob:http://localhost:3000/..." => "blob:http://localhost:3000/..."
 */
export const getAssetUrl = (url?: string): string => {
    if (url == null || url === "") return "";

    // Check for absolute URLs or blob URLs
    switch (true) {
        case url.startsWith("http://"):
        case url.startsWith("https://"):
        case url.startsWith("blob:"):
            return url; // needs no modification
    }

    // Normalize base: remove trailing slash and optional /api
    const base = getBaseApiUrl().replace(/\/$/, "");
    const publicBase = base.replace(/\/api$/, "");
    return publicBase + (url.startsWith("/") ? url : "/" + url);
};

/** [Educado] Extracts the file extension from a filename and returns it in uppercase.
 * 
 * Examples:
 * - "photo.jpg" => "JPG"
 * - "document.pdf" => "PDF"
 * - "archive" => ""
 * @param filename - The name of the file
 * @returns The file extension in uppercase, or empty string if none
 */
export const getFileExtension = (filename?: string) => {
    if (filename == null) return "";
    const parts = filename.split(".");
    return parts.length > 1 ? (parts.at(-1)?.toUpperCase() ?? "") : "";
};

export const isImage = (mime?: string) => mime?.startsWith("image/") ?? false;
export const isVideo = (mime?: string) => mime?.startsWith("video/") ?? false;

/** [Educado] Returns the media file type based on MIME type.
 * 
 * Examples:
 * - "image/jpeg" => "image"
 * - "video/mp4" => "video"
 * - "application/pdf" => "file"
 * 
 *  @param mime - The MIME type of the file
 *  @returns The media file type: "image", "video", or "file"
 */

export const getFileType = (mime?: string) => {
    if (isImage(mime)) return "image";
    if (isVideo(mime)) return "video";
    return "file";
};

/** [Educado] Returns the icon path for a media file based on MIME type.
 * 
 * Examples:
 * - "image/jpeg" => mdiFileImage
 * - "video/mp4" => mdiFileVideo
 * - "application/pdf" => mdiFile
 * @param mime - The MIME type of the file
 * @returns The icon path string from Material Design Icons
 */
export const getFileTypeIcon = (mime?: string) => {
    if (isImage(mime)) return mdiFileImage;
    if (isVideo(mime)) return mdiFileVideo;
    return mdiFile;
};

/**
 * [Educado] Returns a translated file type label based on MIME type.
 * 
 * Examples:
 * - "image/jpeg" => "Image"
 * - "video/mp4" => "Video"
 * - "application/pdf" => "File"
 * 
 * @param mime - The MIME type of the file
 * @param t - The translation function from useTranslation()
 * @returns Translated label for the file type
 */
export const getFileTypeLabel = (
    mime: string | undefined,
    t: (key: string) => string
): string => {
    if (isImage(mime)) return t("media.fileTypes.image");
    if (isVideo(mime)) return t("media.fileTypes.video");
    return t("media.fileTypes.file");
};

/** [Educado] Formats a byte size into a human-readable string.
 * 
 * Examples:
 * - 0 => "0 B"
 * - 500 => "500 B"
 * - 2048 => "2 KB"
 * - 1048576 => "1 MB"
 * 
 * @param bytes - The size in bytes
 * @returns Formatted size string
 */

export const formatBytes = (bytes?: number) => {
    if (bytes == null || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
        String(Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1))) +
        " " +
        sizes[i]
    );
};
// .

// Date formatting utility
export const formatDate = (dateString?: string) => {
    if (dateString == null || dateString === "") return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

/**
 * [Educado] Splits a filename into its name and extension parts.
 * 
 * Example: "photo.jpg" => { name: "photo", extension: ".jpg" }
 *
 * @param {string} filename - The full filename to split.
 * @returns {{ name: string; extension: string }} An object containing the name and extension.
 */
export const splitFilename = (
    filename: string
): { name: string; extension: string } => {
    const lastDotIndex = filename.lastIndexOf(".");
    if (lastDotIndex === -1 || lastDotIndex === 0) {
        // No extension or hidden file
        return { name: filename, extension: "" };
    }
    return {
        name: filename.substring(0, lastDotIndex),
        extension: filename.substring(lastDotIndex), // includes the dot
    };
};

/**
 * [Educado] Downloads a file from the given URL with the specified filename.
 * Triggers a browser download or opens in new tab if download fails.
 * Examples:
 * - src="https://example.com/image.jpg"
 * - filename=alt ??"downloaded-file"
 * 
 * @param {string} url - The URL of the file to download.
 * @param {string} filename - The desired filename for the downloaded file.
 */
export const downloadFile = async (url: string, filename: string) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = globalThis.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        globalThis.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Download failed:", error);
        window.open(url, "_blank");
    }
};

/**
 * File extensions considered as "file" type (documents, archives, etc.)
 * Used for both drag-and-drop validation and file picker accept string.
 */
const FILE_TYPE_EXTENSIONS = [
    ".pdf", ".doc", ".docx", ".xls", ".xlsx",
    ".ppt", ".pptx", ".txt", ".zip", ".rar", ".7z"
] as const;

/**
 * Accept string for the "file" type in file input elements.
 * Includes application/pdf MIME type plus all document extensions.
 */
const FILE_TYPE_ACCEPT_STRING = `application/pdf,${FILE_TYPE_EXTENSIONS.join(",")}`;

/**
 * [Educado] Checks if a file matches the allowed media file types.
 * 
 * Examples:
 * - file: image/jpeg, allowed: "image" => true
 * - file: video/mp4, allowed: ["image", "video"] => true
 * - file: application/pdf, allowed: "image" => false
 * 
 * @param {File} file - The file to validate.
 * @param {MediaFileType | MediaFileType[]} [fileTypes] - The allowed media file types.
 * @returns {boolean} True if the file matches the allowed types, false otherwise.
 */
export const isFileTypeAllowed = (
    file: File,
    fileTypes?: MediaFileType | MediaFileType[]
): boolean => {
    if (!fileTypes) {
        // Default: allow images and videos
        return file.type.startsWith("image/") || file.type.startsWith("video/");
    }

    const types = Array.isArray(fileTypes) ? fileTypes : [fileTypes];

    for (const type of types) {
        if (matchesFileType(file, type)) return true;
    }

    return false;
};

// Helper function to check if a file matches a specific MediaFileType
export const matchesFileType = (file: File, type: MediaFileType): boolean => {

    const TYPE_CHECKERS: Record<MediaFileType, (file: File) => boolean> = {
        image: (f) => isImage(f.type),
        video: (f) => isVideo(f.type),
        file: (f) => {
            const extension: string = "." + (f.name.split(".").pop()?.toLowerCase() ?? "");
            return f.type === "application/pdf" || (FILE_TYPE_EXTENSIONS as readonly string[]).includes(extension);
        },
    };

    return TYPE_CHECKERS[type](file);
};


/**
 * [Educado] Generates an accept string for file input based on specified media file types.
 * 
 * Example: ["image", "file"] => "image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.7z"
 *
 * This is useful for browsers to show the proper filepicker dialog, only allowing these types to be selected and
 * 
 * @param {MediaFileType | MediaFileType[]} [fileTypes] - The media file types to include.
 * @returns {string} The accept string for file input.
 */
export const getAcceptString = (fileTypes?: MediaFileType | MediaFileType[]): string => {
    if (!fileTypes) {
        // If no type specified, allow images and videos (common media)
        return "image/*,video/*";
    }

    const types = Array.isArray(fileTypes) ? fileTypes : [fileTypes];
    const acceptParts: string[] = [];

    for (const type of types) {
        switch (type) {
            case "image":
                acceptParts.push("image/*");
                break;
            case "video":
                acceptParts.push("video/*");
                break;
            case "file":
                acceptParts.push(FILE_TYPE_ACCEPT_STRING);
                break;
        }
    }

    return acceptParts.join(",");
};

/**
 * [Educado] Converts a File object to an UploadFile-like object for preview purposes.
 * Creates a temporary blob URL that should be revoked when no longer needed.
 * 
 * @param {File} file - The file to convert.
 * @param {Object} [options] - Optional configuration.
 * @param {string} [options.alt] - Optional alternative text.
 * @param {string} [options.url] - Optional pre-created blob URL (useful when managing URL lifecycle externally).
 * @returns {object} An UploadFile-like object with a blob URL.
 */
export const fileToUploadFilePreview = (
    file: File,
    options?: { alt?: string; url?: string }
) => {
    const url = options?.url ?? URL.createObjectURL(file);
    return {
        id: 0,
        name: file.name,
        mime: file.type,
        url,
        size: file.size / 1024, // Convert to KB
        alternativeText: options?.alt ?? "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
};
