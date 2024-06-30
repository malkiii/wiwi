'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Button, type ButtonProps } from '~/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '~/components/ui/dialog';

export function LogOutButton(props: ButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const Component = !props.variant ? 'button' : Button;

  return (
    <Dialog open={isLoggingOut ? true : undefined}>
      <DialogTrigger asChild>
        <Component {...props} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-4 text-pretty text-left">
          <DialogTitle>Logout from WiWi</DialogTitle>
          <DialogDescription>Are you sure you want to logout from your account?</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="secondary" disabled={isLoggingOut}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={isLoggingOut}
            onClick={() => {
              setIsLoggingOut(true);
              signOut();
            }}
          >
            Logout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
