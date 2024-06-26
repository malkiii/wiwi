import type { User } from '~/types';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { getUserAvatarFallback } from '~/lib/utils';

type AvatarProps = React.ComponentProps<typeof Avatar> & {
  user: User;
  size?: number;
};

export function UserAvatar({ user, size = 40, ...props }: AvatarProps) {
  return (
    <Avatar {...props}>
      <img
        width={size}
        height={size}
        src={user.image ?? undefined}
        className="select-none"
        referrerPolicy="no-referrer"
        alt={user.name}
      />
      <AvatarFallback>{getUserAvatarFallback(user.name)}</AvatarFallback>
    </Avatar>
  );
}
