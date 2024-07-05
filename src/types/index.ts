// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';

declare module 'next-auth/jwt' {
  interface JWT {
    user: User;
  }
}

export type User = Session['user'];

export type MeetingUser = {
  info: User;
  stream: MediaStream | null;
};
