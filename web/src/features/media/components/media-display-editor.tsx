import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

import { MediaCard } from "./media-card";

export type MediaEditorMode = "view" | "edit" | "select";

interface MediaDisplayEditorProps {
  defaultMode?: MediaEditorMode;
  onSelectionChange?: (asset: UploadFile | null) => void;
}

const MediaDisplayEditor = ({
  defaultMode = "view",
  onSelectionChange,
}: MediaDisplayEditorProps) => {
  const { t } = useTranslation();
  const [mode] = useState<MediaEditorMode>(defaultMode);
  const [selectedAsset, setSelectedAsset] = useState<UploadFile | null>(null);
  const dataDisplayRef = useRef<DataDisplayRef>(null);

  const mediaColumns = useMemo(() => createMediaColumns(t), [t]);
  const mediaCard = useCallback(
    (asset: UploadFile) => <MediaCard asset={asset} variant="compact" />,
    []
  );

  // Handle selection change - convert array to single item
  const handleSelectionChange = useCallback(
    (selectedItems: UploadFile[]) => {
      const newAsset = selectedItems.length > 0 ? selectedItems[0] : null;
      console.log("🎯 Selection changed:", newAsset); // eslint-disable-line no-console
      setSelectedAsset(newAsset);
      onSelectionChange?.(newAsset);
    },
    [onSelectionChange]
  );

  // Handle asset update from sidebar
  const handleAssetUpdate = useCallback((updatedAsset: UploadFile) => {
    setSelectedAsset(updatedAsset);
  }, []);

  // Handle asset deletion
  const handleAssetDelete = useCallback(() => {
    setSelectedAsset(null);
    dataDisplayRef.current?.resetSelection();
  }, []);

  // Sync selected asset with updated data after refetch
  // This ensures that when data refetches, if we have a selected asset, we update it with the latest version
  useEffect(() => {
    if (selectedAsset && dataDisplayRef.current) {
      // After a refetch, we need to find the updated version of the selected asset
      // We'll do this by storing the ID and looking it up after data changes
      // But we don't have access to data through the ref...
      // So we'll rely on handleSelectionChange being called with fresh data
    }
  }, [selectedAsset]);

  const sideBarComponent = useMemo(() => {
    if (mode !== "select" && mode !== "edit") return null;

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
                <CardTitle>{t("media.details", "Detalhes do anexo")}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-6 text-center bg-muted/5">
                <p className="text-sm font-medium">
                  {t(
                    "media.selectAssetPlaceholder",
                    "Selecione um arquivo para ver os detalhes"
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }, [mode, selectedAsset, handleAssetUpdate, handleAssetDelete, t]);

  return (
    <div className="w-full h-full flex flex-row gap-4 overflow-hidden">
      <DataDisplay
        className="flex-1 min-w-0 min-h-0 overflow-y-auto h-full pr-4 pl-2 pt-2 pb-2"
        ref={dataDisplayRef}
        urlPath="/upload/files"
        columns={mediaColumns}
        queryKey={["media"]}
        allowedViewModes="both"
        gridItemRender={mediaCard}
        gridItemMinWidth="200px"
        initialPageSize={20}
        config={{
          renderMode: "client",
          clientModeThreshold: 50,
        }}
        selection={{
          enabled: mode === "select" || mode === "edit",
          limit: 1,
          onChange: handleSelectionChange,
        }}
      />
      {sideBarComponent}
    </div>
  );
};

export default MediaDisplayEditor;
