import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { UploadFile } from "@/shared/api/types.gen";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/shadcn/card";
import {
  DataDisplay,
  DataDisplayRef,
} from "@/shared/data-display/data-display";

import { createMediaColumns } from "../lib/media-columns";

import { MediaBulkActions } from "./media-bulk-actions";
import { MediaCard } from "./media-card";

export type MediaEditorMode = "view" | "edit" | "select";

interface MediaDisplayEditorProps {
  defaultMode?: MediaEditorMode;
  onSelectionChange?: (asset: UploadFile | null) => void;
  /** Enable multi-selection mode for bulk operations (only works in edit mode) */
  enableBulkActions?: boolean;
  /** Maximum number of items that can be selected (null = unlimited, default: null when bulk actions enabled, 1 otherwise) */
  selectionLimit?: number | null;
}

const MediaDisplayEditor = ({
  defaultMode = "view",
  onSelectionChange,
  enableBulkActions = true,
  selectionLimit,
}: MediaDisplayEditorProps) => {
  const { t } = useTranslation();
  const [mode] = useState<MediaEditorMode>(defaultMode);
  const [selectedAssets, setSelectedAssets] = useState<UploadFile[]>([]);
  const dataDisplayRef = useRef<DataDisplayRef>(null);

  // Determine selection limit based on props and bulk actions setting
  const effectiveSelectionLimit = useMemo(() => {
    if (selectionLimit !== undefined) return selectionLimit;
    // If bulk actions are enabled in edit mode, allow unlimited selection
    if (enableBulkActions && mode === "edit") return null;
    // Otherwise, limit to 1 for single selection
    return 1;
  }, [selectionLimit, enableBulkActions, mode]);

  const mediaColumns = useMemo(() => createMediaColumns(t), [t]);
  const mediaCard = useCallback(
    (asset: UploadFile) => <MediaCard asset={asset} variant="compact" />,
    []
  );

  // Handle selection change - supports both single and multi-select
  const handleSelectionChange = useCallback(
    (selectedItems: UploadFile[]) => {
      setSelectedAssets(selectedItems);
      // For backward compatibility, call onSelectionChange with first item or null
      const firstItem = selectedItems.length > 0 ? selectedItems[0] : null;
      onSelectionChange?.(firstItem);
    },
    [onSelectionChange]
  );

  // Handle asset update from sidebar (single selection mode)
  const handleAssetUpdate = useCallback((updatedAsset: UploadFile) => {
    setSelectedAssets([updatedAsset]);
  }, []);

  // Handle asset deletion (single or bulk)
  const handleAssetDelete = useCallback(() => {
    setSelectedAssets([]);
    dataDisplayRef.current?.resetSelection();
  }, []);

  // Get single selected asset for the MediaCard (when only 1 item selected)
  const selectedAsset = selectedAssets.length === 1 ? selectedAssets[0] : null;
  const hasMultipleSelection = selectedAssets.length > 1;

  const sideBarComponent = useMemo(() => {
    if (mode !== "select" && mode !== "edit") return null;

    // Show bulk actions when multiple items are selected
    if (hasMultipleSelection && enableBulkActions) {
      return (
        <div className="w-96 h-full flex flex-col shrink-0 transition-all duration-300 ease-in-out pb-3">
          <MediaBulkActions
            selectedAssets={selectedAssets}
            onBulkDelete={handleAssetDelete}
            className="h-full"
          />
        </div>
      );
    }

    // Show single asset details or placeholder
    return (
      <div className="w-96 h-full flex flex-col shrink-0 transition-all duration-300 ease-in-out pb-3">
        {selectedAsset ? (
          <MediaCard
            asset={selectedAsset}
            variant="extended"
            onUpdate={handleAssetUpdate}
            onDelete={handleAssetDelete}
            className="h-full"
          />
        ) : (
          <div className="h-full flex flex-col">
            <Card className="h-full flex flex-col overflow-hidden">
              <CardHeader className="shrink-0">
                <CardTitle>{t("media.details")}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-6 text-center bg-muted/5">
                <p className="text-sm font-medium">
                  {t("media.selectAssetPlaceholder")}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }, [
    mode,
    selectedAsset,
    selectedAssets,
    hasMultipleSelection,
    enableBulkActions,
    handleAssetUpdate,
    handleAssetDelete,
    t,
  ]);

  return (
    <div className="w-full h-full flex flex-row gap-4 overflow-hidden">
      <DataDisplay
        className="flex-1 min-w-0 min-h-0 overflow-y-auto h-full pr-4 pl-2 pt-2 pb-2"
        ref={dataDisplayRef}
        urlPath="/upload/files"
        columns={mediaColumns}
        queryKey={["media"]}
        fields={[
          "documentId",
          "name",
          "alternativeText",
          "caption",
          "ext",
          "mime",
          "url",
          "formats",
          "width",
          "height",
          "size",
          "createdAt",
        ]}
        allowedViewModes="both"
        gridItemRender={mediaCard}
        gridItemMinWidth="200px"
        initialPageSize={20}
        selection={{
          enabled: mode === "select" || mode === "edit",
          limit: effectiveSelectionLimit,
          onChange: handleSelectionChange,
        }}
      />
      {sideBarComponent}
    </div>
  );
};

export default MediaDisplayEditor;
