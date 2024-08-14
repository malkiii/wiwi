'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { useAsyncCallback } from 'react-pre-hooks';
import { deleteUserAccount } from './actions';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';

export default function Section() {
  const deleteAccount = React.useCallback(async () => {
    await deleteUserAccount();
    await signOut({ callbackUrl: '/' });

    return true;
  }, []);

  const { data, callback: submit, isPending, error } = useAsyncCallback(deleteAccount);

  const isLoading = isPending || data ? true : undefined;

  return (
    <div className="grid gap-4 rounded-lg border p-4">
      <h3 className="inline-block text-lg font-bold leading-normal">Delete Account</h3>
      <p className="my-0 text-sm">
        Once you delete your account, you will not have access to it anymore. Please be certain.
      </p>
      {error && <p className="mt-2 text-xs text-destructive">{error.message}</p>}
      <Dialog open={isLoading}>
        <DialogTrigger asChild>
          <Button variant="destructive" className="inline-flex w-fit">
            Delete your account
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>Are you sure you want to delete your account?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" tabIndex={0}>
                Cancel
              </Button>
            </DialogClose>
            <Button variant="destructive" loading={isLoading} onClick={submit}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
