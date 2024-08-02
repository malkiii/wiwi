'use client';

import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { User } from '~/types';

import { Form } from '~/components/ui/form';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import { InputField } from '~/components/input-field';

import { formSchema, type FormValues } from './schema';
import { submitAction } from './action';

export function PasswordResetForm(props: { user: User }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = useCallback(async (values: FormValues) => {
    const formData = new FormData();
    formData.set('email', props.user.email);
    formData.set('password', values.password);
    formData.set('confirm', values.confirm);

    try {
      await submitAction(formData);
    } catch (error: any) {
      form.setError('password', { message: error.message });
    }
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <InputField
          name="password"
          control={form.control as any}
          fieldProps={{ type: 'password', placeholder: '*'.repeat(10) }}
        >
          <Label htmlFor="password">Enter your new password</Label>
        </InputField>
        <InputField
          name="confirm"
          control={form.control as any}
          fieldProps={{ type: 'password', placeholder: '*'.repeat(10) }}
        >
          <Label htmlFor="confirm">Confirm password</Label>
        </InputField>
        <Button type="submit" loading={form.formState.isSubmitting}>
          Change your password
        </Button>
      </form>
    </Form>
  );
}
