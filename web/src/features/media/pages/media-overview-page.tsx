/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { MediaInput } from "@/features/media/components/media-input";
import { PageContainer } from "@/shared/components/page-container";
import { Button } from "@/shared/components/shadcn/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/shadcn/card";

import MediaDisplayEditor from "../components/media-display-editor";

const MediaOverviewPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showUploader, setShowUploader] = useState(false);

  const handleStartUpload = () => {
    setShowUploader((v) => !v);
  };

  const handleUploadComplete = async () => {
    toast.success(
      t("media.uploadSuccess", { defaultValue: "Upload completed" })
    );
    setShowUploader(false);
    // Invalidate media list so DataDisplay refetches
    await queryClient.invalidateQueries({ queryKey: ["media"] });
  };

  return (
    <PageContainer
      title={t("media.pageTitle", { defaultValue: "Media Library" })}
    >
      <div className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>
              <h1 className="text-2xl font-bold">
                {t("media.pageTitle", { defaultValue: "Media Library" })}
              </h1>
            </CardTitle>
            <CardAction>
              <Button
                onClick={handleStartUpload}
                variant={showUploader ? "secondary" : "primary"}
              >
                {showUploader
                  ? t("media.hideUpload", { defaultValue: "Hide upload" })
                  : t("media.upload", { defaultValue: "Upload" })}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {showUploader && (
              <div className="mb-6 space-y-4">
                <MediaInput
                  variant="upload"
                  onUploadComplete={() => {
                    void handleUploadComplete();
                  }}
                  maxFiles={15}
                />
              </div>
            )}
            <MediaDisplayEditor defaultMode="edit" />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default MediaOverviewPage;
