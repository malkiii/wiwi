'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '~/components/ui/dialog';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

import { CopyIcon, CheckIcon } from './icons';

import { useClipboard } from 'react-pre-hooks';

type ShareMeetingProps = React.ComponentProps<typeof Dialog> & {
  code?: string;
  description?: string;
  onClose?: () => any;
};

export function ShareMeeting({ code, description, onClose, ...props }: ShareMeetingProps) {
  const clipboard = useClipboard();

  const link = code ? `${window.location.host}/${code}` : '';
  const Icon = clipboard.isCopied ? CheckIcon : CopyIcon;

  return (
    <Dialog {...props} open={!!code}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" value={link} readOnly />
          </div>
          <Button type="submit" size="sm" className="px-3" onClick={() => clipboard.copy(link)}>
            <Icon className="size-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
