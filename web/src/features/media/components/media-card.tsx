/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { zodResolver } from "@hookform/resolvers/zod";
import {
  mdiCalendar,
  mdiDownload,
  mdiFileDocument,
  mdiRulerSquare,
  mdiWeight,
} from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { type UploadFile } from "@/shared/api/types.gen";
import { ErrorDisplay } from "@/shared/components/error/error-display";
import { FormInput } from "@/shared/components/form/form-input";
import { FormTextarea } from "@/shared/components/form/form-textarea";
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

// Schema for the editable fields only
const mediaAssetFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  alternativeText: z.string().optional(),
  caption: z.string().optional(),
});

type MediaFormValues = z.infer<typeof mediaAssetFormSchema>;

const assetToFormValues = (asset: UploadFile | null): MediaFormValues => {
  const { name: nameWithoutExt } = splitFilename(asset?.name ?? "");
  return {
    name: nameWithoutExt,
    alternativeText: asset?.alternativeText ?? "",
    caption: asset?.caption ?? "",
  };
};

interface MediaCardProps {
  asset: UploadFile;
  variant?: "classic" | "compact" | "extended";
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
              {getFileTypeLabel(asset.mime)}
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

  const form = useForm<MediaFormValues>({
    resolver: zodResolver(mediaAssetFormSchema),
    defaultValues: assetToFormValues(asset),
    mode: "onTouched",
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
      void downloadFile(url, asset.name ?? "download");
    }
  };

  const onSubmit = (data: MediaFormValues) => {
    if (!asset.id || !asset.name) return;

    // Reconstruct the full filename with the original extension
    const { extension } = splitFilename(asset.name);
    const fullFilename = data.name + extension;

    updateMutation.mutate(
      {
        fileId: asset.id,
        name: fullFilename,
        alternativeText: data.alternativeText,
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
        title="Excluir arquivo?"
        description="Esta ação não pode ser desfeita. O arquivo será excluído permanentemente."
        confirmAction={{
          label: "Excluir",
          onClick: handleConfirmDelete,
          variant: "destructive",
        }}
        cancelAction={{
          label: "Cancelar",
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
              <CardTitle>Detalhes do anexo</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                title="Download"
                type="button"
              >
                <Icon path={mdiDownload} size={1} />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div
                ref={contentRef}
                className={`transition-opacity duration-300 ${asset ? "opacity-100" : "opacity-0"}`}
              >
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
                    Excluir permanentemente
                  </Button>

                  <Accordion type="single" collapsible>
                    <AccordionItem value="metadata">
                      <AccordionTrigger>Metadata</AccordionTrigger>
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
                              Tipo de arquivo:
                            </span>
                            <span className="font-medium">
                              {getFileExtension(asset.name)} (
                              {asset.mime ?? "Unknown"})
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
                              Tamanho:
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
                                    Resolução:
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
                              Nome do arquivo:
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
                              Data de criação:
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
                              Data de atualização:
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
                    loadingMessage="Salvando alterações..."
                    successMessage="Alterações salvas com sucesso!"
                    onSuccessComplete={() => {
                      updateMutation.reset();
                    }}
                  >
                    <div className="flex flex-col gap-y-5">
                      <div className="space-y-2">
                        <FormInput
                          control={form.control}
                          fieldName="name"
                          inputSize="md"
                          label={t("media.fileName")}
                          placeholder={t("media.fileNamePlaceholder")}
                          type="text"
                          isRequired
                        />
                        {asset.name && (
                          <p className="text-xs text-muted-foreground">
                            Extensão:{" "}
                            <span className="font-medium">
                              {splitFilename(asset.name).extension || "Nenhuma"}
                            </span>
                          </p>
                        )}
                      </div>
                      <FormTextarea
                        control={form.control}
                        fieldName="alternativeText"
                        inputSize="md"
                        label={t("media.alternativeText")}
                        placeholder={t("media.alternativeTextPlaceholder")}
                        maxLength={125}
                        rows={3}
                      />
                      <FormTextarea
                        control={form.control}
                        fieldName="caption"
                        inputSize="md"
                        label={t("media.caption")}
                        placeholder={t("media.captionPlaceholder")}
                        maxLength={200}
                        rows={6}
                      />
                    </div>
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
                      ? "Salvando..."
                      : "Salvar alterações"}
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
  if (variant === "classic") {
    return <MediaCardClassic asset={asset} className={className} />;
  }
  // Default to compact
  //return <MediaCardCompact asset={asset} className={className} />;
};
