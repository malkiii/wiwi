'use client';

import { getUserAvatarFallback } from '~/lib/utils';
import type { User } from '~/types';
import { cn } from '~/lib/utils';

type AvatarProps = React.ComponentProps<'div'> & {
  user: Pick<User, 'name' | 'image'>;
  size?: number;
};

export function UserAvatar({ user, size = 40, className, ...props }: AvatarProps) {
  return (
    <div
      {...props}
      className={cn(
        'pointer-events-none relative aspect-square w-10 select-none overflow-hidden rounded-[50%]',
        className,
      )}
    >
      {user.image && (
        <img
          width={size}
          height={size}
          referrerPolicy="no-referrer"
          className="absolute inset-0 z-10 italic"
          src={getOriginalAvatar(user.image)}
          alt={user.name}
        />
      )}
      <span className="absolute inset-0 flex items-center justify-center bg-foreground/10 font-normal">
        {getUserAvatarFallback(user.name)}
      </span>
    </div>
  );
}

function getOriginalAvatar(imageSrc: string): string {
  const src = new URL(imageSrc);

  switch (src.hostname) {
    case 'lh3.googleusercontent.com':
      return imageSrc.replace(/=s\d+(-c)?/g, '=s360');
    case 'res.cloudinary.com':
      src.pathname = src.pathname.replace(/w_\d+/g, 'w_360');
      return src.href;
    default:
      return imageSrc;
  }
}
