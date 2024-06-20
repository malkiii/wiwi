import { eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { users } from '~/server/db/schema';
import { type UserCredentials } from '~/lib/validation';

export async function getUser(email: string) {
  return (await db.select().from(users).where(eq(users.email, email)))[0];
}

export async function createUser(credentials: UserCredentials) {
  return await db.insert(users).values(credentials);
}
