import { zodResolver } from "@hookform/resolvers/zod";
import {
  mdiCalendar,
  mdiDownload,
  mdiFileDocument,
  mdiRulerSquare,
  mdiWeight,
} from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { type UploadFile } from "@/shared/api/types.gen";
import { ErrorDisplay } from "@/shared/components/error/error-display";
import ReusableAlertDialog from "@/shared/components/modals/reusable-alert-dialog";
import { OverlayStatusWrapper } from "@/shared/components/overlay-status-wrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/shadcn/accordion";
import { Badge } from "@/shared/components/shadcn/badge";
import { Button } from "@/shared/components/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/shadcn/card";
import { Form } from "@/shared/components/shadcn/form";
import { Separator } from "@/shared/components/shadcn/seperator";
import { toAppError } from "@/shared/lib/error-utilities";
import { cn } from "@/shared/lib/utils";

import {
  useDeleteFileMutation,
  useUpdateFileMetadataMutation,
} from "../api/media-mutations";
import {
  createMediaAssetFormSchema,
  type MediaAssetFormValues,
} from "../lib/media-schemas";
import {
  formatBytes,
  formatDate,
  getAssetUrl,
  getFileExtension,
  getFileTypeIcon,
  getFileTypeLabel,
  isImage,
  isVideo,
  splitFilename,
  downloadFile,
} from "../lib/media-utils";

import { MediaAssetPreview } from "./media-asset-preview";
import { MediaMetadataForm } from "./media-metadata-form";

const assetToFormValues = (asset: UploadFile | null): MediaAssetFormValues => {
  const { name: nameWithoutExt } = splitFilename(asset?.name ?? "");
  return {
    filename: nameWithoutExt,
    alt: asset?.alternativeText ?? "",
    caption: asset?.caption ?? "",
  };
};

interface MediaCardProps {
  asset: UploadFile;
  variant?: "compact" | "extended";
  onUpdate?: (updatedAsset: UploadFile) => void;
  onDelete?: () => void;
  className?: string;
}

