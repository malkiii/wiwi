'use server';

import { redirect } from 'next/navigation';
import { getUser, updateUserData } from '~/server/db/user';
import { getHashedPassword, isPasswordValid } from '~/lib/crypto';
import { formSchema } from './schema';

export async function submitAction(data: FormData) {
  const email = data.get('email') as string;
  if (!email) throw new Error('Missing email address!');

  const user = await getUser(email);
  if (!user?.password) throw new Error('User not found!');

  const formData = formSchema.safeParse(Object.fromEntries(data));
  if (!formData.success) throw new Error('Invalid form data!');

  const isSamePassword = await isPasswordValid(formData.data.password, user.password);
  if (isSamePassword) throw new Error("You can't use the same password!");

  const hashedPassword = await getHashedPassword(formData.data.password);

  await updateUserData(user.id, { password: hashedPassword });

  return redirect('/login');
}
