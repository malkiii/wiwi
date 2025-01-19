'use server';

import { formSchema } from './schema';
import { sendVerificationEmail } from '~/lib/email';
import { getUser } from '~/server/db/user';
import { waitUntil } from '@vercel/functions';

export async function submitAction(data: FormData) {
  const formData = formSchema.omit({ terms: true }).safeParse(Object.fromEntries(data));

  if (!formData.success) throw new Error('Invalid form data!');

  const { email, password } = formData.data;
  const name = `${formData.data.firstName} ${formData.data.lastName}`;

  const existingUser = await getUser(email);

  if (existingUser) {
    return {
      field: 'email',
      error: 'User already exists!',
    };
  }

  waitUntil(sendVerificationEmail({ name, email, password }));
}
