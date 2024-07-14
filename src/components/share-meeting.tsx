'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '~/components/ui/dialog';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

import { CopyIcon, CheckIcon } from './icons';

import { useClipboard } from 'react-pre-hooks';
import { useSession } from './session-provider';

type ShareMeetingProps = React.ComponentProps<typeof Dialog> & {
  code?: string;
  description?: string;
  onClose?: () => any;
};

export function ShareMeeting({
  code,
  description,
  onClose,
  children,
  ...props
}: ShareMeetingProps) {
  const clipboard = useClipboard();
  const userName = useSession().user!.name;

  const getLink = () => {
    if (typeof window === 'undefined') return '';
    return `${window.location.host}${code ? `/${code}` : window.location.pathname}`;
  };
  const Icon = clipboard.isCopied ? CheckIcon : CopyIcon;

  return (
    <Dialog {...props} open={children ? undefined : !!code}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" value={getLink()} readOnly />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={() => clipboard.copy(getLink())}
          >
            <Icon className="size-4" />
          </Button>
        </div>
        <DialogFooter className="gap-y-2 sm:justify-between">
          <Button
            type="button"
            disabled={typeof window === 'undefined' || !navigator.share}
            onClick={() => {
              navigator.share?.({
                title: 'WiWi',
                text: `${userName} invites you to a meeting.`,
                url: `https://${getLink()}`,
              });
            }}
          >
            Share
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
