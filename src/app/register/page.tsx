import Link from 'next/link';
import type { Metadata } from 'next';
import { Logo } from '~/components/logo';
import { SignupForm } from './form';

export const metadata: Metadata = {
  title: 'Get started',
  description: 'Sign up for a new account on WiWi.',
};

export default function Page() {
  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <div className="grid gap-8">
        <div className="mb-2 grid gap-2 text-center">
          <Logo type="mark" className="mx-auto *:w-24" />
          <h2 className="text-3xl">Get started with WiWi</h2>
        </div>
        <SignupForm />
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-foreground underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
