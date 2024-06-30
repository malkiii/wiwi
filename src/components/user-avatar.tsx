'use client';

import { useSession } from '~/app/session-provider';
import { getUserAvatarFallback } from '~/lib/utils';
import { cn } from '~/lib/utils';

type AvatarProps = React.ComponentProps<'div'> & {
  size?: number;
};

export function UserAvatar({ size = 40, className, ...props }: AvatarProps) {
  const { user } = useSession();

  if (!user) return null;

  return (
    <div
      {...props}
      className={cn(
        'relative aspect-square size-10 select-none overflow-hidden rounded-[50%]',
        className,
      )}
    >
      {user.image && (
        <img
          width={size}
          height={size}
          referrerPolicy="no-referrer"
          className="absolute inset-0 z-10"
          src={getOriginalAvatar(user.image)}
          alt={user.name}
        />
      )}
      <span className="absolute inset-0 flex items-center justify-center bg-muted font-normal">
        {getUserAvatarFallback(user.name)}
      </span>
    </div>
  );
}

function getOriginalAvatar(imageSrc: string) {
  const src = new URL(imageSrc);

  switch (src.hostname) {
    case 'lh3.googleusercontent.com':
      return imageSrc.replace(/=s\d+(-c)?/g, '=s360');
    default:
      return imageSrc;
  }
}
