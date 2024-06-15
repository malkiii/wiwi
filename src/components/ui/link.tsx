import { Button } from './button';
import { default as NextLink } from 'next/link';

export type LinkProps = React.ComponentProps<'a'>;

export function Link({ children, ...props }: LinkProps) {
  return (
    <Button variant="link" asChild className="inline p-0 text-foreground">
      {props.href?.startsWith('/') ? (
        <NextLink href={props.href} {...props}>
          {children}
        </NextLink>
      ) : (
        <a {...props} target="_blank">
          {children}
        </a>
      )}
    </Button>
  );
}
