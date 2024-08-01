'use client';

import React from 'react';
import { useAsyncCallback } from 'react-pre-hooks';

import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import { useSession } from '~/components/session-provider';

import { updateUserName } from './actions';
import { cn } from '~/lib/utils';

export default function Section() {
  const { user, updateSessionUser } = useSession();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const updateFullName = React.useCallback(async () => {
    if (!inputRef.current) return;

    const name = inputRef.current.value.trim();
    if (name === user!.name) return;

    if (name.length < 3) throw new Error('You name must be at least 3 characters.');
    if (name.length > 35) throw new Error('Your name must be less than 35 characters.');
    if (name.match(/[^a-zA-Z]/)) throw new Error('Your name must contain letters only.');

    const formData = new FormData();
    formData.set('name', name);

    await updateUserName(formData);

    updateSessionUser(curr => curr && { ...curr, name });
  }, [user]);

  const { callback: submit, isPending, error, clear } = useAsyncCallback(updateFullName);

  return (
    <div className="rounded-lg border p-4">
      <Label htmlFor="full-name" className="mb-6 inline-block text-lg font-bold leading-normal">
        Full Name
      </Label>
      <Input
        id="full-name"
        ref={inputRef}
        defaultValue={user!.name}
        placeholder="Type your full name"
        className={cn('block', error && 'border-destructive focus-visible:ring-destructive')}
        disabled={isPending}
        onChange={clear}
      />
      {error && <p className="mt-2 text-xs text-destructive">{error.message}</p>}
      <div className="mt-4 flex items-center gap-4">
        <Button onClick={submit} loading={isPending}>
          Save
        </Button>
        <Button
          variant="outline"
          disabled={isPending}
          onClick={() => {
            inputRef.current!.value = user!.name;
          }}
        >
          Discard
        </Button>
      </div>
    </div>
  );
}
