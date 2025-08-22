import React, { useState, useRef, ChangeEvent } from 'react';
import { uploadImage } from '../../../services/api/uploadApi';
import './ImageUpload.css';

interface ImageUploadProps {
  folder?: string;
  onUploadComplete: (url: string, publicId: string) => void;
  onError?: (error: string) => void;
  buttonText?: string;
  showPreview?: boolean;
  accept?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  folder = 'general',
  onUploadComplete,
  onError,
  buttonText = 'Upload Image',
  showPreview = true,
  accept = 'image/jpeg,image/jpg,image/png,image/gif',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error state
    setError(null);

    // Show preview
    if (showPreview) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Upload file
    setIsUploading(true);
    setProgress(0);

    try {
      const result = await uploadImage(file, folder, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
      });

      onUploadComplete(result.url, result.publicId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
      setPreview(null);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="image-upload__input"
        disabled={isUploading}
      />

      {!preview && (
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={isUploading}
          className="image-upload__button"
        >
          {isUploading ? `Uploading... ${progress}%` : buttonText}
        </button>
      )}

      {showPreview && preview && (
        <div className="image-upload__preview">
          <img src={preview} alt="Preview" className="image-upload__preview-image" />
          <button
            type="button"
            onClick={handleRemovePreview}
            className="image-upload__remove"
            disabled={isUploading}
          >
            ✕
          </button>
        </div>
      )}

      {isUploading && (
        <div className="image-upload__progress">
          <div
            className="image-upload__progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && <div className="image-upload__error">{error}</div>}
    </div>
  );
};
