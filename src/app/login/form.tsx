'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Form } from '~/components/ui/form';
import { InputField } from '~/components/input-field';
import { GoogleIcon } from '~/components/icons';

import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, type FormValues } from './schema';

export function LoginForm() {
  const router = useRouter();
  const form = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  const onSubmit = useCallback(async (values: FormValues) => {
    const response = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (!response?.error) return router.push('/app');

    if (response.error === 'AccessDenied') {
      form.setError('password', { message: 'Invalid password!' });
    } else {
      form.setError('email', { message: 'User not found!' });
    }
  }, []);

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <InputField
          name="email"
          control={form.control as any}
          fieldProps={{ placeholder: 'example@gmail.com' }}
        >
          <Label htmlFor="email">Email Address</Label>
        </InputField>
        <InputField
          name="password"
          control={form.control as any}
          fieldProps={{ type: 'password', placeholder: '*'.repeat(10) }}
        >
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
              Forgot your password?
            </Link>
          </div>
        </InputField>
        <Button type="submit" className="w-full" loading={form.formState.isSubmitting}>
          Login
        </Button>
        <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          or continue with
        </div>
        <AuthProviders />
      </form>
    </Form>
  );
}

const providers = [
  {
    name: 'Google',
    icon: GoogleIcon,
  },
];

function AuthProviders() {
  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.currentTarget.disabled = true;
    const submitButton = document.querySelector('form button[type="submit"]')! as HTMLButtonElement;
    submitButton.disabled = true;
  }, []);

  return (
    <>
      {providers.map(provider => (
        <Button
          type="button"
          key={provider.name}
          variant="outline"
          className="w-full gap-4"
          onClick={event => {
            signIn(provider.name.toLowerCase(), { callbackUrl: '/' });
            handleClick(event);
          }}
        >
          <provider.icon /> Login with {provider.name}
        </Button>
      ))}
    </>
  );
}
