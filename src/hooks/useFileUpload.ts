import { useState, useCallback } from 'react';

interface UseFileUploadOptions {
  multiple?: boolean;
  maxSize?: number;
  accept?: string[];
}

interface UseFileUploadReturn {
  files: File[];
  previews: string[];
  error: string | null;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearFiles: () => void;
}

export const useFileUpload = ({
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = ['image/jpeg', 'image/png', 'image/gif'],
}: UseFileUploadOptions = {}): UseFileUploadReturn => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    if (maxSize && file.size > maxSize) {
      setError(`File size should not exceed ${maxSize / (1024 * 1024)}MB`);
      return false;
    }

    if (accept && !accept.includes(file.type)) {
      setError(`File type not supported. Accepted types: ${accept.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files || []);
      setError(null);

      if (!multiple && selectedFiles.length > 1) {
        setError('Only one file can be uploaded');
        return;
      }

      const validFiles = selectedFiles.filter(validateFile);

      if (validFiles.length) {
        setFiles(multiple ? [...files, ...validFiles] : [validFiles[0]]);

        // Create previews for image files
        const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
        setPreviews(multiple ? [...previews, ...newPreviews] : [newPreviews[0]]);
      }

      // Reset the input value to allow selecting the same file again
      event.target.value = '';
    },
    [multiple, maxSize, accept, files, previews]
  );

  const clearFiles = useCallback(() => {
    // Revoke object URLs to avoid memory leaks
    previews.forEach((preview) => URL.revokeObjectURL(preview));
    setFiles([]);
    setPreviews([]);
    setError(null);
  }, [previews]);

  return {
    files,
    previews,
    error,
    handleFileSelect,
    clearFiles,
  };
}; 