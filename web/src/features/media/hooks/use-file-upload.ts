import { useState } from "react";

import { fetchHeaders, getBaseApiUrl } from "../../../shared/config/api-config";

import type { UploadPostResponses } from "../../../shared/api/types.gen";

export interface FileWithMetadata {
  file: File;
  filename: string;
  alt: string;
  caption: string;
}

interface useFileUploadReturn {
  uploadFile: (files: FileWithMetadata[]) => Promise<UploadPostResponses[200] | undefined>;
  isUploading: boolean;
}

// The upload response can be either a single file object or an array of file objects
type UploadResponse = UploadPostResponses[200];

export const useFileUpload = (): useFileUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (
    files: FileWithMetadata[]
  ): Promise<UploadResponse | undefined> => {
    const baseUrl = getBaseApiUrl();
    setIsUploading(true);

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

      // Flatten the results since each upload might return an array
      const flattenedFiles = uploadedFiles.flat();

      return flattenedFiles;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading };
};
