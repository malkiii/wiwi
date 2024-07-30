import { v2 as cloudinary } from 'cloudinary';

type FolderName = 'avatars';

export async function uploadImage(folder: FolderName, dataURL: string, imageId?: string) {
  try {
    const {
      public_id: id,
      width,
      version,
    } = await cloudinary.uploader.upload(dataURL, {
      public_id: imageId,
      filename_override: imageId,
      folder: `wiwi-${folder}`,
    });

    const url = cloudinary.url(id, { width, version });

    return { id, url };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to upload an image!');
  }
}

export async function deleteImage(id: string) {
  return await cloudinary.uploader.destroy(id);
}
