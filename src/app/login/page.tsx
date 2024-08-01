import Link from 'next/link';
import type { Metadata } from 'next';
import { Logo } from '~/components/logo';
import { LoginForm } from './form';

export const metadata: Metadata = {
  title: 'Login',
};

export default function Page() {
  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <div className="grid w-full max-w-sm gap-6">
        <div className="mb-3 grid gap-2 text-center">
          <Logo type="mark" className="mx-auto *:w-24" />
          <h2 className="text-3xl">Login to your Account</h2>
        </div>
        <LoginForm />
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-foreground underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
