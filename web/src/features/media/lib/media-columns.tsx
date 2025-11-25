import {
  mdiDotsHorizontal,
  mdiFile,
  mdiFileDocument,
  mdiImage,
  mdiVideo,
} from "@mdi/js";
import Icon from "@mdi/react";
import { type ColumnDef } from "@tanstack/react-table";

import { type UploadFile } from "@/shared/api/types.gen";
import { AspectRatio } from "@/shared/components/shadcn/aspect-ratio";
import { Badge } from "@/shared/components/shadcn/badge";
import { Button } from "@/shared/components/shadcn/button";

import { MediaAssetPreview } from "../components/media-asset-preview";

import { formatBytes, getFileTypeLabel, isImage, isVideo } from "./media-utils";

export const createMediaColumns = (
  t: (key: string) => string
): ColumnDef<UploadFile>[] => [
  {
    id: "preview",
    header: "Preview",
    cell: ({ row }) => {
      const asset = row.original;
      if (isImage(asset.mime)) {
        return (
          <AspectRatio
            ratio={1 / 1}
            className="h25 overflow-hidden rounded-md border bg-muted"
          >
            <MediaAssetPreview
              asset={asset}
              enableFullScreen
              imageClassName="object-contain"
              className="h-full w-full aspect-auto"
              size="thumbnail"
            />
          </AspectRatio>
        );
      }
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
          <Icon
            path={isVideo(asset.mime) ? mdiVideo : mdiFileDocument}
            size={0.85}
            className="text-muted-foreground"
          />
        </div>
      );
    },
    meta: { sortable: false, visibleByDefault: true },
    size: 60,
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "mime",
    header: "Type",
    cell: ({ row }) => {
      const mime = row.original.mime;
      let iconPath = mdiFileDocument;
      if (isImage(mime)) iconPath = mdiImage;
      else if (isVideo(mime)) iconPath = mdiVideo;

      return (
        <Badge variant="outline" className="gap-1.5">
          <Icon path={iconPath} size={0.6} />
          <span>{getFileTypeLabel(mime)}</span>
        </Badge>
      );
    },
    meta: {
      sortable: true,
      visibleByDefault: true,
      quickFilter: {
        type: "select",
        displayType: { where: "both", when: "both" },
        label: t("media.fileType"),
        options: [
          {
            label: t("media.fileType.images"),
            value: "image",
            mdiIcon: mdiImage,
          },
          {
            label: t("media.fileType.videos"),
            value: "video",
            mdiIcon: mdiVideo,
          },
          {
            label: t("media.fileType.files"),
            value: "application",
            mdiIcon: mdiFile,
          },
        ],
      },
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const asset = row.original;
      return (
        <div className="max-w-md truncate">
          <span className="font-medium">{asset.name}</span>
        </div>
      );
    },
    meta: { sortable: true, visibleByDefault: true },
  },
  {
    accessorKey: "alternativeText",
    header: "Alt text",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.alternativeText ?? "-"}
      </span>
    ),
    meta: { sortable: true, visibleByDefault: true },
  },
  {
    accessorKey: "caption",
    header: "Caption",
    cell: ({ row }) => (
      <div className="max-w-[24rem] truncate text-sm text-muted-foreground">
        {row.original.caption ?? "-"}
      </div>
    ),
    meta: { sortable: true, visibleByDefault: true },
  },
  {
    id: "size",
    header: "Size",
    cell: ({ row }) => (
      <span>{formatBytes((row.original.size ?? 0) * 1024)}</span>
    ),
    sortingFn: (a, b) => (a.original.size ?? 0) - (b.original.size ?? 0),
    meta: { sortable: true, visibleByDefault: true },
  },
  {
    accessorKey: "createdAt",
    header: "Uploaded",
    cell: ({ row }) => {
      const val = row.original.createdAt;
      return (
        <span className="text-sm text-muted-foreground">
          {val != null && val !== "" ? new Date(val).toLocaleString() : "-"}
        </span>
      );
    },
    meta: { sortable: true, filterable: false, visibleByDefault: true },
  },
  {
    id: "actions",
    header: "",
    cell: () => (
      <Button variant="ghost" size="icon">
        <Icon path={mdiDotsHorizontal} size={0.65} />
      </Button>
    ),
    enableSorting: false,
    meta: { sortable: false, filterable: false, visibleByDefault: true },
    size: 40,
  },
];
