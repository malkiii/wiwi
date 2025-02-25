'use server';

import { auth } from '~/server/auth';
import { sendEmailMessage } from '~/lib/email';
import { waitUntil } from '@vercel/functions';

export async function submitAction(data: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized!');

  const message = data.get('message') as string;
  if (!message) throw new Error('Message is required.');

  waitUntil(sendEmailMessage('feedback', session.user, message));
}
