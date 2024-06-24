import NextAuth, { type DefaultSession } from 'next-auth';
import { type Adapter } from 'next-auth/adapters';
import { type InferSelectModel } from 'drizzle-orm';
import { DrizzleAdapter } from '@auth/drizzle-adapter';

import { env } from '~/env';
import { db } from '~/server/db';
import { accounts, sessions, users } from '~/server/db/schema';
import authOptions from '~/auth.config';

type User = InferSelectModel<typeof users>;

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: User;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }) as Adapter,
  session: {
    strategy: 'jwt',
  },
  debug: env.NODE_ENV !== 'production',
  ...authOptions,
});
