import { type NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

import { getUser } from '~/server/db/user';
import { authCredentialsSchema } from '~/lib/validation';
import { isPasswordValid } from '~/lib/crypto';
import type { User } from '~/types';

export default {
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider,
    Credentials({
      credentials: {},
      async authorize(credentials) {
        const { email } = authCredentialsSchema.parse(credentials);

        const user = await getUser(email);

        if (!user || !user.password) return null;
        else return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, credentials }) {
      if (!credentials) return true;

      const { password } = authCredentialsSchema.parse(credentials);
      const userPassword = (user as User).password!;

      return await isPasswordValid(password, userPassword);
    },
    jwt: async ({ token, user }) => {
      if (!user) return token;

      const dbUser = (await getUser(user.email!)) ?? token.user;

      if (dbUser) console.log('User found:', dbUser.id);

      return { ...token, user: dbUser ?? token.user };
    },
    session: async ({ token, session }) => {
      session.user = token.user;

      return session;
    },
  },
} satisfies NextAuthConfig;
