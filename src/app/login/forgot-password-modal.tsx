'use client';

import { useCallback } from 'react';
import { useAsyncCallback } from 'react-pre-hooks';
import { submitAction } from './password-action';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '~/components/ui/dialog';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

type ModalProps = React.PropsWithChildren<{}>;

export function ForgotPasswordModal({ children }: ModalProps) {
  const sendPasswordResetEmail = useCallback(async () => {
    const input = document.getElementById('user-email') as HTMLInputElement;
    const email = input?.value.trim();

    if (!email) return input?.focus();

    const formData = new FormData();
    formData.set('email', email);

    await submitAction(formData);

    input.value = '';

    return true;
  }, []);

  const {
    data: hasSent,
    callback: submit,
    isPending: isLoading,
    error,
    clear,
  } = useAsyncCallback(sendPasswordResetEmail);

  return (
    <Dialog open={isLoading || undefined}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="max-sm:text-left">
          <DialogTitle>Forgot your password?</DialogTitle>
          <DialogDescription>
            Enter your email address and you will receive a link to reset your password. If you
            didn&apos;t receive an email, try again.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 grid gap-4">
          <Label htmlFor="user-email" className="w-fit">
            Enter your email address
          </Label>
          <Input
            type="email"
            name="email"
            id="user-email"
            placeholder="example@gmail.com"
            onChange={clear}
          />
          {error && <p className="text-xs text-destructive">{error.message}</p>}
          <Button loading={isLoading} onClick={submit}>
            {hasSent ? 'Resend Email' : 'Send'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
