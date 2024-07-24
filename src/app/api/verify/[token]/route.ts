import { type NextRequest } from 'next/server';
import { signIn } from '~/server/auth';

import { createUser, getUser } from '~/server/db/user';
import { getHashedPassword, verifyToken } from '~/lib/crypto';
import { userCredentialsSchema, type UserCredentials } from '~/lib/validation';

type Context = {
  params: { token: string };
};

export async function GET(request: NextRequest, context: Context) {
  const token = context.params.token;
  if (!token) return Response.error();

  const baseUrl = request.nextUrl.origin;

  try {
    const payload = verifyToken(token);
    const credentials = userCredentialsSchema.parse(payload);

    return await signUp(credentials, baseUrl);
  } catch (error) {
    console.error(error);
    return Response.error();
  }
}

async function signUp(credentials: UserCredentials, baseUrl: string) {
  try {
    const existingUser = await getUser(credentials.email);

    if (existingUser) return Response.json({ error: 'User already exists!' }, { status: 400 });

    const hashedPassword = await getHashedPassword(credentials.password);

    await createUser({ ...credentials, password: hashedPassword });

    await signIn('credentials', { ...credentials, redirect: false });

    return Response.redirect(new URL('/app', baseUrl));
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to create user!' }, { status: 500 });
  }
}
