'use client';

import React from 'react';
import { useFullscreen } from 'react-pre-hooks';
import { useMeetingRoom } from './provider';

import {
  InviteIcon,
  MaximizeIcon,
  MinimizeIcon,
  HelpIcon,
  FeedbackIcon,
  SettingsIcon,
  VideoIcon,
  MicOnIcon,
} from '~/components/icons';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogClose,
} from '~/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

import { ShareMeeting } from '~/components/share-meeting';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { getMediaTracks } from '~/lib/utils';

type ButtonProps = React.ComponentProps<'button'>;

export const InviteButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, ...props }, ref) => {
    return (
      <ShareMeeting onOpenChange={handleDialogClose(onClick)}>
        <button {...props} ref={ref}>
          <InviteIcon className="mr-3 size-5 text-accent-foreground" /> Invite people
        </button>
      </ShareMeeting>
    );
  },
);

InviteButton.displayName = 'InviteButton';

export const FullscreenButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, ...props }, ref) => {
    const fullscreen = useFullscreen();

    const Icon = fullscreen.isEnabled ? MinimizeIcon : MaximizeIcon;

    return (
      <button
        {...props}
        ref={ref}
        disabled={fullscreen.isError}
        onClick={event => {
          fullscreen.toggle();
          onClick?.(event);
        }}
      >
        <Icon className="mr-3 size-5 text-accent-foreground" />
        {fullscreen.isEnabled ? 'Exit Full screen' : 'Enter Full screen'}
      </button>
    );
  },
);

FullscreenButton.displayName = 'FullscreenButton';

export const FeedbackButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick: _, ...props }, ref) => {
    return (
      <button {...props} ref={ref}>
        <FeedbackIcon className="mr-3 size-5 text-accent-foreground" />
        Give us feedback
      </button>
    );
  },
);

FeedbackButton.displayName = 'FeedbackButton';

export const HelpButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick: _, ...props }, ref) => {
    return (
      <button {...props} ref={ref}>
        <HelpIcon className="mr-3 size-5 text-accent-foreground" />
        Help and Support
      </button>
    );
  },
);

HelpButton.displayName = 'HelpButton';

function handleDialogClose(handler?: Function) {
  return (opened: boolean) => {
    if (opened) return;
    handler?.({});
    document.body.style.pointerEvents = '';
  };
}
