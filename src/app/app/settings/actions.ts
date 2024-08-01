'use server';

import { z } from 'zod';
import { updateUserData, deleteUser } from '~/server/db/user';
import { uploadImage } from '~/lib/cloudinary';
import { auth, update } from '~/server/auth';

async function getUserId() {
  const session = await auth();
  if (!session?.user) throw new Error('User not found!');

  return session.user.id;
}

export async function updateUserName(data: FormData) {
  const id = await getUserId();

  const name = z.string().safeParse(data.get('name')).data;
  if (!name) throw new Error('Invalid Username!');

  try {
    await updateUserData(id, { name });
    await update({ user: { name } });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update username!');
  }
}

export async function updateUserImage(data: FormData) {
  const id = await getUserId();

  const imageData = z.string().safeParse(data.get('image')).data;
  if (!imageData) throw new Error('Invalid Image!');

  const image = await uploadImage('avatars', imageData, id);

  try {
    await updateUserData(id, { image });
    await update({ user: { image } });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update image!');
  }
}

export async function deleteUserAccount() {
  const id = await getUserId();

  try {
    await deleteUser(id);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete user account!');
  }
}
