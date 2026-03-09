const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

export function getUploadUrl() {
  return `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
}

export function getImageUrl(publicId: string) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
}

export const cloudinaryConfig = { cloudName, uploadPreset };
