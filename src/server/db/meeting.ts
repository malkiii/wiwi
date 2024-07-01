import { eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { meetings } from '~/server/db/schema';

export async function getMeeting(id: string) {
  return (await db.select().from(meetings).where(eq(meetings.id, id)))[0];
}

export async function createNewMeeting(userId: string) {
  const id = generateMeetingCode();

  await db.insert(meetings).values({ id, userId });

  return id;
}

function generateMeetingCode(): string {
  const num = Math.random().toString();
  return `${num.slice(2, 5)}-${num.slice(5, 8)}-${num.slice(8, 11)}`;
}
