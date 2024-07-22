import * as React from 'react';

import { cn } from '~/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={1}
        className={cn(
          'inline-block max-h-[calc(4lh+theme(padding.4))] overflow-auto rounded-md border border-input bg-background px-2.5 py-2 text-sm leading-normal ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        onInputCapture={e => {
          e.currentTarget.style.height = 'auto';
          const height = e.currentTarget.scrollHeight;
          e.currentTarget.style.height = `${height + height * 0.04}px`;
        }}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
