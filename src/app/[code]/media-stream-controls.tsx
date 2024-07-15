'use client';

import React from 'react';
import { useForceUpdate } from 'react-pre-hooks';
import { useMeetingRoom } from './meeting-room-provider';
import { cn, getMediaTracks } from '~/lib/utils';

import {
  MicOnIcon,
  MicOffIcon,
  CameraOnIcon,
  CameraOffIcon,
  HandIcon,
  HangUpIcon,
  DropDownMenuIcon,
} from '~/components/icons';
import { Button, type ButtonProps } from '~/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

import {
  InviteButton,
  FullscreenButton,
  FeedbackButton,
  HelpButton,
} from './meeting-room-settings';

type MeiaStateToggleProps = ButtonProps & {
  kind: 'audio' | 'video';
};

export function MeiaStateToggle({ kind, className, ...props }: MeiaStateToggleProps) {
  const { userMedia, room } = useMeetingRoom();

  const getCurrentState = React.useCallback(
    () => getMediaTracks(userMedia.stream)[kind]?.enabled,
    [userMedia.stream],
  );

  const isEnabled = getCurrentState();
  const hasPermission = isEnabled !== undefined;

  const Icon =
    kind === 'audio'
      ? isEnabled
        ? MicOnIcon
        : MicOffIcon
      : isEnabled
        ? CameraOnIcon
        : CameraOffIcon;

  const rerender = useForceUpdate();

  return (
    <Button
      {...props}
      variant={hasPermission ? (isEnabled ? 'secondary' : 'default') : 'destructive'}
      className={cn('aspect-square size-14 rounded-full p-0', className)}
      disabled={!hasPermission}
      onClick={() => {
        const track = getMediaTracks(userMedia.stream)[kind];
        if (!track) return;

        track.enabled = !track.enabled;
        room.sendPeerData({ state: { [kind]: track.enabled } });

        rerender();
      }}
    >
      <Icon className="size-6" />
    </Button>
  );
}

export function MediaStreamSettingsMenu({ className, ...props }: ButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          {...props}
          variant="secondary"
          className={cn('aspect-square size-14 rounded-full p-0', className)}
        >
          <DropDownMenuIcon className="size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end" className="w-[200px] *:w-full [&_button]:p-2">
        <DropdownMenuItem asChild>
          <InviteButton />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <FullscreenButton />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <FeedbackButton />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <HelpButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
