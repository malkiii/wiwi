import { notFound } from 'next/navigation';
import { getUser } from '~/server/db/user';
import { verifyToken } from '~/lib/crypto';
import { PasswordResetForm } from './form';
import type { User } from '~/types';

export default async function Page(props: { params: { token: string } }) {
  try {
    const payload = verifyToken(props.params.token) as User;
    const user = await getUser(payload.email);

    if (!user || user.password !== payload.password) throw new Error();

    return <PasswordResetForm user={user} />;
  } catch (error) {
    return notFound();
  }
}
