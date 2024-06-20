import NextAuth, { type DefaultSession } from 'next-auth';
import { type Adapter } from 'next-auth/adapters';
import { type InferSelectModel } from 'drizzle-orm';
import { DrizzleAdapter } from '@auth/drizzle-adapter';

import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

import { env } from '~/env';
import { db } from '~/server/db';
import { getUser } from '~/server/db/user';
import { accounts, sessions, users } from '~/server/db/schema';
import { authCredentialsSchema } from '~/lib/validation';
import { isPasswordValid } from '~/lib/crypto';

type User = InferSelectModel<typeof users>;

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: User;
  }
}

/**
 * @see https://next-auth.js.org/configuration/options
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }) as Adapter,
  session: {
    strategy: 'jwt',
  },
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider,
    Credentials({
      credentials: {},
      async authorize(credentials) {
        const { email, password } = authCredentialsSchema.parse(credentials);

        const user = await getUser(email);
        if (!user || !user.password) throw new Error('User not found!');

        if (!(await isPasswordValid(password, user.password))) {
          throw new Error('Invalid password!');
        }

        return user;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (!user) return token;

      const dbUser = (await getUser(user.email!)) ?? token.user;

      return { ...token, user: dbUser ?? token.user };
    },
    session: async ({ token, session }) => {
      session.user = token.user;

      return session;
    },
  },
});
