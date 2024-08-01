import { WarningIcon } from '~/components/icons';
import { cn } from '~/lib/utils';

type WarningPageProps = React.ComponentProps<'div'> & {
  title: string;
  description?: string;
};

export function WarningPage({ title, description, className, ...props }: WarningPageProps) {
  return (
    <div {...props} className={cn('flex items-center gap-4 px-4 max-sm:flex-col', className)}>
      <WarningIcon className="size-14 max-sm:size-16" />
      <div className="grid gap-2 max-sm:text-center">
        <h2 className="text-3xl">{title}</h2>
        {description && <p className="text-balance text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
