'use client';

import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Checkbox } from '~/components/ui/checkbox';
import { InputField } from '~/components/input-field';
import { VerificationModal } from './verification-modal';
import { Form, FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form';

import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, type FormValues } from './schema';
import { submitAction } from './action';

export function SignupForm() {
  const [data, setData] = useState<FormData>();
  const form = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  const onSubmit = useCallback(async (values: FormValues) => {
    const formData = new FormData();
    // @ts-ignore
    for (const key in values) formData.append(key, values[key]);

    try {
      await submitAction(formData);
      setData(formData);
    } catch (error: any) {
      form.setError('terms', { message: error.message });
    }
  }, []);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField name="firstName" control={form.control as any}>
              <Label htmlFor="firstName">First name</Label>
            </InputField>
            <InputField name="lastName" control={form.control as any}>
              <Label htmlFor="lastName">Last name</Label>
            </InputField>
          </div>
          <InputField
            name="email"
            control={form.control as any}
            fieldProps={{ placeholder: 'example@gmail.com' }}
          >
            <Label htmlFor="email">Email</Label>
          </InputField>
          <InputField
            name="password"
            control={form.control as any}
            fieldProps={{ type: 'password', placeholder: '6+ characters' }}
          >
            <Label htmlFor="password">Password</Label>
          </InputField>
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="mb-4">
                <div className="flex items-start gap-2">
                  <FormControl>
                    <Checkbox
                      id="terms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5 rounded-[0.3rem]"
                    />
                  </FormControl>
                  <Label htmlFor="terms" className="mt-[0!important] text-pretty leading-normal">
                    I agree with WiWi&apos;s{' '}
                    <Link href="/terms" className="underline">
                      Terms of Service
                    </Link>
                    {' and '}
                    <Link href="/privacy" className="underline">
                      Privacy Policy
                    </Link>
                    .
                  </Label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" loading={form.formState.isSubmitting}>
            Create an account
          </Button>
        </form>
      </Form>
      <VerificationModal formData={data} onClose={() => form.reset()} />
    </>
  );
}
