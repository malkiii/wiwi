'use server';

import { z } from 'zod';
import { getUser } from '~/server/db/user';
import { sendPasswordChangeEmail } from '~/lib/email';

export async function submitAction(data: FormData) {
  const email = z.string().safeParse(data.get('email')).data;
  if (!email) throw new Error('Invalid Email!');

  const user = await getUser(email);
  if (!user || !user.password) throw new Error('User not found!');

  sendPasswordChangeEmail(user);
}
