'use client';

import React from 'react';
import { useAsyncCallback } from 'react-pre-hooks';
import { submitAction } from './action';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '~/components/ui/dialog';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';

type FeedbackModalProps = React.ComponentProps<typeof Dialog>;

export function FeedbackModal({ children, onOpenChange, ...props }: FeedbackModalProps) {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);

  const submitFeedback = React.useCallback(async () => {
    const message = inputRef.current?.value.trim();
    if (!message) return;

    if (message.length < 25) throw new Error('Your message must be at least 25 characters.');
    if (message.length > 1000) throw new Error('Your message must be at most 1000 characters');

    const formData = new FormData();
    formData.set('message', message);

    await submitAction(formData);
    await new Promise(res => setTimeout(res, 550));

    inputRef.current!.value = '';
    setTimeout(() => closeRef.current?.click(), 50);
  }, []);

  const { callback: submit, isPending, error, clear } = useAsyncCallback(submitFeedback);

  return (
    <Dialog
      {...props}
      open={isPending || undefined}
      onOpenChange={opened => !isPending && onOpenChange?.(opened)}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Give us feedback</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <Textarea
            ref={inputRef}
            onChange={clear}
            className="block max-h-[180px] min-h-[180px] w-full resize-none"
            placeholder="What suggestions do you have? How can we improve?"
          />
          {error && <p className="text-xs text-destructive">{error.message}</p>}
          <div className="flex w-full gap-4 *:flex-grow">
            <DialogClose asChild>
              <Button ref={closeRef} variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button loading={isPending} onClick={submit}>
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
