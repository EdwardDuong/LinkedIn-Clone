import axios from './axios.config';

export interface UploadFileResponse {
  url: string;
  publicId: string;
}

/**
 * Upload a file to Cloudinary
 * @param file - The file to upload
 * @param folder - The folder to upload to (e.g., 'profile-pictures', 'posts', 'cover-images')
 * @param onProgress - Optional callback for upload progress
 * @returns Promise with the uploaded file URL and public ID
 */
export const uploadFile = async (
  file: File,
  folder: string = 'general',
  onProgress?: (progressEvent: ProgressEvent) => void
): Promise<UploadFileResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await axios.post<UploadFileResponse>('/fileupload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: onProgress,
  });

  return response.data;
};

/**
 * Upload an image with validation
 * @param file - The image file to upload
 * @param folder - The folder to upload to
 * @param onProgress - Optional callback for upload progress
 * @returns Promise with the uploaded image URL and public ID
 */
export const uploadImage = async (
  file: File,
  folder: string = 'general',
  onProgress?: (progressEvent: ProgressEvent) => void
): Promise<UploadFileResponse> => {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    throw new Error(`File type ${file.type} is not supported. Please upload a JPEG, PNG, or GIF image.`);
  }

  // Validate file size (10MB max)
  const maxSizeInBytes = 10 * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    throw new Error('File size cannot exceed 10MB');
  }

  return uploadFile(file, folder, onProgress);
};

/**
 * Upload a video with validation
 * @param file - The video file to upload
 * @param folder - The folder to upload to
 * @param onProgress - Optional callback for upload progress
 * @returns Promise with the uploaded video URL and public ID
 */
export const uploadVideo = async (
  file: File,
  folder: string = 'general',
  onProgress?: (progressEvent: ProgressEvent) => void
): Promise<UploadFileResponse> => {
  // Validate file type
  const allowedTypes = ['video/mp4', 'video/webm'];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    throw new Error(`File type ${file.type} is not supported. Please upload an MP4 or WebM video.`);
  }

  // Validate file size (10MB max)
  const maxSizeInBytes = 10 * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    throw new Error('File size cannot exceed 10MB');
  }

  return uploadFile(file, folder, onProgress);
};
