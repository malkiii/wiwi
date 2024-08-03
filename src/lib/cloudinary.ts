import { v2 as cloudinary } from 'cloudinary';
import { env } from '~/env';

type FolderName = 'avatars';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(folder: FolderName, dataURL: string, userId: string) {
  try {
    const image = await cloudinary.uploader.upload(dataURL, {
      public_id: userId,
      filename_override: userId,
      folder: `wiwi-${folder}`,
    });

    // return cloudinary.url(image.public_id, { width: image.width, version: image.version });
    return getCloudinaryURL(image.public_id, image.version);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to upload an image!');
  }
}

export async function deleteImage(id: string) {
  return await cloudinary.uploader.destroy(id);
}

// temporary solution since cloudinary.url doesn't work
export function getCloudinaryURL(id: string, version: number) {
  return `https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/image/upload/v${version}/${id}`;
}
