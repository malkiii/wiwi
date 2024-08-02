'use client';

import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from '~/components/session-provider';

import { Form } from '~/components/ui/form';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import { InputField } from '~/components/input-field';
import { SendIcon, CheckIcon } from '~/components/icons';

import { formSchema, type FormValues } from './schema';
import { submitAction } from './action';

export function SupportForm() {
  const { user } = useSession();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: user?.name, email: user?.email },
  });

  const onSubmit = useCallback(async (values: FormValues) => {
    const formData = new FormData();
    formData.set('name', values.name);
    formData.set('email', values.email);
    formData.set('message', values.message);

    try {
      await submitAction(formData);
    } catch (error: any) {
      form.setError('root', { message: error.message });
    }
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <InputField
          name="name"
          control={form.control as any}
          fieldProps={{ placeholder: 'John Doe' }}
        >
          <Label htmlFor="name">Full name</Label>
        </InputField>
        <InputField
          name="email"
          control={form.control as any}
          fieldProps={{ type: 'email', placeholder: 'example@gmail.com' }}
        >
          <Label htmlFor="email">Email address</Label>
        </InputField>
        <InputField
          name="message"
          control={form.control as any}
          fieldProps={{
            maxLength: 2500,
            placeholder: 'Hi, I need help with...',
            className: 'min-h-[180px] max-h-[180px]',
          }}
          isArea
        >
          <Label htmlFor="message">Your message</Label>
        </InputField>
        <Button
          type="submit"
          variant={form.formState.isSubmitSuccessful ? 'outline' : 'default'}
          className={form.formState.isSubmitSuccessful ? 'pointer-events-none' : ''}
          loading={form.formState.isSubmitting}
        >
          {form.formState.isSubmitSuccessful ? (
            <>
              <CheckIcon className="mr-2 size-5" /> Sent successfully!
            </>
          ) : (
            <>
              Submit <SendIcon className="ml-2 size-5" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
