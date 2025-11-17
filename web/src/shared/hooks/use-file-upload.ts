import { FileWithMetadata } from "../components/file-upload";
import { fetchHeaders, getBaseApiUrl } from "../config/api-config";

import type { UploadPostResponses } from "../api/types.gen";

interface useFileUploadReturn {
  uploadFile: (files: FileWithMetadata[]) => Promise<number[] | undefined>;
}

// The upload response can be either a single file object or an array of file objects
type UploadResponse = UploadPostResponses[200];

export const useFileUpload = (): useFileUploadReturn => {
  const uploadFile = async (
    files: FileWithMetadata[]
  ): Promise<number[] | undefined> => {
    const baseUrl = getBaseApiUrl();

    try {
      // Upload each file individually
      const uploadPromises = files.map(async ({ file, alt, caption }) => {
        const formData = new FormData();
        formData.append("files", file);

        // Add fileInfo for this specific file
        const fileInfo = {
          alternativeText: alt,
          caption: caption,
        };

        formData.append("fileInfo", JSON.stringify(fileInfo));

        const response = await fetch(`${baseUrl}/upload`, {
          method: "POST",
          body: formData,
          headers: fetchHeaders(),
        });

        if (!response.ok) {
          throw new Error(`Upload failed for file: ${file.name}`);
        }

        // Response can be either a single object or an array
        const data = (await response.json()) as UploadResponse;
        return data;
      });

      // Wait for all uploads to complete
      const uploadedFiles = await Promise.all(uploadPromises);

      // Extract IDs - handle both single object and array responses
      return uploadedFiles.map((response) => {
        if (Array.isArray(response)) {
          // Multiple files uploaded - get first one's ID
          return response[0]?.id ?? 0;
        }
        // Single file uploaded - get its ID
        return response.id;
      });
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  return { uploadFile };
};
