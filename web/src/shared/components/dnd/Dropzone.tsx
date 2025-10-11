import { FC, useEffect, useState, useRef } from "react";

import { useNotifications } from "@/shared/context/NotificationContext";

interface DropzoneProps {
  inputType: string;
  id: string;
  previewFile?: string | null;
  onFileChange?: (file: File | null) => void;
  maxSize?: number;
}

/**
 * @param {string}input - The input type, can either be image or video
 * @returns {JSX.Element} - The image dropzone component
 */

export const Dropzone: FC<DropzoneProps> = ({
  inputType,
  id,
  previewFile,
  onFileChange,
  maxSize = 10 * 1024 * 1024, // 10MB, change to 500MB when transcoding service has been redeployed
}) => {
  const { addNotification } = useNotifications();
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isRequired = !preview;
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (previewFile && !preview) {
      setPreview(previewFile);
    }
  }, [previewFile]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.item(0) || null;

    if (!selectedFile) {
      setPreview(null);
      onFileChange?.(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    if (selectedFile.size > maxSize) {
      addNotification(
        `O arquivo não deve exceder ${(maxSize / (1024 * 1024)).toFixed(1)} MB.`,
      );
      setPreview(null);
      onFileChange?.(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    setIsLoading(true);

    setPreview(URL.createObjectURL(selectedFile));
    onFileChange?.(selectedFile);
    setIsLoading(false);
  };

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div>
      <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-600 px-10 pt-5 pb-6">
        <div className="space-y-1 text-center">
          {isLoading ? (
            <div className="flex justify-center items-center h-48 text-gray-600">
              Loading...
            </div>
          ) : preview ? (
            inputType === "image" ? (
              <img
                src={preview}
                alt="Preview"
                className="h-48 mx-auto object-contain"
                onError={(e) => {
                  console.error("Image loading error:", e);
                }}
              />
            ) : (
              <video
                src={preview}
                controls
                className="h-48 mx-auto object-contain"
                onError={(e) => {
                  console.error("Video loading error:", e);
                }}
              />
            )
          ) : (
            <svg
              className="mx-auto h-6 w-6 text-gray-600"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          <div className="flex justify-center text-sm text-gray-600 text-center">
            <label
              htmlFor={`file-upload-${id}`}
              className="relative cursor-pointer rounded-md font-medium text-primary focus-within:outline-hidden focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary-hover"
            >
              <span>Carregamento de arquivo</span>
              <input
                ref={inputRef}
                required={isRequired}
                id={`file-upload-${id}`}
                name={`file-upload-${id}`}
                accept={inputType === "image" ? "image/*" : "video/*"}
                type="file"
                className="sr-only"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      </div>
      <div className="text-right">
        <label className="text-right text-sm mt-1 text-greyscale-text-caption">
          o arquivo deve conter no maximo {(maxSize / (1024 * 1024)).toFixed(1)}
          MB
        </label>
      </div>
    </div>
  );
};
