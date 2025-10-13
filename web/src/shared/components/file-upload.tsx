import type React from "react";
import { useCallback, useState, useEffect } from "react";
import {
  Upload,
  File,
  X,
  ImageIcon,
  Video,
  FileText,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { Button } from "@/shared/components/shadcn/button";
import { Input } from "@/shared/components/shadcn/input";
import { Label } from "@/shared/components/shadcn/label";
import { cn } from "@/shared/lib/utils";

import { useTranslation } from "react-i18next";

export type UploadType = "image" | "video" | "file";

export interface FileWithMetadata {
  file: File;
  filename: string;
  alt: string;
  caption: string;
}

interface FileUploadProps {
  value?: FileWithMetadata[];
  onChange?: (files: FileWithMetadata[]) => void;
  uploadType?: UploadType;
  accept?: string;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
}

export function FileUpload({
  value = [],
  onChange,
  uploadType,
  accept,
  maxFiles,
  disabled = false,
  className,
}: FileUploadProps) {
  const { t } = useTranslation();
  const [files, setFiles] = useState<FileWithMetadata[]>(value);
  const [isDragging, setIsDragging] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const UPLOAD_TYPE_CONFIG: Record<
    UploadType,
    { accept: string; icon: React.ReactNode; label: string }
  > = {
    image: {
      accept: "image/*",
      icon: <ImageIcon className="h-6 w-6" />,
      label: t("files.images"),
    },
    video: {
      accept: "video/*",
      icon: <Video className="h-6 w-6" />,
      label: t("files.videos"),
    },
    file: {
      accept: "*/*",
      icon: <FileText className="h-6 w-6" />,
      label: t("files.files"),
    },
  };

  const acceptAttribute =
    accept || (uploadType ? UPLOAD_TYPE_CONFIG[uploadType].accept : "*/*");
  const uploadConfig = uploadType ? UPLOAD_TYPE_CONFIG[uploadType] : null;
  const isMaxFilesReached = maxFiles !== undefined && files.length >= maxFiles;

  // Sync internal state with external value
  useEffect(() => {
    setFiles(value);
  }, [value]);

  // Generate preview URLs
  useEffect(() => {
    if (files.length > 0) {
      const urls = files.map((fileData) => URL.createObjectURL(fileData.file));
      setPreviewUrls(urls);

      return () => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [files]);

  // Keyboard shortcuts for preview modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPreviewOpen) return;

      switch (e.key) {
        case "Escape":
          setIsPreviewOpen(false);
          break;
        case "ArrowLeft":
          if (previewIndex > 0) {
            setPreviewIndex(previewIndex - 1);
            setZoom(1);
          }
          break;
        case "ArrowRight":
          if (previewIndex < files.length - 1) {
            setPreviewIndex(previewIndex + 1);
            setZoom(1);
          }
          break;
        case "+":
        case "=":
          setZoom((prev) => Math.min(prev + 0.25, 3));
          break;
        case "-":
          setZoom((prev) => Math.max(prev - 0.25, 0.5));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPreviewOpen, previewIndex, files.length]);

  // Reset zoom when changing preview
  useEffect(() => {
    setZoom(1);
  }, [previewIndex]);

  const filterFilesByType = (fileList: File[]): File[] => {
    if (acceptAttribute === "*/*") return fileList;

    const acceptTypes = acceptAttribute.split(",").map((type) => type.trim());

    return fileList.filter((file) => {
      return acceptTypes.some((acceptType) => {
        if (acceptType.endsWith("/*")) {
          const category = acceptType.split("/")[0];
          return file.type.startsWith(category + "/");
        }
        return file.type === acceptType || file.name.endsWith(acceptType);
      });
    });
  };

  const updateFiles = (newFiles: FileWithMetadata[]) => {
    setFiles(newFiles);
    onChange?.(newFiles);
  };

  const createFileWithMetadata = (file: File): FileWithMetadata => ({
    file,
    filename: file.name,
    alt: "",
    caption: "",
  });

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled || isMaxFilesReached) return;

      const droppedFiles = Array.from(e.dataTransfer.files);
      const filteredFiles = filterFilesByType(droppedFiles);

      const availableSlots =
        maxFiles !== undefined
          ? maxFiles - files.length
          : Number.POSITIVE_INFINITY;
      const filesToAdd = filteredFiles
        .slice(0, availableSlots)
        .map(createFileWithMetadata);

      if (filesToAdd.length > 0) {
        updateFiles([...files, ...filesToAdd]);
      }
    },
    [files, disabled, isMaxFilesReached, maxFiles]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled && !isMaxFilesReached) {
        setIsDragging(true);
      }
    },
    [disabled, isMaxFilesReached]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && !disabled && !isMaxFilesReached) {
      const selectedFiles = Array.from(e.target.files);
      const filteredFiles = filterFilesByType(selectedFiles);

      const availableSlots =
        maxFiles !== undefined
          ? maxFiles - files.length
          : Number.POSITIVE_INFINITY;
      const filesToAdd = filteredFiles
        .slice(0, availableSlots)
        .map(createFileWithMetadata);

      if (filesToAdd.length > 0) {
        updateFiles([...files, ...filesToAdd]);
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    updateFiles(files.filter((_, i) => i !== index));
  };

  const handlePreviewFile = (e: React.InputEvent, index: number) => {
    e.preventDefault();
    setPreviewIndex(index);
    setIsPreviewOpen(true);
  };

  const handleUpdateMetadata = (
    index: number,
    field: keyof Omit<FileWithMetadata, "file">,
    value: string
  ) => {
    const updatedFiles = [...files];
    updatedFiles[index] = { ...updatedFiles[index], [field]: value };
    updateFiles(updatedFiles);
  };

  const handleDownload = () => {
    if (files[previewIndex] && previewUrls[previewIndex]) {
      const link = document.createElement("a");
      link.href = previewUrls[previewIndex];
      link.download = files[previewIndex].filename;
      link.click();
    }
  };

  return (
    <>
      <div className={cn("space-y-6", className)}>
        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all",
            isDragging && !disabled && !isMaxFilesReached
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-border bg-muted/30",
            !disabled &&
              !isMaxFilesReached &&
              "hover:border-primary/50 hover:bg-muted/50",
            (disabled || isMaxFilesReached) && "opacity-50 cursor-not-allowed"
          )}
        >
          {uploadConfig ? (
            <div className="mb-4 text-muted-foreground">
              {uploadConfig.icon}
            </div>
          ) : (
            <Upload
              className={cn(
                "mb-4 h-12 w-12 transition-colors",
                isDragging && !disabled && !isMaxFilesReached
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            />
          )}
          <h3 className="mb-2 text-lg font-semibold">
            {isMaxFilesReached
              ? t("files.maximumFilesReached")
              : isDragging
                ? `${t("files.drop")} ${uploadConfig?.label || "files"} ${t("files.here")}`
                : `${t("files.upload")} ${uploadConfig?.label || "files"}`}
          </h3>
          <p className="mb-4 text-sm text-muted-foreground text-center text-balance">
            {isMaxFilesReached
              ? `${t("files.youCanUploadUpTo")} ${maxFiles} ${uploadConfig?.label || "files"}`
              : `${t("files.dragAndDrop")} ${uploadConfig?.label || "files"} ${t("files.hereOrClick")}`}
            {maxFiles && !isMaxFilesReached && ` (${files.length}/${maxFiles})`}
          </p>
          <input
            type="file"
            multiple={maxFiles !== 1}
            onChange={handleFileInput}
            className={cn(
              "absolute inset-0 opacity-0",
              disabled || isMaxFilesReached
                ? "cursor-not-allowed"
                : "cursor-pointer"
            )}
            accept={acceptAttribute}
            disabled={disabled || isMaxFilesReached}
          />
          <Button
            type="button"
            variant="secondary"
            className="pointer-events-none"
            disabled={disabled || isMaxFilesReached}
          >
            {t("files.choose")} {uploadConfig?.label || "Files"}
          </Button>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              {t("files.uploaded")} {uploadConfig?.label || "Files"} (
              {files.length}
              {maxFiles && `/${maxFiles}`})
            </h4>
            <div className="space-y-4">
              {files.map((fileData, index) => (
                <div
                  key={index}
                  className="group relative rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <button
                      type="button"
                      onClick={(e) => handlePreviewFile(e, index)}
                      className="flex-shrink-0"
                      disabled={disabled}
                    >
                      {fileData.file.type.startsWith("image/") ? (
                        <img
                          src={
                            URL.createObjectURL(fileData.file) ||
                            "/placeholder.svg"
                          }
                          alt={fileData.alt || fileData.filename}
                          className="h-16 w-16 rounded object-cover"
                        />
                      ) : fileData.file.type.startsWith("video/") ? (
                        <div className="flex h-16 w-16 items-center justify-center rounded bg-muted">
                          <Video className="h-8 w-8 text-muted-foreground" />
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded bg-muted">
                          <File className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {fileData.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(fileData.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFile(index)}
                      className="h-8 w-8 flex-shrink-0"
                      disabled={disabled}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor={`filename-${index}`} className="text-xs">
                        {t("files.filename")}
                      </Label>
                      <Input
                        id={`filename-${index}`}
                        type="text"
                        value={fileData.filename}
                        onChange={(e) =>
                          handleUpdateMetadata(
                            index,
                            "filename",
                            e.target.value
                          )
                        }
                        disabled={disabled}
                        inputSize="sm"
                        placeholder="Enter filename"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`alt-${index}`} className="text-xs">
                        {t("files.alternativeText")}
                      </Label>
                      <Input
                        id={`alt-${index}`}
                        type="text"
                        value={fileData.alt}
                        onChange={(e) =>
                          handleUpdateMetadata(index, "alt", e.target.value)
                        }
                        disabled={disabled}
                        inputSize="sm"
                        placeholder={t("files.describeTheImage")}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`caption-${index}`} className="text-xs">
                        {t("files.caption")}
                      </Label>
                      <Input
                        id={`caption-${index}`}
                        type="text"
                        value={fileData.caption}
                        onChange={(e) =>
                          handleUpdateMetadata(index, "caption", e.target.value)
                        }
                        disabled={disabled}
                        inputSize="sm"
                        placeholder={t("files.addACaption")}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && files.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Header Controls */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-white">
                {files[previewIndex].filename}
              </p>
              <span className="text-xs text-white/60">
                {previewIndex + 1} / {files.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                className="text-white hover:bg-white/10"
              >
                <Download className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsPreviewOpen(false)}
                className="text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex h-full items-center justify-center p-16">
            <div
              className="relative max-h-full max-w-full transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
            >
              {files[previewIndex].file.type.startsWith("image/") ? (
                <img
                  src={previewUrls[previewIndex] || "/placeholder.svg"}
                  alt={files[previewIndex].alt || files[previewIndex].filename}
                  className="max-h-[80vh] max-w-full object-contain"
                />
              ) : (
                <div className="flex h-96 w-96 items-center justify-center rounded-lg bg-white/5 text-white/60">
                  <p className="text-center">
                    Preview not available
                    <br />
                    <span className="text-sm">
                      {files[previewIndex].file.type || "Unknown file type"}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-4 p-6 bg-gradient-to-t from-black/60 to-transparent">
            {/* Navigation */}
            {files.length > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewIndex(previewIndex - 1)}
                  disabled={previewIndex === 0}
                  className="text-white hover:bg-white/10 disabled:opacity-30"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewIndex(previewIndex + 1)}
                  disabled={previewIndex === files.length - 1}
                  className="text-white hover:bg-white/10 disabled:opacity-30"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Zoom Controls */}
            <div className="flex items-center gap-2 rounded-lg bg-black/40 px-3 py-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setZoom((prev) => Math.max(prev - 0.25, 0.5))}
                disabled={zoom <= 0.5}
                className="h-8 w-8 text-white hover:bg-white/10 disabled:opacity-30"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="min-w-[4rem] text-center text-sm font-medium text-white">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setZoom((prev) => Math.min(prev + 0.25, 3))}
                disabled={zoom >= 3}
                className="h-8 w-8 text-white hover:bg-white/10 disabled:opacity-30"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-xs text-white/40">
            {t("files.previewShortcuts")}
          </div>
        </div>
      )}
    </>
  );
}
