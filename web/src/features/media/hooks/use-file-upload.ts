import { useState } from "react";

import { fetchHeaders, getBaseApiUrl } from "../../../shared/config/api-config";
import { createApiError } from "../../../shared/lib/error-utilities";

import type { UploadPostResponses } from "../../../shared/api/types.gen";

export interface FileWithMetadata {
  file: File;
  filename: string;
  alt: string;
  caption: string;
}

// Define the single file object type from the API response
type UploadedFile = {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
  formats?: { [key: string]: unknown };
  hash: string;
  ext?: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string | null;
  folder?: number;
  folderPath: string;
  provider: string;
  provider_metadata?: { [key: string]: unknown } | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
};

// eslint-disable-next-line sonarjs/class-name, @typescript-eslint/naming-convention
interface useFileUploadReturn {
  uploadFile: (files: FileWithMetadata[]) => Promise<UploadedFile[] | undefined>;
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
      // Create promises to run uploads in parallel
      const uploadPromises = files.map(async ({ file, filename, alt, caption }) => {
        const formData = new FormData();
        formData.append("files", file);

        // Add fileInfo for this specific file
        // Strapi uses `name` to override the uploaded filename
        const fileInfo = {
          name: filename,
          alternativeText: alt,
          caption: caption,
        };

        formData.append("fileInfo", JSON.stringify(fileInfo));

        const response = await fetch(`${baseUrl}/upload`, {
          method: "POST",
          body: formData,
          headers: fetchHeaders(), // Include any auth headers
        });

        if (!response.ok) {
          throw await createApiError(response);
        }

        // Response can be either a single object or an array
        const data = (await response.json()) as UploadResponse;
        return data;
      });

      // Wait for all uploads to complete
      const uploadedFiles = await Promise.all(uploadPromises);

      // Flatten the results since each upload might return a single object or an array
      const flattenedFiles: UploadedFile[] = [];
      
      for (const result of uploadedFiles) {
        if (Array.isArray(result)) {
          flattenedFiles.push(...result);
        } else {
          flattenedFiles.push(result);
        }
      }

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
