'use client';

import { isValidElement } from 'react';
import { type ExternalToast, Toaster as Sonner, toast as sonnerToast } from 'sonner';
import { X } from 'lucide-react';

type ToasterProps = React.ComponentProps<typeof Sonner>;

export const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:justify-between group-[.toaster]:bg-muted group-[.toaster]:text-foreground group-[.toaster]:border-none group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export function toast(message: string, { action, ...props }: ExternalToast = {}) {
  const id = sonnerToast(message, {
    action: (
      <div className="flex w-fit gap-2 *:rounded-sm *:text-xs *:leading-snug">
        {isReactNode(action) ? (
          action
        ) : (
          <button
            className="flex items-center justify-center whitespace-nowrap bg-primary px-3 text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={async e => {
              action?.onClick(e);
              sonnerToast.dismiss(id);
            }}
          >
            {action.label}
          </button>
        )}
        <button
          className="border border-solid border-foreground/10 p-2 transition-colors hover:bg-foreground/20"
          onClick={() => sonnerToast.dismiss(id)}
        >
          <X className="size-4" />
        </button>
      </div>
    ),
    ...props,
  });

  return id;
}

function isReactNode(value: unknown): value is React.ReactNode {
  return !value || isValidElement(value) || typeof value === 'string' || typeof value === 'number';
}
