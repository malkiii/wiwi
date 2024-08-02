'use client';

import React from 'react';
import Link, { type LinkProps } from 'next/link';
import { useFullscreen } from 'react-pre-hooks';

import { InviteIcon, MaximizeIcon, MinimizeIcon, HelpIcon, FeedbackIcon } from '~/components/icons';

import { ShareMeeting } from '~/components/share-meeting';
import { FeedbackModal } from '~/components/feedback-modal';

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
  ({ onClick, ...props }, ref) => {
    return (
      <FeedbackModal onOpenChange={handleDialogClose(onClick)}>
        <button {...props} ref={ref}>
          <FeedbackIcon className="mr-3 size-5 text-accent-foreground" />
          Give us feedback
        </button>
      </FeedbackModal>
    );
  },
);

FeedbackButton.displayName = 'FeedbackButton';

export const SupportButton = React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'href'>>(
  ({ onClick: _, ...props }, ref) => {
    return (
      <Link {...props} href="/support" target="_blank" ref={ref}>
        <HelpIcon className="mr-3 size-5 text-accent-foreground" />
        Help and Support
      </Link>
    );
  },
);

SupportButton.displayName = 'HelpButton';

function handleDialogClose(handler?: Function) {
  return (opened: boolean) => {
    if (opened) return;
    handler?.({});
    document.body.style.pointerEvents = '';
  };
}
