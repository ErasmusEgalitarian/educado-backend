import { mdiFile, mdiFileImage, mdiFileVideo } from "@mdi/js";

import { getBaseApiUrl } from "@/shared/config/api-config";

export type MediaFileType = "image" | "video" | "file";

export const getAssetUrl = (url?: string): string => {
    if (url == null || url === "") return "";
    if (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("blob:")
    )
        return url;
    // Normalize base: remove trailing slash and optional /api
    const base = getBaseApiUrl().replace(/\/$/, "");
    const publicBase = base.replace(/\/api$/, "");
    return publicBase + (url.startsWith("/") ? url : "/" + url);
};

export const getFileExtension = (filename?: string) => {
    if (filename == null) return "";
    const parts = filename.split(".");
    return parts.length > 1 ? (parts.at(-1)?.toUpperCase() ?? "") : "";
};

export const isImage = (mime?: string) => mime?.startsWith("image/") ?? false;
export const isVideo = (mime?: string) => mime?.startsWith("video/") ?? false;

export const getFileType = (mime?: string) => {
    if (isImage(mime)) return "image";
    if (isVideo(mime)) return "video";
    return "file";
};

export const getFileTypeIcon = (mime?: string) => {
    if (isImage(mime)) return mdiFileImage;
    if (isVideo(mime)) return mdiFileVideo;
    return mdiFile;
};

/**
 * Returns a translated file type label based on MIME type.
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

// TODO: Move to date utils
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
 * Splits a filename into its name and extension parts.
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
 * Downloads a file from the given URL with the specified filename.
 * Triggers a browser download or opens in new tab if download fails.
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
 * Generates an accept string for file input based on specified media file types.
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
                acceptParts.push(
                    "application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.7z"
                );
                break;
        }
    }

    return acceptParts.join(",");
};

/**
 * Converts a File object to an UploadFile-like object for preview purposes.
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