const MediaCardClassic = ({
  asset,
  className,
}: {
  asset: UploadFile;
  className?: string;
}) => {
  const { t } = useTranslation();

  return (
    <Card className={cn("w-full overflow-hidden relative", className)}>
      {/* Asset Preview */}
      <MediaAssetPreview asset={asset} showVideoControls={false} size="small" />

      <CardContent className="space-y-4 p-4">
        {/* File Metadata */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <p
              className="text-sm font-semibold italic text-foreground truncate"
              title={asset.name}
            >
              {asset.name}
            </p>
            <Badge variant="secondary" className="shrink-0">
              {getFileTypeLabel(asset.mime, t)}
            </Badge>
          </div>
          {asset.createdAt && (
            <p className="text-sm text-muted-foreground">
              {formatDate(asset.createdAt)}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            {formatBytes((asset.size ?? 0) * 1024)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const MediaCardExtended = ({
  asset,
  onUpdate,
  onDelete,
  className,
}: {
  asset: UploadFile;
  onUpdate?: (updatedAsset: UploadFile) => void;
  onDelete?: () => void;
  className?: string;
}) => {
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement>(null);
  const updateMutation = useUpdateFileMetadataMutation();
  const deleteMutation = useDeleteFileMutation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const mediaAssetFormSchema = useMemo(
    () => createMediaAssetFormSchema(t),
    [t]
  );

  const form = useForm<MediaAssetFormValues>({
    resolver: zodResolver(mediaAssetFormSchema),
    defaultValues: assetToFormValues(asset),
    mode: "onChange", // Validate on every change to clear errors immediately
  });

  // Reset form when selected asset changes
  useEffect(() => {
    form.reset(assetToFormValues(asset));
  }, [asset, form]);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!asset.id) return;

    deleteMutation.mutate(asset.id, {
      onSuccess: () => {
        // Optionally, you can notify the parent component about the deletion
        // onUpdate?.({ ...asset, id: "" } as UploadFile);
        onDelete?.();
      },
    });
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (asset.url) {
      const url = getAssetUrl(asset.url);
      void downloadFile(url, asset.alternativeText ?? "downloaded-file");
    }
  };

  const onSubmit = (data: MediaAssetFormValues) => {
    if (!asset.id || !asset.name) return;

    // Reconstruct the full filename with the original extension
    const { extension } = splitFilename(asset.name);
    const fullFilename = data.filename + extension;

    updateMutation.mutate(
      {
        fileId: asset.id,
        name: fullFilename,
        alternativeText: data.alt,
        caption: data.caption,
      },
      {
        onSuccess: (updatedFile) => {
          onUpdate?.(updatedFile);
          form.reset(assetToFormValues(updatedFile));
        },
      }
    );
  };

  return (
    <>
      <ReusableAlertDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={t("media.deleteFileTitle")}
        description={t("media.deleteFileDescription")}
        confirmAction={{
          label: t("common.delete"),
          onClick: handleConfirmDelete,
          variant: "destructive",
        }}
        cancelAction={{
          label: t("common.cancel"),
          onClick: () => {
            setIsDeleteDialogOpen(false);
          },
        }}
      />
      <Form {...form}>
        <form
          className={cn("h-full flex flex-col", className)}
          onSubmit={(e) => {
            void form.handleSubmit(onSubmit)(e);
          }}
        >
          <Card className="h-full flex flex-col overflow-hidden">
            <CardHeader className="shrink-0 flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>{t("media.details")}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                title={t("common.download")}
                type="button"
              >
                <Icon path={mdiDownload} size={1} />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div ref={contentRef} className="transition-opacity duration-300">
                <div className="space-y-4">
                  {/* Asset Preview */}
                  <MediaAssetPreview
                    asset={asset}
                    enableFullScreen={true}
                    size="medium"
                  />
                  <p className="text-left font-semibold text-[16px]">
                    {asset.name}
                  </p>
                  <p className="text-left font-semibold text-[12px]">
                    {formatDate(asset.createdAt)}
                  </p>
                  <p className="text-left font-semibold text-[12px]">
                    {formatBytes((asset.size ?? 0) * 1024)}
                  </p>
                  <Button
                    variant="ghost"
                    className="text-[14px] leading-[18.2px] tracking-[0] font-normal text-error-surface-default underline cursor-pointer align-middle hover:bg-transparent hover:text-error-surface-default p-0 h-auto"
                    onClick={handleDeleteClick}
                  >
                    {t("media.deletePermanently")}
                  </Button>

                  <Accordion type="single" collapsible>
                    <AccordionItem value="metadata">
                      <AccordionTrigger>{t("media.metadata")}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 text-sm">
                          {/* File Type */}
                          <div className="flex items-center gap-2">
                            <Icon
                              path={getFileTypeIcon(asset.mime)}
                              size={0.8}
                              className="text-muted-foreground"
                            />
                            <span className="text-muted-foreground">
                              {t("media.fileType")}:
                            </span>
                            <span className="font-medium">
                              {getFileExtension(asset.name)} (
                              {asset.mime ?? t("common.unknown")})
                            </span>
                          </div>

                          <Separator />

                          {/* File Size */}
                          <div className="flex items-center gap-2">
                            <Icon
                              path={mdiWeight}
                              size={0.8}
                              className="text-muted-foreground"
                            />
                            <span className="text-muted-foreground">
                              {t("media.size")}:
                            </span>
                            <span className="font-medium">
                              {formatBytes((asset.size ?? 0) * 1024)}
                            </span>
                          </div>

                          <Separator />

                          {/* Resolution (for images/videos) */}
                          {(isImage(asset.mime) || isVideo(asset.mime)) &&
                            asset.width &&
                            asset.height && (
                              <>
                                <div className="flex items-center gap-2">
                                  <Icon
                                    path={mdiRulerSquare}
                                    size={0.8}
                                    className="text-muted-foreground"
                                  />
                                  <span className="text-muted-foreground">
                                    {t("media.resolution")}:
                                  </span>
                                  <span className="font-medium">
                                    {asset.width} × {asset.height}
                                  </span>
                                </div>
                                <Separator />
                              </>
                            )}

                          {/* Original Filename */}
                          <div className="flex items-center gap-2">
                            <Icon
                              path={mdiFileDocument}
                              size={0.8}
                              className="text-muted-foreground"
                            />
                            <span className="text-muted-foreground">
                              {t("media.fileName")}:
                            </span>
                            <span className="font-medium break-all">
                              {asset.name}
                            </span>
                          </div>

                          <Separator />

                          {/* Created Date */}
                          <div className="flex items-center gap-2">
                            <Icon
                              path={mdiCalendar}
                              size={0.8}
                              className="text-muted-foreground"
                            />
                            <span className="text-muted-foreground">
                              {t("media.createdAt")}:
                            </span>
                            <span className="font-medium">
                              {formatDate(asset.createdAt)}
                            </span>
                          </div>

                          <Separator />

                          {/* Updated Date */}
                          <div className="flex items-center gap-2">
                            <Icon
                              path={mdiCalendar}
                              size={0.8}
                              className="text-muted-foreground"
                            />
                            <span className="text-muted-foreground">
                              {t("media.updatedAt")}:
                            </span>
                            <span className="font-medium">
                              {formatDate(asset.updatedAt)}
                            </span>
                          </div>
                        </div>
                        <Separator className="my-4" />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <OverlayStatusWrapper
                    isLoading={updateMutation.isPending}
                    isSuccess={updateMutation.isSuccess}
                    loadingMessage={`${t("media.savingChanges")}...`}
                    successMessage={`${t("media.changesSaved")}!`}
                    onSuccessComplete={() => {
                      updateMutation.reset();
                    }}
                  >
                    <MediaMetadataForm
                      control={form.control}
                      disabled={updateMutation.isPending}
                      fileExtension={
                        asset.name
                          ? splitFilename(asset.name).extension
                          : undefined
                      }
                      inputSize="md"
                    />
                  </OverlayStatusWrapper>
                  {updateMutation.error && (
                    <ErrorDisplay
                      variant="bar"
                      error={toAppError(updateMutation.error)}
                    />
                  )}
                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={
                      !form.formState.isDirty || updateMutation.isPending
                    }
                    className="w-full"
                  >
                    {updateMutation.isPending
                      ? `${t("common.saving")}...`
                      : t("common.saveChanges")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </>
  );
};

export const MediaCard = ({
  asset,
  variant = "compact",
  onUpdate,
  onDelete,
  className,
}: MediaCardProps) => {
  if (variant === "extended") {
    return (
      <MediaCardExtended
        asset={asset}
        onUpdate={onUpdate}
        onDelete={onDelete}
        className={className}
      />
    );
  }

  return <MediaCardClassic asset={asset} className={className} />;
};
