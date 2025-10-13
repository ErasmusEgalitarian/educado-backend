import { OpenAPI } from "../api/core/OpenAPI";
import { type PluginUploadFileDocument } from "../api/models/PluginUploadFileDocument";
import { FileWithMetadata } from "../components/file-upload";
import { fetchHeaders } from "../config/api-config";

interface useFileUploadReturn {
  uploadFile: (files: FileWithMetadata[]) => Promise<string[] | undefined>;
}

export const useFileUpload = (): useFileUploadReturn => {
  const uploadFile = async (
    files: FileWithMetadata[]
  ): Promise<string[] | undefined> => {
    const baseUrl = OpenAPI.BASE;

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

        const data: PluginUploadFileDocument[] = await response.json();
        return data[0]; // Return the first (and only) uploaded file
      });

      // Wait for all uploads to complete
      const uploadedFiles = await Promise.all(uploadPromises);

      console.log("Upload responses:", uploadedFiles);

      return uploadedFiles.map((file) => file.documentId);
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  return { uploadFile };
};
