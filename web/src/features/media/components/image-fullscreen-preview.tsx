import { Download, RotateCw, X, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/shared/components/shadcn/button";

import { downloadFile } from "../lib/media-utils";
import React from "react";

interface ImageFullscreenPreviewProps {
  src: string;
  alt?: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * A modal component that renders an image in fullscreen mode with interactive controls.
 *
 * This component provides a rich viewing experience including:
 * - **Zooming**: Users can zoom in/out using buttons, mouse wheel, or keyboard shortcuts (+/-).
 * - **Panning**: When zoomed in, the image can be dragged to view different parts.
 * - **Rotation**: The image can be rotated 90 degrees clockwise (visual only).
 * - **Downloading**: Includes a utility to download the currently viewed image.
 * - **Accessibility**: Supports keyboard navigation (Escape to close, +/- to zoom, R to rotate).
 *
 * NOTE: All transformations (zoom, pan, rotate) are handled via CSS,
 * not modifying the actual image data.
 *
 * @component
 * @example
 * ```tsx
 * <ImageFullscreenPreview
 *   src="https://example.com/image.jpg"
 *   alt="Description of image"
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 * />
 * ```
 *
 * @param {ImageFullscreenPreviewProps} props - The component props.
 * @param {string} props.src - The source URL of the image to display.
 * @param {string} [props.alt="Preview"] - The alternative text for the image.
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {() => void} props.onClose - Callback function triggered when the modal requests to close (via button, escape key, or backdrop click).
 *
 * @returns {React.JSX.Element | null} The fullscreen modal portal or null if `isOpen` is false.
 */
export const ImageFullscreenPreview = ({
  src,
  alt = "Preview",
  isOpen,
  onClose,
}: ImageFullscreenPreviewProps): React.JSX.Element | null => {
  // State for zoom, position, dragging, and rotation
  // Only used for CSS transforms
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  // Pan
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      handleViewerReset();
    }
  }, [isOpen]);

  // Handle zoom
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 5));
  };
  const handleZoomOut = () => {
    setScale((prev) => {
      if (prev <= 0.5) return prev;
      return Math.max(prev - 0.5, 0.5);
    });
  };
  const handleViewerReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setScale((prev) => Math.max(0.5, Math.min(5, prev + delta)));
  };

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          e.stopPropagation();
          onClose();
          break;
        case "+":
        case "=":
          e.preventDefault();
          e.stopPropagation();
          handleZoomIn();
          break;
        case "-":
          e.preventDefault();
          e.stopPropagation();
          handleZoomOut();
          break;
        case "r":
        case "R":
          e.preventDefault();
          e.stopPropagation();
          handleRotate();
          break;
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown, {
        capture: true,
      });
    };
  }, [isOpen, onClose]);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    void downloadFile(src, alt);
  };

  if (!isOpen) return null;

  let cursorClass = "cursor-default";
  if (isDragging) {
    cursorClass = "cursor-grabbing";
  } else if (scale > 1) {
    cursorClass = "cursor-grab";
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Escape") {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-black/95"
        onClick={onClose}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClose();
          }
        }}
        aria-label="Close preview"
      />
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleZoomIn();
          }}
          className="bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleZoomOut();
          }}
          className="bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleRotate();
          }}
          className="bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleDownload}
          className="bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute top-4 left-4 z-10 rounded-md bg-background/80 px-3 py-1.5 text-sm font-medium text-foreground backdrop-blur-sm">
        {Math.round(scale * 100)}%
      </div>

      {/* Image container */}
      <div
        className={`relative h-full w-full overflow-hidden ${cursorClass}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        role="presentation"
      >
        <div className="flex h-full w-full items-center justify-center">
          <img
            src={src}
            alt={alt}
            draggable={false}
            style={{
              transform: `translate(${String(position.x)}px, ${String(position.y)}px) scale(${String(scale)}) rotate(${String(rotation)}deg)`,
              transition: isDragging ? "none" : "transform 0.2s ease-out",
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
            }}
            className="select-none"
          />
        </div>
      </div>
    </div>
  );
};
