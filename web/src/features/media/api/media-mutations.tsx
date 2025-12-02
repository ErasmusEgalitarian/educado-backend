import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { uploadDeleteFilesById, uploadPost } from "@/shared/api/sdk.gen";
import { type UploadFile } from "@/shared/api/types.gen";
import { fetchHeaders, getBaseApiUrl } from "@/shared/config/api-config";

interface UploadFilesInput {
  files: File[];
  fileInfo?: {
    name?: string;
    alternativeText?: string;
    caption?: string;
  }[];
}

interface UpdateFileMetadataInput {
  fileId: number;
  name?: string;
  alternativeText?: string;
  caption?: string;
}

/**
 * Mutation for uploading one or more files
 */
export const useUploadFilesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UploadFilesInput) => {
      const formData = new FormData();

      // Append files
      for (const file of input.files) {
        formData.append("files", file);
      }

      // Append file info if provided
      if (input.fileInfo) {
        formData.append("fileInfo", JSON.stringify(input.fileInfo));
      }

      // Use the SDK's uploadPost function
      const response = await uploadPost({
        // @ts-expect-error - FormData is valid but types don't reflect it
        body: formData,
      });

      return response;
    },
    onSuccess: () => {
      refetchMedia(queryClient);
    },
  });
};

/**
 * Mutation for updating file metadata (name, alternativeText, caption)
 * Uses POST /upload?id={id} endpoint with fileInfo in the body
 */
export const useUpdateFileMetadataMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateFileMetadataInput) => {
      const { fileId, ...metadata } = input;
      const baseUrl = getBaseApiUrl();

      // Use POST /upload?id={id} endpoint as per Strapi documentation
      const response = await fetch(`${baseUrl}/upload?id=${String(fileId)}`, {
        method: "POST",
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          "Content-Type": "application/json",
          ...fetchHeaders(),
        },
        body: JSON.stringify({
          fileInfo: metadata,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update file metadata");
      }

      return (await response.json()) as UploadFile;
    },
    onSuccess: () => {
      refetchMedia(queryClient);
    },
  });
};

/**
 * Mutation for deleting a file
 */
export const useDeleteFileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileId: number) => {
      const response = await uploadDeleteFilesById({
        path: { id: fileId },
        // @ts-expect-error - The generated SDK has the wrong URL (/files/{id})
        url: "/upload/files/{id}",
      });

      return response;
    },
    onSuccess: () => {
      refetchMedia(queryClient);
    },
  });
};

export interface BulkDeleteResult {
  succeeded: number[];
  failed: { id: number; error: string }[];
}

/**
 * Mutation for deleting multiple files at once
 */
export const useBulkDeleteFilesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileIds: number[]): Promise<BulkDeleteResult> => {
      const results: BulkDeleteResult = {
        succeeded: [],
        failed: [],
      };

      // Delete files sequentially to avoid overwhelming the server
      for (const fileId of fileIds) {
        try {
          await uploadDeleteFilesById({
            path: { id: fileId },
            // @ts-expect-error - The generated SDK has the wrong URL (/files/{id})
            url: "/upload/files/{id}",
          });
          results.succeeded.push(fileId);
        } catch (error) {
          results.failed.push({
            id: fileId,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      return results;
    },
    onSuccess: () => {
      refetchMedia(queryClient);
    },
  });
};

// Helper to refetch media queries
const refetchMedia = (queryClient: QueryClient) =>
  void queryClient.refetchQueries({
    queryKey: [["media"]],
    exact: false,
    type: "active",
  });
