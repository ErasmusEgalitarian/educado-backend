import { mdiDeleteOutline, mdiFileMultiple } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { type UploadFile } from "@/shared/api/types.gen";
import { ErrorDisplay } from "@/shared/components/error/error-display";
import ReusableAlertDialog from "@/shared/components/modals/reusable-alert-dialog";
import { Button } from "@/shared/components/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/shadcn/card";
import { toAppError } from "@/shared/lib/error-utilities";
import { cn } from "@/shared/lib/utils";

import { useBulkDeleteFilesMutation } from "../api/media-mutations";
import { formatBytes } from "../lib/media-utils";

interface MediaBulkActionsProps {
  selectedAssets: UploadFile[];
  onBulkDelete?: () => void;
  className?: string;
}

export const MediaBulkActions = ({
  selectedAssets,
  onBulkDelete,
  className,
}: MediaBulkActionsProps) => {
  const { t } = useTranslation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const bulkDeleteMutation = useBulkDeleteFilesMutation();

  const totalSize = selectedAssets.reduce(
    (acc, asset) => acc + (asset.size ?? 0) * 1024,
    0
  );

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    const fileIds = selectedAssets
      .map((asset) => asset.id)
      .filter((id): id is number => id !== undefined);

    if (fileIds.length === 0) return;

    bulkDeleteMutation.mutate(fileIds, {
      onSuccess: (result) => {
        setIsDeleteDialogOpen(false);
        if (result.succeeded.length > 0) {
          onBulkDelete?.();
        }
      },
    });
  };

  return (
    <>
      <ReusableAlertDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={t("media.bulkDeleteTitle", { count: selectedAssets.length })}
        description={t("media.bulkDeleteDescription", {
          count: selectedAssets.length,
        })}
        confirmAction={{
          label: bulkDeleteMutation.isPending
            ? t("common.deleting")
            : t("common.delete"),
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

      <div className={cn("h-full flex flex-col", className)}>
        <Card className="h-full flex flex-col overflow-hidden">
          <CardHeader className="shrink-0">
            <CardTitle className="flex items-center gap-2">
              <Icon path={mdiFileMultiple} size={1} />
              {t("media.bulkActionsTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
            {/* Selection Summary */}
            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("media.selectedCount")}
                </span>
                <span className="font-semibold">
                  {selectedAssets.length}{" "}
                  {selectedAssets.length === 1
                    ? t("media.file")
                    : t("media.filesPlural")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("media.totalSize")}
                </span>
                <span className="font-semibold">{formatBytes(totalSize)}</span>
              </div>
            </div>

            {/* Selected files preview */}
            <div className="flex-1 overflow-y-auto">
              <p className="text-sm font-medium mb-2">
                {t("media.selectedFiles")}
              </p>
              <div className="space-y-1">
                {selectedAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="text-sm text-muted-foreground truncate"
                    title={asset.name}
                  >
                    • {asset.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Error display */}
            {bulkDeleteMutation.error && (
              <ErrorDisplay
                variant="bar"
                error={toAppError(bulkDeleteMutation.error)}
              />
            )}

            {/* Bulk Delete Button */}
            <Button
              variant="destructive"
              onClick={handleDeleteClick}
              disabled={bulkDeleteMutation.isPending}
              className="w-full"
            >
              <Icon path={mdiDeleteOutline} size={0.8} className="mr-2" />
              {bulkDeleteMutation.isPending
                ? t("media.deletingFiles", { count: selectedAssets.length })
                : t("media.deleteSelected", { count: selectedAssets.length })}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
