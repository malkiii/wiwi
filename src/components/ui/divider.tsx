import { cn } from '~/lib/utils';

export function Divider({ className, ...props }: React.ComponentProps<'hr'>) {
  return <hr {...props} className={cn('block h-0 w-full border-t', className)} />;
}
