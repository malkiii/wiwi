'use server';

import { auth } from '~/server/auth';
import { createNewMeeting } from '~/server/db/meeting';

export async function addNewMeeting() {
  const session = await auth();

  if (!session?.user) throw new Error('Unauthorized');

  return await createNewMeeting(session.user.id);
}
