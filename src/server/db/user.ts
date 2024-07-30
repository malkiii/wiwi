import { eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { users } from '~/server/db/schema';
import { type UserCredentials } from '~/lib/validation';
import type { User } from '~/types';

export async function getUser(email: string) {
  return (await db.select().from(users).where(eq(users.email, email)))[0];
}

export async function createUser(credentials: UserCredentials) {
  return await db.insert(users).values(credentials);
}

export async function updateUserData(id: string, data: Partial<User>) {
  await db.update(users).set(data).where(eq(users.id, id));
}

export async function deleteUser(id: string) {
  return await db.delete(users).where(eq(users.id, id));
}
