'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';

import { useState } from 'react';
import { useTimeout } from 'react-pre-hooks';
import { submitAction } from './action';

type VerificationModalProps = {
  formData: FormData | undefined;
  onClose?: () => any;
};

export function VerificationModal(props: VerificationModalProps) {
  const [isClosed, setIsClosed] = useState(false);

  const email = props.formData?.get('email') as string | null;

  return (
    <Dialog
      open={!isClosed && !!props.formData}
      onOpenChange={isOpen => !isOpen && props.onClose?.()}
    >
      <DialogContent>
        <DialogHeader className="space-y-4 text-pretty text-left">
          <DialogTitle>Please verify your email!</DialogTitle>
          <DialogDescription>
            You are almost there! We sent an email to <strong>{email}</strong>. Just click on the
            link in that email to complete your signup.
          </DialogDescription>
          <DialogDescription>
            If you don&apos;t see it, you may need to check your spam folder. If you still
            can&apos;t find the email, just click the button below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between gap-2">
          <ResendEmailButton {...props} />
          <Button variant="secondary" className="w-fit" onClick={() => setIsClosed(true)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ResendEmailButton(props: VerificationModalProps) {
  const timeout = useTimeout({ timeout: 1000 });

  return (
    <Button
      loading={timeout.isActive}
      className="w-fit"
      onClick={async () => {
        if (!props.formData) return;

        timeout.start();
        await submitAction(props.formData);
      }}
    >
      Resend Verification Email
    </Button>
  );
}
