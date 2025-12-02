import { mdiFile } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";

import { type UploadFile } from "@/shared/api/types.gen";
import { cn } from "@/shared/lib/utils";

import { getAssetUrl, isImage, isVideo } from "../lib/media-utils";

import { ImageFullscreenPreview } from "./image-fullscreen-preview";

// Strapi image formats interfaces
interface StrapiImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

interface StrapiImageFormats {
  large?: StrapiImageFormat;
  medium?: StrapiImageFormat;
  small?: StrapiImageFormat;
  thumbnail?: StrapiImageFormat;
}

export type MediaPreviewSize =
  | "thumbnail"
  | "small"
  | "medium"
  | "large"
  | "original";

interface MediaAssetPreviewProps {
  asset: UploadFile;
  className?: string;
  imageClassName?: string;
  /** Whether to show controls for video */
  showVideoControls?: boolean;
  /** Whether to enable full screen preview for images */
  enableFullScreen?: boolean;
  /**
   * Size of the image to display.
   * Defaults to "medium" to optimize performance.
   */
  size?: MediaPreviewSize;
}

/**
 * Displays a preview of a media asset (image, video, or file icon)
 * Handles different mime types and renders appropriate preview
 */
export const MediaAssetPreview = ({
  asset,
  className,
  imageClassName,
  showVideoControls = true,
  enableFullScreen = false,
  size = "medium",
}: MediaAssetPreviewProps) => {
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);

  if (asset.url === undefined || asset.mime === undefined) {
    return null;
  }

  const getUrlForSize = (s: MediaPreviewSize) => {
    if (s === "original") return asset.url;

    // Cast formats because generated types might be incorrect
    const formats = asset.formats as unknown as StrapiImageFormats | undefined;

    return formats?.[s]?.url ?? asset.url;
  };

  if (isImage(asset.mime)) {
    const displayUrl = getAssetUrl(getUrlForSize(size));
    const fullScreenUrl = getAssetUrl(asset.url);

    const content = (
      <img
        src={displayUrl}
        alt={asset.alternativeText ?? asset.name}
        className={cn("h-full w-full object-cover", imageClassName)}
        loading="lazy"
      />
    );

    if (enableFullScreen) {
      return (
        <>
          <button
            type="button"
            className={cn(
              "w-full bg-muted cursor-pointer block p-0 border-0 overflow-hidden",
              className
            )}
            onClick={(e) => {
              e.stopPropagation();
              setIsFullScreenOpen(true);
            }}
          >
            {content}
          </button>
          <ImageFullscreenPreview
            src={fullScreenUrl}
            alt={asset.alternativeText ?? asset.name}
            isOpen={isFullScreenOpen}
            onClose={() => {
              setIsFullScreenOpen(false);
            }}
          />
        </>
      );
    }

    return (
      <div className={cn("aspect-video w-full bg-muted", className)}>
        {content}
      </div>
    );
  }

  if (isVideo(asset.mime)) {
    return (
      <div className={cn("aspect-video w-full bg-muted", className)}>
        <video
          src={getAssetUrl(asset.url)}
          className="h-full w-full object-cover"
          controls={showVideoControls}
        />
      </div>
    );
  }

  // Default: show file icon for other types
  return (
    <div
      className={cn(
        "aspect-video flex w-full items-center justify-center bg-muted",
        className
      )}
    >
      <Icon path={mdiFile} size={2} className="text-muted-foreground" />
    </div>
  );
};
