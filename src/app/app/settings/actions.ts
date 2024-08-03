'use server';

import { z } from 'zod';
import { updateUserData, deleteUser } from '~/server/db/user';
import { uploadImage } from '~/lib/cloudinary';
import { auth, update } from '~/server/auth';

async function getSessionUser() {
  const session = await auth();
  if (!session?.user) throw new Error('User not found!');

  return session.user;
}

export async function updateUserName(data: FormData) {
  const user = await getSessionUser();

  const name = z.string().safeParse(data.get('name')).data;
  if (!name) throw new Error('Invalid Username!');

  try {
    await updateUserData(user.id, { name });
    await update({ user: { name } });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update username!');
  }
}

export async function updateUserImage(data: FormData) {
  const user = await getSessionUser();

  const imageData = z.string().safeParse(data.get('image')).data;
  if (!imageData) throw new Error('Invalid Image!');

  try {
    const image = await uploadImage('avatars', imageData, user.id);

    if (user.image !== image) await updateUserData(user.id, { image });
    await update({ user: { image } });

    return image;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update image!');
  }
}

export async function deleteUserAccount() {
  const user = await getSessionUser();

  try {
    await deleteUser(user.id);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete user account!');
  }
}
