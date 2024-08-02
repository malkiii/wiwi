'use server';

import { sendEmailMessage } from '~/lib/email';
import { formSchema } from './schema';

export async function submitAction(data: FormData) {
  const formData = formSchema.safeParse(Object.fromEntries(data));
  if (!formData.success) throw new Error('Invalid form data.');

  const { message, ...user } = formData.data;

  sendEmailMessage('support', user, message);
}
